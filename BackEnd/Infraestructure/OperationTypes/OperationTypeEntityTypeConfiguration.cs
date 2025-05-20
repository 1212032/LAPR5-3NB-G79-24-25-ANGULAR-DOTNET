using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using BackEnd.Domain.OperationTypes;

namespace BackEnd.Infrastructure.OperationTypes
{
    internal class OperationTypeEntityTypeConfiguration : IEntityTypeConfiguration<OperationType>
    {
        public void Configure(EntityTypeBuilder<OperationType> builder)
        {
            builder.HasKey(b => b.Id);
            builder.Property(b => b.Id)
                .HasColumnType("int")
                .HasConversion<int>(a => Convert.ToInt32(a), b => new OperationTypeId(b))
                .ValueGeneratedOnAdd();
            builder.HasMany(b => b.Phases).WithOne(b => b.OperationType).IsRequired();
            builder.Navigation(e => e.Phases).AutoInclude();
            builder.HasIndex(p => new {p.Name , p.Version}).IsUnique();
        }
    }
}