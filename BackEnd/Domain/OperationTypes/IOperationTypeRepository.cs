using System.Collections.Generic;
using System.Threading.Tasks;
using BackEnd.Domain.Shared;

namespace BackEnd.Domain.OperationTypes
{
    public interface IOperationTypeRepository : IRepository<OperationType, OperationTypeId>
    {
        int GetMaxVersionByName(string description);

        Task<List<OperationType>> GetAllAsyncWithFilters(string name, int? specialization, bool? active);
    }
}