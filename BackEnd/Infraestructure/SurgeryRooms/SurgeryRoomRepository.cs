using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BackEnd.Domain.SurgeryRooms;
using BackEnd.Infrastructure.Shared;
using Microsoft.EntityFrameworkCore;

namespace BackEnd.Infrastructure.SurgeryRooms
{
    public class SurgeryRoomRepository : BaseRepository<SurgeryRoom, SurgeryRoomNumber>, ISurgeryRoomRepository
    {
        private readonly BackEnd_DbContext _context;

        public SurgeryRoomRepository(BackEnd_DbContext context) : base(context.SurgeryRooms)
        {
            this._context = context;
        }

        public Task<List<SurgeryRoom>> GetAllAsyncWithFilters(string code, string name, string description, bool? forSurgery)
        {
            string query = "SELECT R.* FROM SurgeryRoom R WHERE 1=1 ";
            if (!string.IsNullOrEmpty(code))
            {
                query += " AND R.Code like '%" + code + "%'";
            }
            if (!string.IsNullOrEmpty(name))
            {
                query += " AND R.Name like '%" + name + "%'";
            }
            if (!string.IsNullOrEmpty(description))
            {
                query += " AND R.Description like '%" + description + "%'";
            }
            if (forSurgery != null)
            {
                query += " AND R.ForSurgery=" + forSurgery;
            }
            return Task.FromResult(_context.SurgeryRooms.FromSqlRaw(query).ToList());
        }

        public async Task<SurgeryRoom> GetByCodeAsync(string code)
        {
            return await _context.SurgeryRooms.Where(x => code.Equals(x.Code)).FirstOrDefaultAsync();
        }
    }
}