using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BackEnd.Domain.Appointments
{
    public class AppointmentPhase
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; private set; }
        public Appointment Appointment { get; private set; }
        public List<AppointmentPhaseStaff> PhaseStaff { get; private set; }

        private AppointmentPhase() { }

        public AppointmentPhase(List<AppointmentPhaseStaff> phaseStaff)
        {
            //TODO falta validacoes
            this.PhaseStaff = phaseStaff;
        }
    }
}