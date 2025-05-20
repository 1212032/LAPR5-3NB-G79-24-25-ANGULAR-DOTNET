using BackEnd.Domain.Shared;

namespace BackEnd.Domain.Appointments
{
    public class AppointmentStatus(int id, string name) : Enumeration(id, name)
    {
        public static readonly AppointmentStatus Scheduled = new(1, "Scheduled");
        public static readonly AppointmentStatus Completed = new(2, "Completed");
        public static readonly AppointmentStatus Canceled = new(3, "Canceled");
    }
}