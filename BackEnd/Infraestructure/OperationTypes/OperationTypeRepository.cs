using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BackEnd.Domain.OperationTypes;
using BackEnd.Infrastructure.Shared;
using Microsoft.EntityFrameworkCore;

namespace BackEnd.Infrastructure.OperationTypes
{
    public class OperationTypeRepository : BaseRepository<OperationType, OperationTypeId>, IOperationTypeRepository
    {
        private readonly BackEnd_DbContext _context;

        public OperationTypeRepository(BackEnd_DbContext context) : base(context.OperationTypes)
        {
            this._context = context;
        }

        public int GetMaxVersionByName(string name)
        {
            return _context.OperationTypes.Where(op => op.Name == name).Max(op => op.Version);
        }

        public Task<List<OperationType>> GetAllAsyncWithFilters(string name, int? specialization, bool? active)
        {
            string query = "SELECT OperationType.* " +
                "FROM OperationType " +
                " JOIN OperationTypePhase ON OperationType.Id = OperationTypePhase.OperationTypeId " +
                " JOIN OperationTypePhaseSpecialization ON OperationTypePhase.Id = OperationTypePhaseSpecialization.OperationTypePhaseId " +
                " JOIN Specialization ON OperationTypePhaseSpecialization.SpecializationId = Specialization.Id " +
                " WHERE 1=1 ";
            if (!string.IsNullOrEmpty(name))
            {
                query += " AND LOWER(OperationType.Name) like '%" + name.ToLower() + "%'";
            }
            if (specialization != null && specialization > 0)
            {
                query += " AND Specialization.Id=" + specialization;
            }
            if (active != null)
            {
                query += " AND OperationType.Active=" + active;
            }
            return Task.FromResult(_context.OperationTypes.FromSqlRaw(query).ToList());
        }
    }
}