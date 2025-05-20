using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using BackEnd.Domain.SurgeryRooms;

namespace BackEnd.Infrastructure.SurgeryRooms
{
    internal class SurgeryRoomEntityTypeConfiguration : IEntityTypeConfiguration<SurgeryRoom>
    {
        public void Configure(EntityTypeBuilder<SurgeryRoom> builder)
        {
            builder.HasKey(b => b.Id);
            builder.Property(b => b.Id)
                .HasColumnType("int")
                .HasConversion<int>(a => Convert.ToInt32(a), b => new SurgeryRoomNumber(b))
                .ValueGeneratedOnAdd();

            builder.Property(x => x.Code).HasMaxLength(8).IsFixedLength();
            builder.HasIndex(x => x.Code).IsUnique();

            builder.Property(x => x.Name).HasMaxLength(100);
        }
    }
}