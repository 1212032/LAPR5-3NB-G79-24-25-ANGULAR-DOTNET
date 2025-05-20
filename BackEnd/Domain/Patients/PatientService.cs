using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BackEnd.Domain.Appointments;
using BackEnd.Domain.OperationRequests;
using BackEnd.Domain.Patients;
using BackEnd.Domain.Shared;
using Microsoft.EntityFrameworkCore;

namespace BackEnd.Services
{
    public class PatientService
    {
        private readonly IPatientRepository _patientRepo;
        private readonly IOperationRequestRepository _operationRequestRepo;
        private readonly IAppointmentRepository _appointmentRepo;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ISystemChangeLogRepository _changeLogRepository;
        private const string TABLE_NAME = "Patient";
        public PatientService(IPatientRepository patientRepo, IUnitOfWork unitOfWork, ISystemChangeLogRepository changeLogRepository,
        IOperationRequestRepository operationRequestRepo, IAppointmentRepository appointmentRepo)
        {
            _patientRepo = patientRepo;
            _operationRequestRepo = operationRequestRepo;
            _appointmentRepo = appointmentRepo;
            _unitOfWork = unitOfWork;
            _changeLogRepository = changeLogRepository;
        }

        public async Task<PatientDto> AddAsync(CreatePatientDto dto)
        {
            Patient patient;
            try
            {
                patient = new Patient(
                    dto.FirstName,
                    dto.LastName,
                    $"{dto.FirstName} {dto.LastName}",
                    dto.EmergencyContact,
                    dto.Gender,
                    dto.DateOfBirth,
                    dto.Email,
                    dto.Phone,
                    dto.Address
                );

                patient = await _patientRepo.AddAsync(patient);
                await _unitOfWork.CommitAsync();
                patient.AddPrefix();

                string newValues = patient.ToString();
                SystemChangeLog changeLog = new SystemChangeLog(
                 tableId: patient.Id.AsString(),
                 table: TABLE_NAME,
                 oldValues: null,
                 newValues: newValues,
                 changedBy: "Admin",
                 logType: "Create"
                 );
                await _changeLogRepository.AddAsync(changeLog);
                await _unitOfWork.CommitAsync();
            }
            catch (DbUpdateException ex)
            {
                if (ex.InnerException.Message.Contains("IX_Patient_Email"))
                    throw new DbUpdateException("Patient email already exists");
                if (ex.InnerException.Message.Contains("IX_Patient_Phone"))
                    throw new DbUpdateException("Patient phone already exists");
                throw;
            }

            return patient.ToDto();
        }

        public async Task<PatientDto> GetByIdAsync(PatientMedicalRecordNumber id)
        {
            Patient patient = await _patientRepo.GetByIdAsync(id);
            return patient?.ToDto();
        }

        public async Task<List<PatientDto>> GetAllAsync()
        {
            List<Patient> patients = await _patientRepo.GetAllAsync();
            return patients.Select(p => p.ToDto()).ToList();
        }

        public async Task<List<PatientDto>> SearchPatientsAsync(string name, string email, DateTime? dateOfBirth,
            string medicalRecordNumber, string medicalRecord, int pageNumber, int pageSize)
        {
            if (pageNumber <= 0 || pageSize <= 0) pageNumber = 1; pageSize = 999999;
            List<Patient> patients = await _patientRepo.SearchPatientsAsync(name, email, dateOfBirth, medicalRecordNumber, medicalRecord, pageNumber, pageSize);
            return patients.Select(p => p.ToDto()).ToList();
        }

        public async Task<PatientDto> UpdateAsync(PatientDto dto)
        {
            Patient patient;
            try
            {
                patient = await _patientRepo.GetByIdAsync(new PatientMedicalRecordNumber(dto.Id));
                if (patient == null) return null;

                string oldValues = patient.ToString();

                patient.UpdatePersonalInfo(
                    dto.FirstName ?? patient.FirstName,
                    dto.LastName ?? patient.LastName,
                    $"{dto.FirstName ?? patient.FirstName} {dto.LastName ?? patient.LastName}",
                    dto.EmergencyContact ?? patient.EmergencyContact,
                    dto.Gender ?? patient.Gender.Name,
                    dto.DateOfBirth != default ? dto.DateOfBirth : patient.DateOfBirth,
                    dto.Email ?? patient.Email,
                    dto.Phone ?? patient.Phone,
                    dto.Address ?? patient.Address
                );

                string newValues = patient.ToString();
                SystemChangeLog changeLog = new SystemChangeLog(
                    tableId: patient.Id.AsString(),
                    table: TABLE_NAME,
                    oldValues: oldValues,
                    newValues: newValues,
                    changedBy: "Admin",
                    logType: "Edit"
                );

                await _changeLogRepository.AddAsync(changeLog);
                await _unitOfWork.CommitAsync();
            }
            catch (DbUpdateException ex)
            {
                if (ex.InnerException.Message.Contains("IX_Patient_Email"))
                    throw new DbUpdateException("Patient email already exists");
                if (ex.InnerException.Message.Contains("IX_Patient_Phone"))
                    throw new DbUpdateException("Patient phone already exists");
                throw;
            }
            return patient.ToDto();
        }

        public async Task<string> DeletePatientAsync(string id)
        {
            Patient patient = await _patientRepo.GetByIdAsync(new PatientMedicalRecordNumber(id));
            if (patient == null) return null;

            List<OperationRequest> opRequestList = await _operationRequestRepo.GetByPatientId(patient.Id.AsString());
            if (opRequestList.Count > 0)
            {
                throw new BusinessRuleValidationException("Can't delete/anonymize patient because there are pending operation requests.");
            }

            bool canDelete = false;
            Appointment lastAppointment = await _appointmentRepo.GetLastCompletedByPatientId(patient.Id.AsString());
            if (lastAppointment != null)
            {
                DateTime today = new DateTime();
                DateTime dateTimeOfLastAppointment = lastAppointment.DateTime;
                dateTimeOfLastAppointment.AddYears(5);
                if (today < dateTimeOfLastAppointment)
                {
                    throw new BusinessRuleValidationException("Can't delete/anonymize patient because there is an appointment history within the last 5 years.");
                }
            }
            else
            {
                canDelete = true;
            }

            if (canDelete)
            {
                string oldValues = patient.ToString();
                SystemChangeLog changeLog = new SystemChangeLog(
                        tableId: patient.Id.AsString(),
                        table: TABLE_NAME,
                        oldValues: oldValues,
                        newValues: null,
                        changedBy: "Admin",
                        logType: "Delete"
                    );
                await _changeLogRepository.AddAsync(changeLog);
                _patientRepo.Remove(patient);
                await _unitOfWork.CommitAsync();
                return "Patient deleted successfully";
            }
            else
            {
                patient.Anonymize();
                _changeLogRepository.DeleteByTableId(TABLE_NAME, patient.Id.AsString());
                await _unitOfWork.CommitAsync();
                return "Patient anonymized successfully";
            }
        }
    }
}