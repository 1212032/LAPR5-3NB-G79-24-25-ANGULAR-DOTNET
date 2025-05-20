using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using BackEnd.Domain.Shared;

namespace BackEnd.Infrastructure.Shared
{
    internal class SystemChangeLogConfiguration : IEntityTypeConfiguration<SystemChangeLog>
    {
        public void Configure(EntityTypeBuilder<SystemChangeLog> builder)
        {
            builder.HasKey(b => b.Id);
            builder.Property(b => b.Id)
                .HasColumnType("int")
                .HasConversion<int>(a => Convert.ToInt32(a), b => new SystemChangeLogId(b))
                .ValueGeneratedOnAdd();
            builder.Property(b=> b.TableId)
                .IsRequired();
            builder.Property(b => b.Table)
                   .IsRequired();
            builder.Property(b => b.OldValues);
            builder.Property(b => b.NewValues);
            builder.Property(b => b.ChangeDate)
                   .IsRequired();
            builder.Property(b => b.ChangedBy);
            builder.HasIndex(b => b.ChangeDate);
            builder.HasIndex(b => b.TableId);
            builder.HasIndex(b => b.Table);
        }
    }

}