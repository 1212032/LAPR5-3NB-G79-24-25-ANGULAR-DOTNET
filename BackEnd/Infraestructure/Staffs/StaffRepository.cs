using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BackEnd.Domain.Staffs;
using BackEnd.Infrastructure.Shared;
using Microsoft.EntityFrameworkCore;

namespace BackEnd.Infrastructure.Staffs
{
    public class StaffRepository : BaseRepository<Staff, StaffId>, IStaffRepository
    {
        private readonly BackEnd_DbContext _context;

        public StaffRepository(BackEnd_DbContext context) : base(context.Staffs)
        {
            this._context = context;
        }

        public Task<List<Staff>> GetAllAsyncWithFilters(string name, string phone,
            string email, string licenseNumber, int? specialization, string role, bool? active)
        {
            string query = "SELECT Staff.* FROM Staff JOIN Specialization ON Staff.specializationid = Specialization.id WHERE 1=1 ";
            if (!string.IsNullOrEmpty(name))
            {
                query += " AND (Staff.FirstName like '%" + name + "%' or Staff.LastName like '%" + name + "%' or Staff.FullName like '%" + name + "%') ";
            }
            if (!string.IsNullOrEmpty(phone))
            {
                query += " AND Staff.Phone like '%" + phone + "%'";
            }
            if (!string.IsNullOrEmpty(email))
            {
                query += " AND Staff.Email like '%" + email + "%'";
            }
            if (!string.IsNullOrEmpty(licenseNumber))
            {
                query += " AND Staff.LicenseNumber like '%" + licenseNumber + "%'";
            }
            if (specialization != null && specialization > 0)
            {
                query += " AND Specialization.id=" + specialization;
            }
            if (!string.IsNullOrEmpty(role))
            {
                query += " AND Staff.role_name='" + role + "'";
            }
            if (active != null)
            {
                query += " AND Staff.active=" + active;
            }
            return Task.FromResult(_context.Staffs.FromSqlRaw(query).ToList());
        }

        public async Task<Staff> GetByEmailAsync(string email)
        {
            return await _context.Staffs.Where(x => email.Equals(x.Email)).FirstOrDefaultAsync();
        }
    }
}