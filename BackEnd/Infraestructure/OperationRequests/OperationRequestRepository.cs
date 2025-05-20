using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BackEnd.Domain.OperationRequests;
using BackEnd.Infrastructure.Shared;
using Microsoft.EntityFrameworkCore;

namespace BackEnd.Infrastructure.OperationRequests
{
    public class OperationRequestRepository : BaseRepository<OperationRequest, OperationRequestId>, IOperationRequestRepository
    {
        private readonly BackEnd_DbContext _context;

        public OperationRequestRepository(BackEnd_DbContext context) : base(context.OperationRequests)
        {
            this._context = context;
        }

        public Task<List<OperationRequest>> GetAllAsyncWithFilters(
            string priority,
            int? operationtype,
            string doctorEmail,
            string patientName,
            string patientMedicalRecordNumber,
            DateTime? startDate,
            DateTime? endDate)
        {
            string query = "SELECT OperationRequest.* FROM OperationRequest ";
            query += " JOIN Patient ON OperationRequest.patientautoid = Patient.autoid ";
            query += " JOIN Staff ON OperationRequest.requestedbydoctorautoid = Staff.autoid ";
            query += " JOIN OperationType ON OperationRequest.operationtypeid = OperationType.id ";
            query += " WHERE 1=1 ";
            if (!string.IsNullOrEmpty(doctorEmail))
            {
                query += " AND Staff.email='" + doctorEmail + "'";
            }
            if (operationtype.HasValue && operationtype > 0)
            {
                query += " AND OperationType.id=" + operationtype;
            }
            if (!string.IsNullOrEmpty(priority))
            {
                query += " AND OperationRequest.priority_name='" + priority + "'";
            }
            if (!string.IsNullOrEmpty(patientName))
            {
                query += " AND Patient.fullname like '%" + patientName + "%'";
            }
            if (!string.IsNullOrEmpty(patientMedicalRecordNumber))
            {
                query += " AND Patient.id like '%" + patientMedicalRecordNumber + "%'";
            }

            //between dates
            if (startDate.HasValue && endDate.HasValue)
            {
                query += " AND OperationRequest.deadlinedate >= " + startDate.Value.ToString("yyyyMMdd") + " AND OperationRequest.deadlinedate <= " + endDate.Value.ToString("yyyyMMdd");
            }
            if (startDate.HasValue)
            {
                query += " AND OperationRequest.deadlinedate >= " + startDate.Value.ToString("yyyyMMdd");
            }
            if (endDate.HasValue)
            {
                query += " AND OperationRequest.deadlinedate <= " + endDate.Value.ToString("yyyyMMdd");
            }
            return Task.FromResult(_context.OperationRequests.FromSqlRaw(query).ToList());
        }

        public Task<List<OperationRequest>> GetByPatientId(string patientId)
        {
            string query = "SELECT OperationRequest.* FROM OperationRequest ";
            query += " JOIN Patient ON OperationRequest.patientautoid = Patient.autoid ";
            query += " WHERE Patient.Id= '" + patientId + "'";
            return Task.FromResult(_context.OperationRequests.FromSqlRaw(query).ToList());
        }
    }
}