using System.Threading.Tasks;
using BackEnd.Domain.Shared;
using BackEnd.Domain.OperationTypes;
using BackEnd.Domain.OperationRequests;
using BackEnd.Domain.Staffs;
using System;
using BackEnd.Domain.SurgeryRooms;
using System.Collections.Generic;
using System.Linq;

namespace BackEnd.Domain.Appointments
{
    public class AppointmentService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IAppointmentRepository _appointmentRepo;
        private readonly IOperationTypeRepository _OperationTypeRepo;
        private readonly IOperationRequestRepository _OperationRequestRepo;
        private readonly IStaffRepository _StaffRepo;
        private readonly ISurgeryRoomRepository _SurgeryRoomRepo;

        public AppointmentService(IUnitOfWork unitOfWork, IAppointmentRepository AppointmentRepo, IOperationTypeRepository OperationTypeRepo,
        IOperationRequestRepository OperationRequestRepo, IStaffRepository StaffRepo, ISurgeryRoomRepository SurgeryRoomRepo)
        {
            this._unitOfWork = unitOfWork;
            this._appointmentRepo = AppointmentRepo;
            this._OperationTypeRepo = OperationTypeRepo;
            this._OperationRequestRepo = OperationRequestRepo;
            this._StaffRepo = StaffRepo;
            this._SurgeryRoomRepo = SurgeryRoomRepo;
        }

        public async Task<List<AppointmentDto>> GetAllAsync(string patientName, string patientMedicalRecordNumber,
        string roomCode, string priority, DateTime? startDate, DateTime? endDate, string staff)
        {
            List<Appointment> appointments = await _appointmentRepo.GetAppointments(patientName, patientMedicalRecordNumber, roomCode, priority, startDate, endDate, staff);
            return appointments.Select(a => a.ToDto()).ToList();
        }

        public async Task<AppointmentDto> GetByIdAsync(int id)
        {
            Appointment appointment = await this._appointmentRepo.GetByIdAsync(new AppointmentId(id));
            if (appointment == null)
                return null;
            return appointment.ToDto();
        }

        public async Task<AppointmentDto> UpdateAsync(UpdatingAppointmentDto dto)
        {
            Appointment appointment = await this._appointmentRepo.GetByIdAsync(new AppointmentId(dto.Id));
            if (appointment == null) return null;

            // fetch room to verify if its available
            SurgeryRoom surgeryRoom = await _SurgeryRoomRepo.GetByCodeAsync(dto.Room);
            if (surgeryRoom == null)
                throw new BusinessRuleValidationException("Surgery room not found");

            if (!appointment.Status.Equals(AppointmentStatus.Scheduled))
                throw new BusinessRuleValidationException("Appointment not scheduled, cannot be updated");

            List<AppointmentPhase> appointmentPhases = await ValidateAppointment(
                appointment.OriginatingOn, surgeryRoom, dto.DateTime, dto.Phases, appointment.Id.ToInt);

            // update appointment
            appointment.Update(dto.DateTime, surgeryRoom, appointmentPhases);

            // commit transaction
            await this._unitOfWork.CommitAsync();
            return appointment.ToDto();
        }

        public async Task<AppointmentDto> AddAsync(CreatingAppointmentDto dto)
        {
            // fetch operation request and if it exists, validate if its not already scheduled
            OperationRequest operationRequest = await _OperationRequestRepo.GetByIdAsync(new OperationRequestId(dto.OriginatingOperationRequest));
            if (operationRequest == null)
                throw new BusinessRuleValidationException("Operation request not found");
            if (operationRequest.Status.Equals(OperationRequestStatus.Scheduled))
                throw new BusinessRuleValidationException("Operation request already scheduled");

            // fetch room to verify if its available
            SurgeryRoom surgeryRoom = await _SurgeryRoomRepo.GetByCodeAsync(dto.Room);
            if (surgeryRoom == null)
                throw new BusinessRuleValidationException("Surgery room not found");

            List<AppointmentPhase> appointmentPhases = await ValidateAppointment(
                operationRequest, surgeryRoom, dto.DateTime, dto.Phases, 0);

            // build and save appointment
            Appointment appointment = new(dto.DateTime, operationRequest, surgeryRoom, appointmentPhases);
            appointment = await this._appointmentRepo.AddAsync(appointment);

            // mark operation request as scheduled
            operationRequest.MarkAsScheduled();

            // commit transaction
            await this._unitOfWork.CommitAsync();
            return appointment.ToDto();
        }

