using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BackEnd.Domain.PatientRequests;
using BackEnd.Infrastructure.Shared;
using Microsoft.EntityFrameworkCore;

namespace BackEnd.Infrastructure.PatientRequests
{
    public class PatientRequestRepository : BaseRepository<PatientRequest, PatientRequestId>, IPatientRequestRepository
    {
        private readonly BackEnd_DbContext _context;

        public PatientRequestRepository(BackEnd_DbContext context) : base(context.PatientRequests)
        {
            this._context = context;
        }
    }
}