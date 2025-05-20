using BackEnd.Domain.Shared;

namespace BackEnd.Domain.OperationTypes
{
    public class OperationTypePhaseName(int id, string name) : Enumeration(id, name)
    {
        public static readonly OperationTypePhaseName AnesthesiaPreparation = new(1, "Anesthesia/patient preparation");
        public static readonly OperationTypePhaseName Surgery = new(2, "Surgery");
        public static readonly OperationTypePhaseName Cleaning = new(3, "Cleaning");
    }
}