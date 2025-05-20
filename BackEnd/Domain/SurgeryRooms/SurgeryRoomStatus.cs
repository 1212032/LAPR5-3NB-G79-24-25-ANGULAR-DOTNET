using BackEnd.Domain.Shared;

namespace BackEnd.Domain.SurgeryRooms
{
    public class SurgeryRoomStatus(int id, string name) : Enumeration(id, name)
    {
        public static readonly SurgeryRoomStatus Available = new(1, "Available");
        public static readonly SurgeryRoomStatus Occupied = new(2, "Occupied");
        public static readonly SurgeryRoomStatus UnderMaintenance = new(3, "Under Maintenance");
    }
}