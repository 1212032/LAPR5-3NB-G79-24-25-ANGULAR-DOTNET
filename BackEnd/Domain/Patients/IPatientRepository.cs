using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using BackEnd.Domain.Shared;

namespace BackEnd.Domain.Patients
{
    public interface IPatientRepository : IRepository<Patient, PatientMedicalRecordNumber>
    {
        Task<List<Patient>> SearchPatientsAsync(
            string name,
            string email,
            DateTime? dateOfBirth,
            string medicalRecordNumber,
            string medicalRecord,
            int pageNumber,
            int pageSize);

        Task<Patient> GetByEmailAsync(string email);
    }
}