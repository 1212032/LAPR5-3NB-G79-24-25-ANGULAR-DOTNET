using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using BackEnd.Domain.OperationRequests;
using BackEnd.Domain.OperationTypes;
using BackEnd.Domain.Patients;
using BackEnd.Domain.Shared;
using BackEnd.Domain.Staffs;

namespace BackEnd.Services
{
    public class OperationRequestService
    {
        private readonly IOperationRequestRepository _operationRepo;
        private readonly IStaffRepository _staffRepo;
        private readonly IOperationTypeRepository _operationTypeRepo;
        private readonly IPatientRepository _patientTypeRepo;
        private readonly ISystemChangeLogRepository _changeLogRepository;
        private const string TABLE_NAME = "OperationRequest";
        private readonly IUnitOfWork _unitOfWork;
        private readonly IAuthzService _authz;

        public OperationRequestService(IOperationRequestRepository operationRepo, IStaffRepository staffRepo,
                            IOperationTypeRepository operationTypeRepo, IPatientRepository patientTypeRepo,
                            IUnitOfWork unitOfWork, ISystemChangeLogRepository changeLogRepository, IAuthzService authz)
        {
            _operationRepo = operationRepo;
            _staffRepo = staffRepo;
            _operationTypeRepo = operationTypeRepo;
            _patientTypeRepo = patientTypeRepo;
            _unitOfWork = unitOfWork;
            _changeLogRepository = changeLogRepository;
            _authz = authz;
        }

        public async Task<OperationRequestDto> AddAsync(CreatingOperationRequestDto dto)
        {
            var requestedByDoctor = await _staffRepo.GetByEmailAsync(_authz.CurrentUserEmail());
            var operationType = await _operationTypeRepo.GetByIdAsync(new OperationTypeId(dto.OperationType));
            var patient = await _patientTypeRepo.GetByIdAsync(new PatientMedicalRecordNumber(dto.PatientMedicalRecordNumber));

            if (requestedByDoctor == null)
            {
                throw new BusinessRuleValidationException("Requested doctor doesn't exist or not found");
            }
            if (operationType == null)
            {
                throw new BusinessRuleValidationException("Operation type doesn't exist or not found");
            }
            if (patient == null)
            {
                throw new BusinessRuleValidationException("Patient doesn't exist or not found");
            }
            var operationRequest = new OperationRequest(
                DateTime.Parse(dto.DeadlineDate),
                dto.Priority,
                requestedByDoctor,
                operationType,
                patient
            );

            operationRequest = await _operationRepo.AddAsync(operationRequest);
            await _unitOfWork.CommitAsync();

            var newValues = operationRequest.ToString();

            SystemChangeLog changeLog = new SystemChangeLog(
                tableId: operationRequest.Id.AsString(),
                table: TABLE_NAME,
                oldValues: "",
                newValues: newValues,
                changedBy: "Doctor",
                logType: "Create"
            );
            await _changeLogRepository.AddAsync(changeLog);

            await _unitOfWork.CommitAsync();

            return operationRequest.ToDto();
        }

        public async Task<OperationRequestDto> GetByIdAsync(OperationRequestId id)
        {
            var operationRequest = await _operationRepo.GetByIdAsync(id);

            //Ensure doctor can not access other doctors operation requests
            if (_authz != null && !operationRequest.RequestedByDoctor.Email.Equals(_authz.CurrentUserEmail()))
                throw new UnauthorizedAccessException("Operation request does not belong to the current doctor!");

            if (operationRequest == null)
                return null;

            return operationRequest.ToDto();
        }

        public async Task<List<OperationRequestDto>> GetAllAsync()
        {
            //Get all operation request for current logged doctor
            return await this.GetAllAsyncWithFilters(null, null, null, null, null, null);
        }

