using System;
using System.Collections.Generic;

namespace BackEnd.Domain.OperationTypes
{
    public class OperationTypeDto : CreatingOperationTypeDto
    {
        public int Id { get; set; }
        public bool Active { get; set; }
    }

    public class CreatingOperationTypeDto
    {
        public string Name { get; set; }
        public List<OperationTypeDtoPhase> Phases { get; set; }
    }

    public class OperationTypeDtoPhase
    {
        public string Name { get; set; }
        public int Duration { get; set; }
        public Dictionary<int, int> Specializations { get; set; } //<SpecializationId,Count>
    }
}