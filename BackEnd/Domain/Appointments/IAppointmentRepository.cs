using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using BackEnd.Domain.Shared;

namespace BackEnd.Domain.Appointments
{
    public interface IAppointmentRepository : IRepository<Appointment, AppointmentId>
    {
        Task<Appointment> GetLastCompletedByPatientId(string patientId);
        Task<List<Appointment>> GetAppointmentsByRoom(string room, DateTime fromDateTime, DateTime toDateTime);
        Task<List<Appointment>> GetAppointmentByStaff(string staffId, DateTime fromDateTime, DateTime toDateTime);
        Task<List<Appointment>> GetAppointments(string patientName, string patientMedicalRecordNumber,
        string roomCode, string priority, DateTime? startDate, DateTime? endDate, string staff);
    }
}