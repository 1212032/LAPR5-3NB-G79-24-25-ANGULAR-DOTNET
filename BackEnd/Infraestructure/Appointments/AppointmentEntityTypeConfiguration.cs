using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using BackEnd.Domain.Appointments;

namespace BackEnd.Infrastructure.Appointments
{
    internal class AppointmentEntityTypeConfiguration : IEntityTypeConfiguration<Appointment>
    {
        public void Configure(EntityTypeBuilder<Appointment> builder)
        {
            builder.HasKey(b => b.Id);
            builder.Property(b => b.Id)
                .HasColumnType("int")
                .HasConversion<int>(a => Convert.ToInt32(a), b => new AppointmentId(b))
                .ValueGeneratedOnAdd();
            builder.OwnsOne(b => b.Status);

            builder.HasMany(b => b.Phases).WithOne(b => b.Appointment).IsRequired();
            builder.Navigation(e => e.Phases).AutoInclude();
            
            builder.Navigation(e => e.Room).AutoInclude();
            builder.Navigation(e => e.OriginatingOn).AutoInclude();
        }
    }
}