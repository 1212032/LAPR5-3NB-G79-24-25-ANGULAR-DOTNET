using System;
using System.ComponentModel.DataAnnotations.Schema;
using BackEnd.Domain.Shared;

namespace BackEnd.Domain.Specializations
{
    [Table("Specialization")]
    public class Specialization : Entity<SpecializationId>, IAggregateRoot
    {
        public string Code { get; private set; }
        public string Name { get; private set; }
        public string Description { get; private set; }

        private Specialization(){}

        public Specialization(string code, string name, string description = null)
        {
            if (string.IsNullOrWhiteSpace(code))
                throw new BusinessRuleValidationException("Code is required.");
            if (string.IsNullOrWhiteSpace(name))
                throw new BusinessRuleValidationException("Name is required.");

            this.Code = code;
            this.Name = name;
            this.Description = description;
        }

public SpecializationDto ToDto()
{
    return new SpecializationDto
    {
        Id = Id?.ToInt ?? 0,
        Code = Code ?? string.Empty,
        Name = Name ?? string.Empty,
        Description = Description ?? string.Empty
    };
}

        public void Update(string code, string name, string description)
{
    if (string.IsNullOrWhiteSpace(code))
        throw new BusinessRuleValidationException("Code is required.");
    if (string.IsNullOrWhiteSpace(name))
        throw new BusinessRuleValidationException("Name is required.");

    this.Code = code;
    this.Name = name;
    this.Description = description;
}

    }
}