using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using BackEnd.Domain.OperationRequests;
using BackEnd.Domain.Shared;
using BackEnd.Domain.Staffs;
using BackEnd.Domain.SurgeryRooms;

namespace BackEnd.Domain.Appointments
{
    [Table("Appointment")]
    public class Appointment : Entity<AppointmentId>, IAggregateRoot
    {
        public AppointmentStatus Status { get; private set; }
        public DateTime DateTime { get; private set; }
        public OperationRequest OriginatingOn { get; private set; }
        public SurgeryRoom Room { get; private set; }
        public List<AppointmentPhase> Phases { get; private set; }

        private Appointment() { }

        public Appointment(DateTime dateTime, OperationRequest originatingOn, SurgeryRoom room, List<AppointmentPhase> phases)
        {
            if (originatingOn == null)
                throw new BusinessRuleValidationException("Originating operation request cannot be null");
            if (room == null)
                throw new BusinessRuleValidationException("Surgery room cannot be null");
            if (phases == null || phases.Count == 0)
                throw new BusinessRuleValidationException("Appointment phases cannot be null");
            if (dateTime.CompareTo(DateTime.Now) < 0)
                throw new BusinessRuleValidationException("Appointment date/time must be in the future");
            this.Status = AppointmentStatus.Scheduled;
            this.DateTime = dateTime;
            this.OriginatingOn = originatingOn;
            this.Room = room;
            this.Phases = phases;
        }

        public void Update(DateTime dateTime, SurgeryRoom room, List<AppointmentPhase> phases)
        {
            if (room == null)
                throw new BusinessRuleValidationException("Surgery room cannot be null");
            if (phases == null || phases.Count == 0)
                throw new BusinessRuleValidationException("Appointment phases cannot be null");
            if (dateTime.CompareTo(DateTime.Now) < 0)
                throw new BusinessRuleValidationException("Appointment date/time must be in the future");
            this.Status = AppointmentStatus.Scheduled;
            this.DateTime = dateTime;
            this.Room = room;
            this.Phases = phases;
        }

        public void MarkAsCompleted()
        {
            this.Status = AppointmentStatus.Completed;
        }

        public AppointmentDto ToDto()
        {
            List<AppointmentPhaseDto> phasesDto = [];
            for (int i = 0; i < Phases.Count; i++)
            {
                List<string> staffList = [];
                for (int j = 0; j < Phases[i].PhaseStaff.Count; j++)
                {
                    staffList.Add(Phases[i].PhaseStaff[j].Staff.Id.AsString());
                }
                AppointmentPhaseDto phaseStaffDto = new AppointmentPhaseDto();
                phaseStaffDto.Staff = staffList;
                phasesDto.Add(phaseStaffDto);
            }
            AppointmentDto appointmentDto = new AppointmentDto();
            appointmentDto.Phases = phasesDto;
            appointmentDto.DateTime = DateTime;
            appointmentDto.OriginatingOperationRequest = OriginatingOn.Id.ToInt;
            appointmentDto.Room = Room.Code;
            appointmentDto.Id = Id.ToInt;
            appointmentDto.Status = Status.Name;
            appointmentDto.PatientId = OriginatingOn.Patient.Id.AsString();
            appointmentDto.PatientFullName = OriginatingOn.Patient.FullName;
            appointmentDto.SurgeryRoomName = Room.Name;
            return appointmentDto;
        }
    }
}