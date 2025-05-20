using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Net.Mail;
using BackEnd.Domain.Appointments;
using BackEnd.Domain.Shared;
using BackEnd.Domain.Specializations;

namespace BackEnd.Domain.Staffs
{
    [Table("Staff")]
    public class Staff : Entity<StaffId>, IAggregateRoot
    {
        public int AutoId { get; private set; }
        public string LicenseNumber { get; private set; }
        public string Email { get; private set; }
        public string Phone { get; private set; }
        public string FirstName { get; private set; }
        public string LastName { get; private set; }
        public string FullName { get; private set; }
        public StaffRole Role { get; private set; }
        public List<DateTimeTuple> AvailabilitySlots { get; private set; }
        public bool Active { get; private set; }
        public Specialization Specialization { get; private set; }
        public List<AppointmentPhaseStaff> AppointmentPhaseStaff { get; private set; }

        private Staff() { }

        public Staff(string licenseNumber, string email, string phone, string firstName, string lastName,
        string role, List<DateTimeTuple> availabilitySlots, Specialization specialization)
        {
            if (string.IsNullOrWhiteSpace(licenseNumber)) throw new BusinessRuleValidationException("License number cannot be empty.");
            if (specialization == null) throw new BusinessRuleValidationException("The specialization " + specialization + " does not exist.");
            ValidateParameters(email, phone, firstName, lastName, availabilitySlots);
            if (role == null) throw new BusinessRuleValidationException("The role " + role + " does not exist.");
            this.LicenseNumber = licenseNumber;
            this.Email = email;
            this.Phone = phone;
            this.FirstName = firstName;
            this.LastName = lastName;
            this.FullName = firstName + " " + lastName;
            this.AvailabilitySlots = availabilitySlots;
            this.Active = true;

            this.Role = StaffRole.Parse<StaffRole>(role);

            this.Specialization = specialization;
        }

        public void Update(string email, string phone, string firstName, string lastName, List<DateTimeTuple> availabilitySlots)
        {
            if (this.Active == false) throw new BusinessRuleValidationException("Can't update an inactive staff.");
            ValidateParameters(email, phone, firstName, lastName, availabilitySlots);

            this.Email = email;
            this.Phone = phone;
            this.FirstName = firstName;
            this.LastName = lastName;
            this.FullName = firstName + " " + lastName;
            this.AvailabilitySlots = availabilitySlots;
        }

        private void ValidateParameters(string email, string phone, string firstName, string lastName, List<DateTimeTuple> availabilitySlots)
        {
            if (!IsValidEmailAddres(email)) throw new BusinessRuleValidationException("Email not valid");
            if (string.IsNullOrWhiteSpace(email)) throw new BusinessRuleValidationException("Email cannot be empty.");
            if (string.IsNullOrWhiteSpace(phone)) throw new BusinessRuleValidationException("Phone cannot be empty.");
            if (string.IsNullOrWhiteSpace(firstName)) throw new BusinessRuleValidationException("First name cannot be empty.");
            if (string.IsNullOrWhiteSpace(lastName)) throw new BusinessRuleValidationException("Last name cannot be empty.");
            if (availabilitySlots == null || availabilitySlots.Count == 0) throw new BusinessRuleValidationException("Missing or invalid availability slots.");
        }
        private bool IsValidEmailAddres(string email)
        {
            var valid = true;
            try
            {
                var emailAddress = new MailAddress(email);
            }
            catch
            {
                valid = false;
            }

            return valid;
        }
        public void Inactivate()
        {
            this.Active = false;
        }

        public void AddPrefix()
        {
            string completeId;
            switch (this.Role)
            {
                case var value when value == StaffRole.Doctor:
                    completeId = "D";
                    break;
                case var value when value == StaffRole.Nurse:
                    completeId = "N";
                    break;
                default:
                    completeId = "O";
                    break;
            }
            completeId += DateTime.Now.Year.ToString();
            completeId += $"{AutoId:00000}";
            this.Id = new StaffId(completeId);
        }

        public StaffDto ToDto()
        {
            StaffDto dto = new();
            dto.Id = Id.AsString();
            dto.Active = Active;
            dto.LicenseNumber = LicenseNumber;
            dto.Email = Email;
            dto.Phone = Phone;
            dto.FirstName = FirstName;
            dto.LastName = LastName;
            dto.FullName = FullName;
            dto.Role = Role.ToString();
            dto.Active = Active;
            dto.AvailabilitySlots = new();
            foreach (DateTimeTuple slot in AvailabilitySlots)
            {
                dto.AvailabilitySlots.Add(new Tuple<DateTime, DateTime>(slot.FromDateTime, slot.ToDateTime));
            }
            dto.Specialization = Specialization.Id.ToInt;
            return dto;
        }

        public override string ToString()
        {
            string text = "Id: " + Id.AsString();
            text += ", LicenseNumber: " + LicenseNumber;
            text += ", Email: " + Email;
            text += ", Phone: " + Phone;
            text += ", FirstName: " + FirstName;
            text += ", LastName: " + LastName;
            text += ", FullName: " + FullName;
            text += ", Role: " + Role.Name.ToString();
            text += ", Specialization: " + Specialization.Name.ToString();
            text += ", State: " + (Active == true ? "Active" : "Inactive");
            //AvailabilitySlots
            return text;
        }
    }
}