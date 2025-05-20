using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.RegularExpressions;
using BackEnd.Domain.Shared;

namespace BackEnd.Domain.SurgeryRooms
{
    [Table("SurgeryRoom")]
    public class SurgeryRoom : Entity<SurgeryRoomNumber>, IAggregateRoot
    {
        public string Code { get; private set; }
        public string Name { get; private set; }
        public string Description { get; private set; }
        public bool ForSurgery { get; private set; }

        private SurgeryRoom() { }

        public SurgeryRoom(string code, string name, string description, bool forSurgery)
        {
            ValidateFields(code, name);
            this.Code = code;
            this.Name = name;
            this.Description = description;
            this.ForSurgery = forSurgery;
        }

        public void Update(string code, string name, string description, bool forSurgery)
        {
            ValidateFields(code, name);
            this.Code = code;
            this.Name = name;
            this.Description = description;
            this.ForSurgery = forSurgery;
        }

        private void ValidateFields(string code, string name)
        {
            if (string.IsNullOrWhiteSpace(code))
                throw new BusinessRuleValidationException("Room code cannot be empty");
            if (code.Length != 8)
                throw new BusinessRuleValidationException("Room code must be 8 characters long");
            Match match = Regex.Match(code, @"^([a-zA-Z0-9\-]+)$", RegexOptions.IgnoreCase);
            if (!match.Success)
                throw new BusinessRuleValidationException("The surgery room code has an invalid format");
            if (string.IsNullOrWhiteSpace(name))
                throw new BusinessRuleValidationException("Room name cannot be empty");
        }

        public SurgeryRoomDto ToDto()
        {
            SurgeryRoomDto dto = new();
            dto.Code = Code;
            dto.Name = Name;
            dto.Description = Description;
            dto.ForSurgery = ForSurgery;
            return dto;
        }

        public override string ToString()
        {
            string text = "Code: " + Code;
            text += ", Name: " + Name;
            text += ", Description: " + Description;
            text += ", ForSurgery: " + (ForSurgery == true ? "Active" : "Inactive");
            return text;
        }
    }
}