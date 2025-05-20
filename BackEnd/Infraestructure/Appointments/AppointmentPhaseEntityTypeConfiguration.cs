using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using BackEnd.Domain.Appointments;

namespace BackEnd.Infrastructure.Appointments
{
    internal class AppointmentPhaseEntityTypeConfiguration : IEntityTypeConfiguration<AppointmentPhase>
    {
        public void Configure(EntityTypeBuilder<AppointmentPhase> builder)
        {
            builder.HasKey(b => b.Id);
            builder.Navigation(e => e.PhaseStaff).AutoInclude();
        }
    }
}