using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using BackEnd.Domain.Shared;
using BackEnd.Domain.Staffs;

namespace BackEnd.Domain.Appointments
{
    public class AppointmentPhaseStaff
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; private set; }
        public Staff Staff { get; private set; }

        private AppointmentPhaseStaff() { }

        public AppointmentPhaseStaff(Staff staff)
        {
            //TODO falta validacoes
            this.Staff = staff;
        }
    }
}