using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BackEnd.Domain.Specializations;
using BackEnd.Infrastructure.Shared;
using Microsoft.EntityFrameworkCore;

namespace BackEnd.Infrastructure.Specializations
{
    public class SpecializationRepository : BaseRepository<Specialization, SpecializationId>, ISpecializationRepository
    {
        private readonly BackEnd_DbContext _context;

        public SpecializationRepository(BackEnd_DbContext context) : base(context.Specializations)
        {
            _context = context;
        }

        public async Task<bool> ExistsAsync(string code)
        {
            return await _context.Specializations.AnyAsync(s => s.Code == code);
        }

        public IQueryable<Specialization> Query()
        {
            return _context.Specializations.AsQueryable();
        }

        public async Task<List<Specialization>> GetByCriteriaAsync(string code, string name)
        {
            var query = _context.Specializations.AsNoTracking();

            if (!string.IsNullOrWhiteSpace(code))
            {
                query = query.Where(s => s.Code.Contains(code));
            }

            if (!string.IsNullOrWhiteSpace(name))
            {
                query = query.Where(s => s.Name.Contains(name));
            }

            return await query.ToListAsync();
        }
    }
}

