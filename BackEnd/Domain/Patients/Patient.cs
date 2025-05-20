using System;
using System.ComponentModel.DataAnnotations.Schema;
using System.Net.Mail;
using BackEnd.Domain.Shared;

namespace BackEnd.Domain.Patients
{
    [Table("Patient")]
    public class Patient : Entity<PatientMedicalRecordNumber>, IAggregateRoot
    {
        public int AutoId { get; private set; }
        public string FirstName { get; private set; }
        public string LastName { get; private set; }
        public string FullName { get; private set; }
        public string MedicalRecord { get; private set; }
        public string EmergencyContact { get; private set; }
        public string AppointmentHistory { get; private set; }
        public PatientGender Gender { get; private set; }
        public DateTime DateOfBirth { get; private set; }
        public string Email { get; private set; }
        public string Phone { get; private set; }
        public string Address { get; private set; }

        private Patient() { }

        public Patient(string firstName, string lastName, string fullName, string emergencyContact,
        string gender, DateTime dateOfBirth, string email, string phone, string address)
        {
            if (!IsValidEmailAddres(email))
                throw new BusinessRuleValidationException("Email not valid");
            if (string.IsNullOrWhiteSpace(email)) throw new BusinessRuleValidationException("Email is required");
            if (string.IsNullOrWhiteSpace(firstName)) throw new BusinessRuleValidationException("First name is required");
            if (string.IsNullOrWhiteSpace(lastName)) throw new BusinessRuleValidationException("Last name is required");
            if (string.IsNullOrWhiteSpace(phone)) throw new BusinessRuleValidationException("Phone is required");
            if (string.IsNullOrWhiteSpace(gender)) throw new BusinessRuleValidationException("Gender is required");


            this.FirstName = firstName;
            this.LastName = lastName;
            this.FullName = fullName;
            this.EmergencyContact = emergencyContact;
            this.Gender = PatientGender.Parse<PatientGender>(gender);
            if (Gender == null) throw new BusinessRuleValidationException("The gender " + gender + " does not exist.");
            this.DateOfBirth = dateOfBirth;
            this.Email = email;
            this.Phone = phone;
            this.Address = address;
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
        public void AddPrefix()
        {
            DateTime now = DateTime.Now;
            ulong completeId = ((ulong)now.Year) * 100000000;
            completeId += ((ulong)now.Month) * 1000000;
            completeId += (ulong)AutoId;
            this.Id = new PatientMedicalRecordNumber(completeId.ToString());
        }

        public void UpdatePersonalInfo(string firstName, string lastName, string fullName, string emergencyContact, string gender, DateTime dateOfBirth, string email, string phone, string address)
        {
            this.FirstName = firstName;
            this.LastName = lastName;
            this.FullName = fullName;
            this.EmergencyContact = emergencyContact;
            this.Gender = PatientGender.Parse<PatientGender>(gender);
            if (Gender == null) throw new BusinessRuleValidationException("The gender " + gender + " does not exist.");
            this.DateOfBirth = dateOfBirth;
            this.Email = email;
            this.Phone = phone;
            this.Address = address;
        }

        public PatientDto ToDto()
        {
            return new PatientDto
            {
                Id = this.Id.AsString(),
                MedicalRecord = this.MedicalRecord,
                FirstName = this.FirstName,
                LastName = this.LastName,
                FullName = this.FullName,
                EmergencyContact = this.EmergencyContact,
                Gender = this.Gender.Name,
                DateOfBirth = this.DateOfBirth,
                Email = this.Email,
                Phone = this.Phone,
                Address = this.Address
            };
        }

        public override string ToString()
        {
            string text = "";
            text += "FirstName: " + FirstName + ", ";
            text += "LastName: " + LastName + ", ";
            text += "EmergencyContact: " + EmergencyContact + ", ";
            text += "Gender: " + Gender.Name + ", ";
            text += "DateOfBirth: " + DateOfBirth.Date.ToString() + ", ";
            text += "Email: " + Email + ", ";
            text += "Phone: " + Phone + ", ";
            text += "Address : " + Address + "";
            return text;
        }

        public void Anonymize()
        {
            FirstName = "anonymized";
            LastName = "anonymized";
            FullName = "anonymized";
            EmergencyContact = "anonymized";
            AppointmentHistory = "anonymized";
            Gender = null;
            DateOfBirth = new DateTime();
            Email = "anonymized@" + Id.AsString();
            Phone = "anonymized" + Id.AsString(); ;
            Address = "anonymized";
        }
    }
}