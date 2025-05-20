using BackEnd.Domain.Shared;

namespace BackEnd.Domain.SurgeryRooms
{
    public class SurgeryRoomType(int id, string name) : Enumeration(id, name)
    {
        public static readonly SurgeryRoomType OperatingRoom = new(1, "Operating Room");
        public static readonly SurgeryRoomType ConsultationRoom = new(2, "Consultation Room");
        public static readonly SurgeryRoomType ICU = new(3, "ICU");
    }
}