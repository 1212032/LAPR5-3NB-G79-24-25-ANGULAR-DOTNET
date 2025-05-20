using System.Threading.Tasks;
using BackEnd.Domain.Shared;

namespace BackEnd.Infrastructure
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly BackEnd_DbContext _context;

        public UnitOfWork(BackEnd_DbContext context)
        {
            this._context = context;
        }

        public async Task<int> CommitAsync()
        {
            return await this._context.SaveChangesAsync();
        }
    }
}