        public async Task<List<OperationRequestDto>> GetAllAsyncWithFilters(
            string priority,
            int? operationtype,
            string patientName,
            string patientMedicalRecordNumber,
            DateTime? startDate,
            DateTime? endDate)
        {
            string userEmail = "";
            if (_authz != null)
                userEmail = _authz.CurrentUserEmail();

            //operation type, patient name, patient medical record number, date range
            //filter by date of requeste, priority and expected due date
            List<OperationRequest> list = await _operationRepo.GetAllAsyncWithFilters(priority, operationtype,
            userEmail, patientName, patientMedicalRecordNumber, startDate, endDate);

            List<OperationRequestDto> listDto = new List<OperationRequestDto>();
            foreach (OperationRequest operationRequest in list)
            {
                OperationRequestDto opRequestDto = operationRequest.ToDto();
                listDto.Add(opRequestDto);
            }
            return listDto;
        }

        public async Task<OperationRequestDto> UpdateAsync(OperationRequestDto dto)
        {
            OperationRequest operationRequest = await this._operationRepo.GetByIdAsync(new OperationRequestId(dto.Id));

            if (operationRequest == null)
                return null;

            if (operationRequest.IsScheduled())
                throw new BusinessRuleValidationException("Operation request already scheduled, cannot be updated.");

            //Ensure doctor can not access other doctors operation requests
            if (_authz != null && !operationRequest.RequestedByDoctor.Email.Equals(_authz.CurrentUserEmail()))
                throw new UnauthorizedAccessException("Operation request does not belong to the current doctor!");

            var requestedByDoctor = await _staffRepo.GetByEmailAsync(_authz.CurrentUserEmail());
            var operationType = await _operationTypeRepo.GetByIdAsync(new OperationTypeId(dto.OperationType));
            var patient = await _patientTypeRepo.GetByIdAsync(new PatientMedicalRecordNumber(dto.PatientMedicalRecordNumber));

            if (requestedByDoctor == null)
            {
                throw new BusinessRuleNotFoundException("Requested doctor doesn't exist or not found");
            }
            if (operationType == null)
            {
                throw new BusinessRuleNotFoundException("Operation type doesn't exist or not found");
            }
            if (patient == null)
            {
                throw new BusinessRuleNotFoundException("Patient doesn't exist or not found");
            }

            var oldValues = operationRequest.ToString();

            operationRequest.Update(DateTime.Parse(dto.DeadlineDate), dto.Priority, requestedByDoctor, operationType, patient);

            var newValues = operationRequest.ToString();
            var changeLog = new SystemChangeLog(
                tableId: operationRequest.Id.AsString(),
                table: TABLE_NAME,
                oldValues: oldValues,
                newValues: newValues,
                changedBy: "Doctor",
                logType: "Edit"
            );

            await _changeLogRepository.AddAsync(changeLog);

            await this._unitOfWork.CommitAsync();
            return operationRequest.ToDto();
        }


        public async Task<OperationRequestDto> DeleteAsync(int id)
        {
            var operationRequest = await this._operationRepo.GetByIdAsync(new OperationRequestId(id));

            if (operationRequest == null)
                return null;

            //Doctors can delete operation requests that has not yet been scheduled.
            if (operationRequest.IsScheduled())
                throw new BusinessRuleValidationException("Operation request already scheduled, cannot be deleted.");

            //Ensure doctor can not access other doctors operation requests
            if (_authz != null && !operationRequest.RequestedByDoctor.Email.Equals(_authz.CurrentUserEmail()))
                throw new UnauthorizedAccessException("Operation request does not belong to the current doctor!");

            var oldValues = operationRequest.ToString();

            var changeLog = new SystemChangeLog(
                tableId: operationRequest.Id.AsString(),
                table: TABLE_NAME,
                oldValues: oldValues,
                newValues: null,
                changedBy: "Doctor",
                logType: "Delete"
            );
            await _changeLogRepository.AddAsync(changeLog);

            this._operationRepo.Remove(operationRequest);
            await this._unitOfWork.CommitAsync();

            return operationRequest.ToDto();
        }



    }
}