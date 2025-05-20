using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using BackEnd.Domain.Shared;

namespace BackEnd.Domain.OperationRequests
{
    public interface IOperationRequestRepository : IRepository<OperationRequest, OperationRequestId>
    {
        //operation type, patient name, patient medical record number, date range
        //filter by date of requeste, priority and expected due date
        Task<List<OperationRequest>> GetAllAsyncWithFilters(
            string priority,
            int? operationtype,
            string doctorEmail,
            string patientName,
            string patientMedicalRecordNumber,
            DateTime? startDate,
            DateTime? endDate
        );

        Task<List<OperationRequest>> GetByPatientId(string patientId);
    }
}