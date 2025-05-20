using BackEnd.Domain.Shared;

namespace BackEnd.Domain.Patients
{
    public class PatientGender(int id, string name) : Enumeration(id, name)
    {
        public static readonly PatientGender Available = new(1, "Man");
        public static readonly PatientGender Occupied = new(2, "Woman");
    }
}