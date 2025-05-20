using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using BackEnd.Domain.OperationTypes;
using BackEnd.Domain.Specializations;

namespace BackEnd.Infrastructure.OperationTypes
{
    internal class OperationTypePhaseSpecializationEntityTypeConfiguration : IEntityTypeConfiguration<OperationTypePhaseSpecialization>
    {
        public void Configure(EntityTypeBuilder<OperationTypePhaseSpecialization> builder)
        {
            builder.HasKey(b => b.Id);
            builder.Navigation(e => e.Specialization).AutoInclude();
        }
    }
}