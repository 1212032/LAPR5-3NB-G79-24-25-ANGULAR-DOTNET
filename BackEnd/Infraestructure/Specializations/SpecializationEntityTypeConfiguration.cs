using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using BackEnd.Domain.Specializations;

namespace BackEnd.Infrastructure.Specializations
{
    internal class SpecializationEntityTypeConfiguration : IEntityTypeConfiguration<Specialization>
    {
public void Configure(EntityTypeBuilder<Specialization> builder)
{
    builder.HasKey(b => b.Id);

    builder.Property(b => b.Id)
        .HasColumnType("int")
        .HasConversion<int>(a => Convert.ToInt32(a), b => new SpecializationId(b))
        .ValueGeneratedOnAdd();

    builder.Property(b => b.Code)
        .IsRequired()
        .HasMaxLength(20);

    builder.Property(b => b.Name)
        .IsRequired()
        .HasMaxLength(100);

    builder.Property(b => b.Description)
        .HasMaxLength(250);
}

    }
}