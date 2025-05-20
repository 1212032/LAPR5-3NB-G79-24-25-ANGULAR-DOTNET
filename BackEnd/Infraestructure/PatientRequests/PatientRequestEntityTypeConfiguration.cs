using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using BackEnd.Domain.PatientRequests;

namespace BackEnd.Infrastructure.PatientRequests
{
    internal class PatientRequestEntityTypeConfiguration : IEntityTypeConfiguration<PatientRequest>
    {
        public void Configure(EntityTypeBuilder<PatientRequest> builder)
        {
            builder.HasKey(b => b.Id);
            builder.Property(b => b.Id)
                .HasColumnType("int")
                .HasConversion<int>(a => Convert.ToInt32(a), b => new PatientRequestId(b))
                .ValueGeneratedOnAdd();
        }
    }
}