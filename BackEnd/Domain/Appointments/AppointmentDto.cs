using System;
using System.Collections.Generic;

namespace BackEnd.Domain.Appointments
{
    public class AppointmentDto : UpdatingAppointmentDto
    {
        public string Status { get; set; }
        public int OriginatingOperationRequest { get; set; }
        public string PatientId { get; set; }
        public string PatientFullName { get; set; }
        public string SurgeryRoomName { get; set; }
    }
    public class UpdatingAppointmentDto
    {
        public int Id { get; set; }
        public DateTime DateTime { get; set; }
        public string Room { get; set; }
        public List<AppointmentPhaseDto> Phases { get; set; }
    }

    public class CreatingAppointmentDto
    {
        public DateTime DateTime { get; set; }
        public int OriginatingOperationRequest { get; set; }
        public string Room { get; set; }
        public List<AppointmentPhaseDto> Phases { get; set; }
    }

    public class AppointmentPhaseDto
    {
        public List<string> Staff { get; set; }
    }
}