using System;
using System.Collections.Generic;

namespace BackEnd.Domain.Staffs
{
    public class StaffDto : UpdateStaffDto
    {
        public bool Active { get; set; }
        public string FullName { get; set; }
    }
    public class UpdateStaffDto : CreatingStaffDto
    {
        public string Id { get; set; }
    }

    public class CreatingStaffDto
    {
        public string LicenseNumber { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Role { get; set; }
        public List<Tuple<DateTime, DateTime>> AvailabilitySlots { get; set; }
        public int Specialization { get; set; }
    }
}