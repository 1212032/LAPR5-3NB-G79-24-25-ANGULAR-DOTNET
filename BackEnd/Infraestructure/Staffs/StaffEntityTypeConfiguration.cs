using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using BackEnd.Domain.Staffs;

namespace BackEnd.Infrastructure.Staffs
{
    internal class StaffEntityTypeConfiguration : IEntityTypeConfiguration<Staff>
    {
        public void Configure(EntityTypeBuilder<Staff> builder)
        {
            builder.HasKey(b => b.AutoId);
            builder.Property(b => b.AutoId)
                .HasColumnType("int")
                .ValueGeneratedOnAdd();

            builder.HasIndex(b => b.Id).IsUnique();
            builder.HasIndex(b => b.LicenseNumber).IsUnique();
            builder.HasIndex(b => b.Email).IsUnique();
            builder.HasIndex(b => b.Phone).IsUnique();
            builder.HasMany(b => b.AvailabilitySlots).WithOne(b => b.Staff);
            builder.OwnsOne(b => b.Role);
            builder.Navigation(e => e.AvailabilitySlots).AutoInclude();
            builder.Navigation(e => e.Role).AutoInclude();
            builder.Navigation(e => e.Specialization).AutoInclude();
        }
    }
}