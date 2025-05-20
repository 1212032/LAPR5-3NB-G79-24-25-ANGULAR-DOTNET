using System;
using System.ComponentModel.DataAnnotations.Schema;
using System.Net.Mail;
using BackEnd.Domain.Shared;

namespace BackEnd.Domain.PatientRequests
{
    [Table("PatientRequest")]
    public class PatientRequest : Entity<PatientRequestId>, IAggregateRoot
    {
        public string RequestType { get; private set; }
        public string FirstName { get; private set; }
        public string LastName { get; private set; }
        public string EmergencyContact { get; private set; }
        public string Phone { get; private set; }
        public string Address { get; private set; }
        public string Email { get; private set; }
        public string RequestedBy { get; private set; }
        public bool Deleted { get; private set; }
        public DateTime RequestDateTime { get; private set; }

        private PatientRequest() { }

        public PatientRequest(CreatePatientRequestDto dto, string requestedBy)
        {
            if (!dto.RequestType.ToLower().Equals("update") && !dto.RequestType.ToLower().Equals("delete"))
                throw new BusinessRuleValidationException("Request type must be update or delete");
            this.RequestType = dto.RequestType;
            this.FirstName = dto.FirstName;
            this.LastName = dto.LastName;
            this.EmergencyContact = dto.EmergencyContact;
            this.Phone = dto.Phone;
            this.Address = dto.Address;
            this.Email = dto.Email;
            this.RequestedBy = requestedBy;
            this.RequestDateTime = DateTime.Now;
            this.Deleted = false;
        }

        public void MarkAsDeleted()
        {
            this.Deleted = true;
        }

        public PatientRequestDto ToDto()
        {
            return new PatientRequestDto
            {
                Id = this.Id.ToInt,
                RequestType = this.RequestType,
                FirstName = this.FirstName,
                LastName = this.LastName,
                EmergencyContact = this.EmergencyContact,
                Phone = this.Phone,
                Address = this.Address,
                Email = this.Email,
                RequestedBy = this.RequestedBy,
                RequestDateTime = this.RequestDateTime
            };
        }
    }
}