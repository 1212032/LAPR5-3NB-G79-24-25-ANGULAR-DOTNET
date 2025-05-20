using Microsoft.EntityFrameworkCore;
using BackEnd.Domain.Appointments;
using BackEnd.Domain.OperationRequests;
using BackEnd.Domain.OperationTypes;
using BackEnd.Domain.Patients;
using BackEnd.Domain.Specializations;
using BackEnd.Domain.Staffs;
using BackEnd.Domain.SurgeryRooms;
using BackEnd.Infrastructure.Appointments;
using BackEnd.Infrastructure.OperationRequests;
using BackEnd.Infrastructure.OperationTypes;
using BackEnd.Infrastructure.Patients;
using BackEnd.Infrastructure.Specializations;
using BackEnd.Infrastructure.Staffs;
using BackEnd.Infrastructure.SurgeryRooms;
using BackEnd.Domain.Shared;
using BackEnd.Infrastructure.Shared;
using BackEnd.Domain.PatientRequests;
using BackEnd.Infrastructure.PatientRequests;

namespace BackEnd.Infrastructure
{
    public class BackEnd_DbContext : DbContext
    {
        public DbSet<Appointment> Appointments { get; set; }
        public DbSet<OperationRequest> OperationRequests { get; set; }
        public DbSet<OperationType> OperationTypes { get; set; }
        public DbSet<Patient> Patients { get; set; }
        public DbSet<Specialization> Specializations { get; set; }
        public DbSet<Staff> Staffs { get; set; }
        public DbSet<SurgeryRoom> SurgeryRooms { get; set; }
        public DbSet<SystemChangeLog> SystemChangeLogs { get; set; }
        public DbSet<PatientRequest> PatientRequests { get; set; }

        public BackEnd_DbContext(DbContextOptions options) : base(options)
        {
            //this.Database.EnsureCreated();
            this.Database.Migrate();
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfiguration(new AppointmentEntityTypeConfiguration());
            modelBuilder.ApplyConfiguration(new AppointmentPhaseEntityTypeConfiguration());
            modelBuilder.ApplyConfiguration(new AppointmentPhaseStaffEntityTypeConfiguration());

            modelBuilder.ApplyConfiguration(new OperationTypeEntityTypeConfiguration());
            modelBuilder.ApplyConfiguration(new OperationTypePhaseEntityTypeConfiguration());
            modelBuilder.ApplyConfiguration(new OperationTypePhaseSpecializationEntityTypeConfiguration());

            modelBuilder.ApplyConfiguration(new OperationRequestEntityTypeConfiguration());
            modelBuilder.ApplyConfiguration(new PatientEntityTypeConfiguration());
            modelBuilder.ApplyConfiguration(new SpecializationEntityTypeConfiguration());
            modelBuilder.ApplyConfiguration(new StaffEntityTypeConfiguration());
            modelBuilder.ApplyConfiguration(new SurgeryRoomEntityTypeConfiguration());
            modelBuilder.ApplyConfiguration(new SystemChangeLogConfiguration());
            modelBuilder.ApplyConfiguration(new PatientRequestEntityTypeConfiguration());
        }
    }
}