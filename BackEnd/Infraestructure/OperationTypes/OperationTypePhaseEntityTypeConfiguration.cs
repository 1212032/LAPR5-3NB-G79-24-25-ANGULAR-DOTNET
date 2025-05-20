using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using BackEnd.Domain.OperationTypes;
using BackEnd.Domain.Specializations;

namespace BackEnd.Infrastructure.OperationTypes
{
    internal class OperationTypePhaseEntityTypeConfiguration : IEntityTypeConfiguration<OperationTypePhase>
    {
        public void Configure(EntityTypeBuilder<OperationTypePhase> builder)
        {
            builder.HasKey(b => b.Id);
            builder.OwnsOne(b => b.Name);
            builder.Navigation(e => e.NeededSpecializations).AutoInclude();
        }
    }
}