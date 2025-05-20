using BackEnd.Domain.Shared;

namespace BackEnd.Domain.OperationRequests
{
    public class OperationRequestStatus(int id, string name) : Enumeration(id, name)
    {
        public static readonly OperationRequestStatus Scheduled = new(1, "Scheduled");
        public static readonly OperationRequestStatus Pending = new(2, "Pending");
    }
}