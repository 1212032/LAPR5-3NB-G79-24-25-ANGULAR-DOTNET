using System.Threading.Tasks;

namespace BackEnd.Domain.Shared
{
    public interface IUnitOfWork
    {
        Task<int> CommitAsync();
    }
}