        // Appointment validations to be used in creation and updating
        // When updating, the appointment being updated is removed from the validations to ensure it doesnt overlap itself
        private async Task<List<AppointmentPhase>> ValidateAppointment(OperationRequest operationRequest,
        SurgeryRoom surgeryRoom, DateTime dateTime, List<AppointmentPhaseDto> phases, int appointmentId)
        {
            // calculate total surgery duration to know if the room can hold it
            // build a list of needed specializations for each phase to be validated agaisnt the selected staff
            int surgeryTotalDuration = 0;
            List<List<int>> neededPhasesSpecializations = [];
            for (int i = 0; i < operationRequest.OperationType.Phases.Count; i++)
            {
                surgeryTotalDuration += operationRequest.OperationType.Phases[i].Duration;

                List<int> specializationList = [];
                for (int j = 0; j < operationRequest.OperationType.Phases[i].NeededSpecializations.Count; j++)
                {
                    for (int k = 0; k < operationRequest.OperationType.Phases[i].NeededSpecializations[j].Count; k++)
                    {
                        specializationList.Add(operationRequest.OperationType.Phases[i].NeededSpecializations[j].Specialization.Id.ToInt);
                    }
                }
                neededPhasesSpecializations.Add(specializationList);
            }

            // get all the appointments for the room, then validate if it can hold the surgery for the total duration
            List<Appointment> roomAppointments = await _appointmentRepo.GetAppointmentsByRoom(surgeryRoom.Code, dateTime.AddDays(-1), dateTime.AddDays(1));

            // remove the appointment currently being updated
            if (appointmentId > 0)
                for (int i = 0; i < roomAppointments.Count; i++)
                    if (roomAppointments[i].Id.ToInt == appointmentId)
                        roomAppointments.RemoveAt(i);

            if (!IsRoomAvailable(roomAppointments, surgeryTotalDuration, dateTime))
                throw new BusinessRuleValidationException("Surgery room occupied at that date and time");

            if ((phases.Count != neededPhasesSpecializations.Count) || (phases.Count != operationRequest.OperationType.Phases.Count))
                throw new BusinessRuleValidationException("Wrong number of phases entered");

            // validate the schedule for each staff for each phase
            DateTime phaseStartDateTime = dateTime;
            List<AppointmentPhase> appointmentPhases = [];
            for (int i = 0; i < phases.Count; i++)
            {
                List<AppointmentPhaseStaff> appointmentPhaseStaff = [];

                if (phases[i].Staff.Count != phases[i].Staff.AsEnumerable().Distinct().Count())
                    throw new BusinessRuleValidationException("You can't assign the same staff to different positions in the same phase");

                for (int k = 0; k < phases[i].Staff.Count; k++)
                {
                    // validate if staff exists
                    Staff staff = await _StaffRepo.GetByIdAsync(new StaffId(phases[i].Staff[k]));
                    if (staff == null)
                        throw new BusinessRuleValidationException("Staff id " + phases[i].Staff[k] + " not found");

                    // if the array removal fails, it means that this staff wasnt required for the operation
                    if (!neededPhasesSpecializations[i].Remove(staff.Specialization.Id.ToInt))
                        throw new BusinessRuleValidationException("Phase" + (i + 1) + " is missing the needed staff");

                    int phaseDuration = operationRequest.OperationType.Phases[i].Duration;

                    // get all the appointment of the staff to validate their schedule
                    List<Appointment> staffAppointments = await _appointmentRepo.GetAppointmentByStaff(staff.Id.AsString(), dateTime.AddDays(-1), dateTime.AddDays(1));

                    // remove the appointment currently being updated
                    if (appointmentId > 0)
                        for (int s = 0; s < staffAppointments.Count; s++)
                            if (staffAppointments[s].Id.ToInt == appointmentId)
                                staffAppointments.RemoveAt(s);

                    if (!IsStaffAvailable(staff, staffAppointments, phaseStartDateTime, phaseDuration))
                        throw new BusinessRuleValidationException("Staff id " + phases[i].Staff[k] + " is not available at that date and time");

                    appointmentPhaseStaff.Add(new AppointmentPhaseStaff(staff));
                }

                // after parsing all the staff for the phase, if the array for the specialization needs still has values,
                // it means that one of the specialization needs was not met
                if (neededPhasesSpecializations[i].Count > 0)
                    throw new BusinessRuleValidationException("Phase" + (i + 1) + " is missing the needed staff");

                // increment minutes to move forward the start of the next phase
                phaseStartDateTime = phaseStartDateTime.AddMinutes(operationRequest.OperationType.Phases[i].Duration);

                appointmentPhases.Add(new AppointmentPhase(appointmentPhaseStaff));
            }
            return appointmentPhases;
        }

