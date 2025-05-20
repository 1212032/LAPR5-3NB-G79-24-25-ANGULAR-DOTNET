using System.Threading.Tasks;
using BackEnd.Domain.Shared;
using BackEnd.Domain.Staffs;

namespace BackEnd.Domain.Shared
{
    public interface ISystemChangeLogRepository : IRepository<SystemChangeLog, SystemChangeLogId>
    {
        void DeleteByTableId(string table, string tableId);
    }
}