using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BackEnd.Domain.Appointments;
using BackEnd.Infrastructure.Shared;
using Microsoft.EntityFrameworkCore;

namespace BackEnd.Infrastructure.Appointments
{
    public class AppointmentRepository : BaseRepository<Appointment, AppointmentId>, IAppointmentRepository
    {
        private readonly BackEnd_DbContext _context;
        public AppointmentRepository(BackEnd_DbContext context) : base(context.Appointments)
        {
            this._context = context;
        }

        public Task<List<Appointment>> GetAppointmentByStaff(string staffId, DateTime fromDateTime, DateTime toDateTime)
        {
            string query = "SELECT Appointment.* FROM Appointment ";
            query += " JOIN AppointmentPhase ON Appointment.Id=AppointmentPhase.AppointmentId ";
            query += " JOIN AppointmentPhaseStaff ON AppointmentPhase.Id=AppointmentPhaseStaff.AppointmentPhaseId ";
            query += " JOIN Staff ON AppointmentPhaseStaff.StaffAutoId=Staff.AutoId ";
            query += " WHERE Staff.Id = '" + staffId + "'";
            query += " AND Appointment.DateTime >= " + fromDateTime.ToString("yyyyMMddHHmmss");
            query += " AND Appointment.DateTime <= " + toDateTime.ToString("yyyyMMddHHmmss");
            return Task.FromResult(_context.Appointments.FromSqlRaw(query).ToList());
        }

        public Task<List<Appointment>> GetAppointmentsByRoom(string roomCode, DateTime fromDateTime, DateTime toDateTime)
        {
            string query = "SELECT Appointment.* FROM Appointment ";
            query += " JOIN SurgeryRoom ON Appointment.RoomId = SurgeryRoom.Id ";
            query += " WHERE SurgeryRoom.Code = '" + roomCode + "'";
            return Task.FromResult(_context.Appointments.FromSqlRaw(query).ToList());
        }

        public Task<Appointment> GetLastCompletedByPatientId(string patientId)
        {
            string query = "SELECT Appointment.* FROM Appointment ";
            query += " JOIN OperationRequest ON OperationRequest.Id=Appointment.OriginatingOnId";
            query += " JOIN Patient ON OperationRequest.patientautoid = Patient.autoid ";
            query += " WHERE Patient.Id= '" + patientId + "' and Appointment.Status_Name='Completed'";
            query += " ORDER BY DateTime DESC LIMIT 1";
            return Task.FromResult(_context.Appointments.FromSqlRaw(query).FirstOrDefault());
        }

        public Task<List<Appointment>> GetAppointments(string patientName, string patientMedicalRecordNumber,
        string roomCode, string priority, DateTime? startDate, DateTime? endDate, string staff)
        {
            string query = "SELECT Appointment.* FROM Appointment ";
            query += " JOIN AppointmentPhase ON AppointmentPhase.AppointmentId=Appointment.Id ";
            query += " JOIN AppointmentPhaseStaff ON AppointmentPhaseStaff.AppointmentPhaseId=AppointmentPhase.Id ";
            query += " JOIN OperationRequest ON OperationRequest.Id=Appointment.OriginatingOnId ";
            query += " JOIN Patient ON OperationRequest.PatientAutoId = Patient.AutoId ";
            query += " JOIN SurgeryRoom ON SurgeryRoom.Id=Appointment.RoomId ";
            query += " JOIN Staff ON Staff.AutoId=AppointmentPhaseStaff.StaffAutoId ";
            query += " WHERE 1=1 ";
            if (!string.IsNullOrEmpty(patientName))
            {
                query += " AND LOWER(Patient.fullname) like '%" + patientName.ToLower() + "%' ";
            }
            if (!string.IsNullOrEmpty(patientMedicalRecordNumber))
            {
                query += " AND Patient.id like '%" + patientMedicalRecordNumber + "%' ";
            }
            if (!string.IsNullOrEmpty(roomCode))
            {
                query += " AND SurgeryRoom.Code = '" + roomCode + "' ";
            }
            if (!string.IsNullOrEmpty(priority))
            {
                query += " AND LOWER(Appointment.Status_Name) like '%" + priority.ToLower() + "%'";
            }
            if (!string.IsNullOrEmpty(staff))
            {
                query += " AND Staff.Id = '" + staff + "' ";
            }
            if (startDate.HasValue)
            {
                query += " AND Appointment.DateTime >= " + startDate.Value.ToString("yyyyMMddHHmmss");
            }
            if (endDate.HasValue)
            {
                query += " AND Appointment.DateTime <= " + endDate.Value.ToString("yyyyMMddHHmmss");
            }
            return Task.FromResult(_context.Appointments.FromSqlRaw(query).ToList());
        }
    }
}