using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Threading.Tasks;
using BackEnd.Domain.Patients;
using BackEnd.Domain.Shared;

namespace BackEnd.Domain.PatientRequests
{
    public class PatientRequestService
    {
        private readonly IPatientRequestRepository _patientRequestRepo;
        private readonly IPatientRepository _patientRepo;
        private readonly IUnitOfWork _unitOfWork;

        public PatientRequestService(IPatientRequestRepository patientRequestRepo, IPatientRepository patientTypeRepo,
        IUnitOfWork unitOfWork)
        {
            _patientRequestRepo = patientRequestRepo;
            _patientRepo = patientTypeRepo;
            _unitOfWork = unitOfWork;
        }

        public async Task<PatientRequestDto> AddAsync(string userEmail, CreatePatientRequestDto dto)
        {
            Patient patient = await _patientRepo.GetByEmailAsync(userEmail);
            if (patient == null)
                throw new BusinessRuleValidationException("Patient profile not found");

            PatientRequest request = new PatientRequest(dto, patient.Id.AsString());

            request = await this._patientRequestRepo.AddAsync(request);
            await this._unitOfWork.CommitAsync();

            return request.ToDto();
        }

        public async Task<PatientDto> GetByEmailAsync(string userEmail)
        {
            Patient patient = await _patientRepo.GetByEmailAsync(userEmail);
            return patient?.ToDto();
        }

        public async Task<List<PatientRequestDto>> GetAllAsync()
        {
            List<PatientRequest> patientRequests = await _patientRequestRepo.GetAllAsync();
            List<PatientRequestDto> patientRequestDto = [];
            for (int i = 0; i < patientRequests.Count; i++)
            {
                if (patientRequests[i].Deleted == false)
                {
                    patientRequestDto.Add(patientRequests[i].ToDto());
                }
            }
            return patientRequestDto;
        }

        public async Task<PatientRequestDto> DeleteAsync(int id)
        {
            PatientRequest patientRequest = await _patientRequestRepo.GetByIdAsync(new PatientRequestId(id));
            if (patientRequest == null) return null;

            patientRequest.MarkAsDeleted();
            await _unitOfWork.CommitAsync();

            return patientRequest.ToDto();
        }
    }
}