using BackEnd.Domain.Shared;

namespace BackEnd.Domain.Staffs
{
    public class StaffRole(int id, string name) : Enumeration(id, name)
    {
        public static readonly StaffRole Doctor = new(1, "Doctor");
        public static readonly StaffRole Nurse = new(2, "Nurse");
        public static readonly StaffRole Technician = new(3, "Technician");
    }
}