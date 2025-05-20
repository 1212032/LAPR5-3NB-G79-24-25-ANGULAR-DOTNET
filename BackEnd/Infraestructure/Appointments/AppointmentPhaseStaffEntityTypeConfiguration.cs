using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using BackEnd.Domain.Appointments;

namespace BackEnd.Infrastructure.Appointments
{
    internal class AppointmentPhaseStaffEntityTypeConfiguration : IEntityTypeConfiguration<AppointmentPhaseStaff>
    {
        public void Configure(EntityTypeBuilder<AppointmentPhaseStaff> builder)
        {
            builder.HasKey(b => b.Id);
            builder.Navigation(e => e.Staff).AutoInclude();
        }
    }
}