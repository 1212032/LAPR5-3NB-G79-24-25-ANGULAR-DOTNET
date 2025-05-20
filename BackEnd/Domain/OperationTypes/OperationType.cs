using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using BackEnd.Domain.Shared;

namespace BackEnd.Domain.OperationTypes
{
    [Table("OperationType")]
    public class OperationType : Entity<OperationTypeId>, IAggregateRoot
    {
        public string Name { get; private set; }
        public int Version { get; private set; }
        public bool Active { get; private set; }
        public List<OperationTypePhase> Phases { get; private set; }

        private OperationType() { }

        public OperationType(string name, List<OperationTypePhase> phases, int version)
        {
            if (string.IsNullOrWhiteSpace(name))
                throw new BusinessRuleValidationException("Operation type name cannot be empty.");
            this.Name = name;
            if (phases == null || phases.Count == 0)
                throw new BusinessRuleValidationException("Operation type must have at least one phase");
            this.Phases = phases;
            this.Active = true;
            if (version <= 0)
                throw new BusinessRuleValidationException("Invalid version number");
            this.Version = version;
        }

        public void Inactivate()
        {
            if (this.Active == false) throw new BusinessRuleValidationException("Can't update an inactive operation type.");
            this.Active = false;
        }

        public OperationTypeDto ToDto()
        {
            OperationTypeDto dto = new();
            dto.Id = Id.ToInt;
            dto.Name = Name;
            dto.Active = Active;
            dto.Phases = new List<OperationTypeDtoPhase>();
            foreach (OperationTypePhase phase in Phases)
            {
                OperationTypeDtoPhase dtoPhase = new();
                dtoPhase.Name = phase.Name.ToString();
                dtoPhase.Duration = phase.Duration;
                dtoPhase.Specializations = new Dictionary<int, int>();

                foreach (OperationTypePhaseSpecialization specialization in phase.NeededSpecializations)
                {
                    dtoPhase.Specializations.Add(specialization.Specialization.Id.ToInt, specialization.Count);
                }
                dto.Phases.Add(dtoPhase);
            }
            return dto;
        }
    }
}