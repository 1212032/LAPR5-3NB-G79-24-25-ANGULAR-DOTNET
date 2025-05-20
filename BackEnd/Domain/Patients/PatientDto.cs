using System;

namespace BackEnd.Domain.Patients
{
    public class PatientDto : CreatePatientDto
    {
        public string Id { get; set; }
        public string MedicalRecord { get; set; }
    }

    public class CreatePatientDto
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string FullName { get; set; }
        public string EmergencyContact { get; set; }
        public string Gender { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Address { get; set; }
    }
}