        // get the times that the surgery room is occupied, and validate if any of the times overlaps with the new one
        private bool IsRoomAvailable(List<Appointment> roomAppointments, int surgeryTotalDuration, DateTime surgeryStartDateTime)
        {
            DateTime surgeryEndDateTime = surgeryStartDateTime;
            surgeryEndDateTime = surgeryEndDateTime.AddMinutes(surgeryTotalDuration);

            for (int i = 0; i < roomAppointments.Count; i++)
            {
                DateTime appointmentStartDateTime = roomAppointments[i].DateTime;
                DateTime appointmentEndDateTime = appointmentStartDateTime;
                for (int j = 0; j < roomAppointments[i].OriginatingOn.OperationType.Phases.Count; j++)
                {
                    appointmentEndDateTime = appointmentEndDateTime.AddMinutes(roomAppointments[i].OriginatingOn.OperationType.Phases[j].Duration);
                }
                if (surgeryStartDateTime.CompareTo(appointmentStartDateTime) <= 0 && surgeryEndDateTime.CompareTo(appointmentEndDateTime) >= 0)
                {
                    return false;
                }
                if (surgeryStartDateTime.CompareTo(appointmentStartDateTime) <= 0 && surgeryEndDateTime.CompareTo(appointmentStartDateTime) >= 0)
                {
                    return false;
                }
                if (surgeryStartDateTime.CompareTo(appointmentStartDateTime) >= 0 && surgeryEndDateTime.CompareTo(appointmentEndDateTime) <= 0)
                {
                    return false;
                }
                if (surgeryStartDateTime.CompareTo(appointmentEndDateTime) <= 0 && surgeryEndDateTime.CompareTo(appointmentEndDateTime) >= 0)
                {
                    return false;
                }
            }
            return true;
        }

        // build a staff timetable and validate if it overlaps with the new time
        private bool IsStaffAvailable(Staff staff, List<Appointment> staffAppointments, DateTime phaseStartDateTime, int phaseDuration)
        {
            // build a list of "fromDateTime" and "toDateTime" based on the staff appointments
            List<Tuple<DateTime, DateTime>> staffTimetable = [];
            for (int i = 0; i < staffAppointments.Count; i++)
            {
                DateTime surgeryStartDateTime = staffAppointments[i].DateTime;
                for (int j = 0; j < staffAppointments[i].OriginatingOn.OperationType.Phases.Count; j++)
                {
                    DateTime surgeryEndDateTime = surgeryStartDateTime;
                    surgeryEndDateTime = surgeryEndDateTime.AddMinutes(staffAppointments[i].OriginatingOn.OperationType.Phases[j].Duration);
                    for (int k = 0; k < staffAppointments[i].Phases[j].PhaseStaff.Count; k++)
                    {
                        if (staffAppointments[i].Phases[j].PhaseStaff[k].Staff.Id.AsString() == staff.Id.AsString())
                        {
                            staffTimetable.Add(new Tuple<DateTime, DateTime>(surgeryStartDateTime, surgeryEndDateTime));
                        }
                    }
                    surgeryStartDateTime = surgeryEndDateTime;
                }
            }

            // validate each element of  the list agaisnt the new appointment time
            DateTime phaseEndDateTime = phaseStartDateTime;
            phaseEndDateTime = phaseEndDateTime.AddMinutes(phaseDuration);
            for (int i = 0; i < staffTimetable.Count; i++)
            {
                if (phaseStartDateTime.CompareTo(staffTimetable[i].Item1) <= 0 && phaseEndDateTime.CompareTo(staffTimetable[i].Item2) >= 0)
                {
                    return false;
                }
                if (phaseStartDateTime.CompareTo(staffTimetable[i].Item1) <= 0 && phaseEndDateTime.CompareTo(staffTimetable[i].Item1) >= 0)
                {
                    return false;
                }
                if (phaseStartDateTime.CompareTo(staffTimetable[i].Item1) >= 0 && phaseEndDateTime.CompareTo(staffTimetable[i].Item2) <= 0)
                {
                    return false;
                }
                if (phaseStartDateTime.CompareTo(staffTimetable[i].Item2) <= 0 && phaseEndDateTime.CompareTo(staffTimetable[i].Item2) >= 0)
                {
                    return false;
                }
            }

            // validate if the appointment time is inside one of the staff availability slots
            for (int i = 0; i < staff.AvailabilitySlots.Count; i++)
            {
                if (staff.AvailabilitySlots[i].FromDateTime.CompareTo(phaseStartDateTime) <= 0 && staff.AvailabilitySlots[i].ToDateTime.CompareTo(phaseEndDateTime) >= 0)
                {
                    return true;
                }
            }
            return false;
        }
    }
}