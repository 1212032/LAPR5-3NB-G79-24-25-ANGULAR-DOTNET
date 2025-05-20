using BackEnd.Domain.Shared;

namespace BackEnd.Domain.PatientRequests
{
    public interface IPatientRequestRepository : IRepository<PatientRequest, PatientRequestId>
    {
        
    }
}