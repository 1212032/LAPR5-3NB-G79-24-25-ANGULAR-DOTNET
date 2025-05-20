using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using BackEnd.Domain.Shared;
using BackEnd.Domain.Specializations;

namespace BackEnd.Domain.OperationTypes
{
    public class OperationTypePhaseSpecialization
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; private set; }
        public Specialization Specialization { get; private set; }
        public int Count { get; private set; }

        public OperationTypePhaseSpecialization() { }

        public OperationTypePhaseSpecialization(Specialization specialization, int count)
        {
            if (specialization == null)
                throw new BusinessRuleValidationException("Missing phase specialization.");
            this.Specialization = specialization;
            if (count<=0)
                throw new BusinessRuleValidationException("Phase specialization count cannot be zero.");
            this.Count = count;
        }
    }
}