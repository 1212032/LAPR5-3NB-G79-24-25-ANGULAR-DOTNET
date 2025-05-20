using System;
using Microsoft.EntityFrameworkCore;
using BackEnd.Domain.Staffs;
using BackEnd.Domain.SurgeryRooms;

namespace BackEnd.Domain.Shared
{
    public class DateTimeTuple
    {
        public int Id { get; private set; }
        public Staff Staff { get; private set; }
        public SurgeryRoom SurgeryRoom { get; private set; }
        public DateTime FromDateTime { get; private set; }
        public DateTime ToDateTime { get; private set; }

        private DateTimeTuple() { }

        public DateTimeTuple(DateTime fromDateTime, DateTime toDateTime)
        {
            this.FromDateTime = fromDateTime;
            this.ToDateTime = toDateTime;
        }
    }
}