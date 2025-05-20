using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using BackEnd.Domain.Patients;

namespace BackEnd.Infrastructure.Patients
{
    internal class PatientEntityTypeConfiguration : IEntityTypeConfiguration<Patient>
    {
        public void Configure(EntityTypeBuilder<Patient> builder)
        {
            builder.HasKey(b => b.AutoId);
            builder.Property(b => b.AutoId)
                .HasColumnType("int")
                .ValueGeneratedOnAdd();
            
            builder.OwnsOne(p => p.Gender);
            builder.HasIndex(b => b.Email).IsUnique();
            builder.Property(b=> b.Email).IsRequired();
            builder.HasIndex(b => b.Phone).IsUnique();
            builder.Property(b=> b.Phone).IsRequired();
        }
    }
}