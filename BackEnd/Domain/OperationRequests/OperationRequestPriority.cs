using BackEnd.Domain.Shared;

namespace BackEnd.Domain.OperationRequests
{
    public class OperationRequestPriority(int id, string name) : Enumeration(id, name)
    {
        public static readonly OperationRequestPriority Elective = new(1, "Elective");
        public static readonly OperationRequestPriority Urgent = new(2, "Urgent");
        public static readonly OperationRequestPriority Emergency = new(3, "Emergency");
    }
}