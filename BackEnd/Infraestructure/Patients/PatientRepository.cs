using BackEnd.Domain.Patients;
using BackEnd.Infrastructure.Shared;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;

namespace BackEnd.Infrastructure.Patients
{
    public class PatientRepository : BaseRepository<Patient, PatientMedicalRecordNumber>, IPatientRepository
    {
        private readonly BackEnd_DbContext _context;

        public PatientRepository(BackEnd_DbContext context) : base(context.Patients)
        {
            this._context = context;
        }

        public async Task<List<Patient>> SearchPatientsAsync(
            string name,
            string email,
            DateTime? dateOfBirth,
            string medicalRecordNumber,
            string medicalRecord,
            int pageNumber,
            int pageSize)
        {
            string query = "SELECT Patient.* FROM Patient WHERE 1=1 ";
            if (!string.IsNullOrEmpty(name))
            {
                query += " AND (Patient.FirstName like '%" + name + "%' or Patient.LastName like '%" + name + "%' or Patient.FullName like '%" + name + "%') ";
            }
            if (!string.IsNullOrWhiteSpace(email))
            {
                query += " AND Patient.Email like '%" + email + "%'";
            }
            if (dateOfBirth.HasValue)
            {
                query += " AND DateOfBirth >= " + dateOfBirth.Value.ToString("yyyyMMdd");
            }
            if (!string.IsNullOrWhiteSpace(medicalRecordNumber))
            {
                query += " AND Patient.Id like '%" + medicalRecordNumber + "%'";
            }
            if (!string.IsNullOrWhiteSpace(medicalRecord))
            {
                query += " AND Patient.MedicalRecord like '%" + medicalRecord + "%'";
            }
            return await _context.Patients.FromSqlRaw(query).Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();
        }

        public async Task<Patient> GetByEmailAsync(string email)
        {
            return await _context.Patients.Where(x => email.Equals(x.Email)).FirstOrDefaultAsync();
        }
    }
}
