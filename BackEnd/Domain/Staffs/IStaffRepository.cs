using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using BackEnd.Domain.Shared;

namespace BackEnd.Domain.Staffs
{
    public interface IStaffRepository : IRepository<Staff, StaffId>
    {
        Task<List<Staff>> GetAllAsyncWithFilters(string name, string phone,
        string email, string licenseNumber, int? specialization, string role, bool? active);

        Task<Staff> GetByEmailAsync(string email);
    }
}