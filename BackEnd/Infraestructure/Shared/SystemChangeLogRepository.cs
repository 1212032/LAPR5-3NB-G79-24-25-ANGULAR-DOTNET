using System.Linq;
using BackEnd.Domain.Shared;

namespace BackEnd.Infrastructure.Shared
{
    public class SystemChangeLogRepository : BaseRepository<SystemChangeLog, SystemChangeLogId>, ISystemChangeLogRepository
    {
        private readonly BackEnd_DbContext _context;
        public SystemChangeLogRepository(BackEnd_DbContext context) : base(context.SystemChangeLogs)
        {
            this._context = context;
        }
        public void DeleteByTableId(string table, string tableId)
        {
            _context.SystemChangeLogs.Where(x => table.Equals(x.Table) && tableId.Equals(x.TableId));
        }
    }
}