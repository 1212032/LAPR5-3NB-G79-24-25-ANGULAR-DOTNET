using System.Collections.Generic;
using System.Threading.Tasks;
using BackEnd.Domain.Shared;

namespace BackEnd.Domain.SurgeryRooms
{
    public interface ISurgeryRoomRepository : IRepository<SurgeryRoom, SurgeryRoomNumber>
    {
        Task<List<SurgeryRoom>> GetAllAsyncWithFilters(string code, string name, string description, bool? forSurgery);

        Task<SurgeryRoom> GetByCodeAsync(string code);
    }
}