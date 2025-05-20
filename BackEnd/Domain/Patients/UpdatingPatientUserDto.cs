using System;

namespace BackEnd.Domain.Patients
{
    public class UpdatingPatientUserDto
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string EmergencyContact { get; set; }
        public string Phone { get; set; }
        public string Address { get; set; }
    }
}