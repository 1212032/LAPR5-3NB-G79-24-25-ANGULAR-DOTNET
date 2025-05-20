using System;

namespace BackEnd.Domain.PatientRequests
{
    public class PatientRequestDto : CreatePatientRequestDto
    {
        public int Id { get; set; }
    }

    public class CreatePatientRequestDto
    {
        public string RequestType { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string EmergencyContact { get; set; }
        public string Phone { get; set; }
        public string Address { get; set; }
        public string Email { get; set; }
        public string RequestedBy { get; set; }
        public DateTime RequestDateTime { get; set; }
    }
}