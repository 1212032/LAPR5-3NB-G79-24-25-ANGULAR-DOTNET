using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using BackEnd.Domain.Shared;

namespace BackEnd.Domain.OperationTypes
{
    public class OperationTypePhase
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; private set; }
        public OperationType OperationType { get; private set; }
        public OperationTypePhaseName Name { get; private set; }
        public int Duration { get; private set; }

        public List<OperationTypePhaseSpecialization> NeededSpecializations { get; private set; }

        private OperationTypePhase() { }

        public OperationTypePhase(string name, int duration, List<OperationTypePhaseSpecialization> neededSpecializations)
        {
            this.Name = OperationTypePhaseName.Parse<OperationTypePhaseName>(name);
            if (Name == null)
                throw new BusinessRuleValidationException("Phase " + name + " does not exist.");
            if (duration <= 0)
                throw new BusinessRuleValidationException("Phase duration cannot be zero.");
            this.Duration = duration;
            if (neededSpecializations == null || neededSpecializations.Count == 0)
                throw new BusinessRuleValidationException("Phase must have at least one specialization");
            this.NeededSpecializations = neededSpecializations;
        }
    }
}