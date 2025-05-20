using System;
using System.ComponentModel.DataAnnotations.Schema;
using Newtonsoft.Json;
using BackEnd.Domain.OperationTypes;
using BackEnd.Domain.Patients;
using BackEnd.Domain.Shared;
using BackEnd.Domain.Staffs;

namespace BackEnd.Domain.OperationRequests
{
    [Table("OperationRequest")]
    public class OperationRequest : Entity<OperationRequestId>, IAggregateRoot
    {
        [JsonIgnore]
        public OperationRequestStatus Status { get; private set; }
        public DateTime DeadlineDate { get; private set; }
        public OperationRequestPriority Priority { get; private set; }
        public Staff RequestedByDoctor { get; private set; } // can only be requested by doctors
        public OperationType OperationType { get; private set; }
        public Patient Patient { get; private set; }


        private OperationRequest() { }

        public OperationRequest(DateTime deadlineDate, string priority, Staff requestedByDoctor, OperationType operationType, Patient patient)
        {
            if (!IsValidParameters(priority))
                throw new ArgumentException("Invalid arguments when creating Operation request, verify priority sintax.");
            this.Status = OperationRequestStatus.Pending;
            this.DeadlineDate = deadlineDate;
            this.Priority = OperationRequestPriority.Parse<OperationRequestPriority>(priority);
            this.RequestedByDoctor = requestedByDoctor;
            this.OperationType = operationType;
            this.Patient = patient;
        }
        private bool IsValidParameters(string priority)
        {
            if (priority == null || string.IsNullOrWhiteSpace(priority))
            {
                return false;
            }

            return true;
        }
        public bool IsScheduled()
        {
            return this.Status.Equals(OperationRequestStatus.Scheduled);
        }

        public void MarkAsScheduled()
        {
            this.Status = OperationRequestStatus.Scheduled;
        }

        public void Update(DateTime deadlineDate, string priority, Staff requestedByDoctor, OperationType operationType, Patient patient)
        {
            this.DeadlineDate = deadlineDate;
            this.Priority = OperationRequestPriority.Parse<OperationRequestPriority>(priority);
            this.RequestedByDoctor = requestedByDoctor;
            this.OperationType = operationType;
            this.Patient = patient;
        }

        public OperationRequestDto ToDto()
        {
            return new OperationRequestDto(
                Id.ToInt,
                Status.ToString(),
                DeadlineDate.ToString(),
                Priority.ToString(),
                OperationType.Id.ToInt,
                Patient.Id.AsString()
            );
        }

        public override string ToString()
        {
            return "RequestedByDoctor:" + RequestedByDoctor.FullName.ToString() + ","
            + " OperationType:" + OperationType.Name + ","
            + " Patient:" + Patient.FullName.ToString() + ","
            + " Status:" + Status.ToString() + ","
            + " DeadlineDate:" + DeadlineDate.ToString() + ","
            + " Priority:" + Priority.ToString() + "";
        }

    }
}