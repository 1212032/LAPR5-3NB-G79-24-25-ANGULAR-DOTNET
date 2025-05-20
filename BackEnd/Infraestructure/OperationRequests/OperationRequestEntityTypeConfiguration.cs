using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using BackEnd.Domain.OperationRequests;

namespace BackEnd.Infrastructure.OperationRequests
{
    internal class OperationRequestEntityTypeConfiguration : IEntityTypeConfiguration<OperationRequest>
    {
        public void Configure(EntityTypeBuilder<OperationRequest> builder)
        {
            builder.HasKey(b => b.Id);
            builder.Property(b => b.Id)
                .HasColumnType("int")
                .HasConversion<int>(a => Convert.ToInt32(a), b => new OperationRequestId(b))
                .ValueGeneratedOnAdd();
            builder.OwnsOne(b => b.Priority);
            builder.OwnsOne(b => b.Status);
            builder.Navigation(b => b.RequestedByDoctor).AutoInclude();
            builder.Navigation(b => b.OperationType).AutoInclude();
            builder.Navigation(b => b.Patient).AutoInclude();
        }
    }
}