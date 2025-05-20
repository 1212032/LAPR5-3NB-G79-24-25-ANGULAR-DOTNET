using BackEnd.Domain.Appointments;
using BackEnd.Domain.OperationRequests;
using BackEnd.Domain.OperationTypes;
using BackEnd.Domain.Patients;
using BackEnd.Domain.Shared;
using BackEnd.Domain.Specializations;
using BackEnd.Domain.Staffs;
using BackEnd.Domain.SurgeryRooms;

namespace BackEnd.Tests;

public class AppointmentTests
{
    private readonly string RoomCode1 = "12345678";
    private readonly string RoomCode2 = "87654321";
    private readonly DateTime AppointmentDateTime = DateTime.Now.AddDays(1);
    private string staffId = "";

    [Fact]
    public void ShouldCreateAppointment()
    {
        Appointment appointment = DummyAppointment(false, false, false);
        Assert.Equal(RoomCode1, appointment.Room.Code);
        Assert.Equal(AppointmentDateTime, appointment.DateTime);
        Assert.Equal(1, appointment.OriginatingOn.Id.ToInt);
        Assert.Equal(AppointmentStatus.Scheduled, appointment.Status);
    }

    [Fact]
    public void ShouldUpdateAppointment()
    {
        Appointment appointment = DummyAppointment(false, false, false);
        SurgeryRoom room = DummySurgeryRoom(RoomCode2);
        appointment.Update(new DateTime(2026, 1, 1), room, appointment.Phases);
        Assert.Equal(RoomCode2, appointment.Room.Code);
        Assert.Equal(new DateTime(2026, 1, 1), appointment.DateTime);
        Assert.Equal(staffId, appointment.Phases[0].PhaseStaff[0].Staff.Id.AsString());
    }

    [Fact]
    public void ShouldThrowErrorOnInvalid()
    {
        Assert.Throws<BusinessRuleValidationException>(() => DummyAppointment(true, false, false));
        Assert.Throws<BusinessRuleValidationException>(() => DummyAppointment(false, true, false));
        Assert.Throws<BusinessRuleValidationException>(() => DummyAppointment(false, false, true));
    }

    [Fact]
    public void ShouldCreateDto()
    {
        AppointmentDto appointmentDto = DummyAppointment(false, false, false).ToDto();
        Assert.Equal(RoomCode1, appointmentDto.Room);
        Assert.Equal(AppointmentDateTime, appointmentDto.DateTime);
        Assert.Equal(1, appointmentDto.OriginatingOperationRequest);
        Assert.Equal(AppointmentStatus.Scheduled.Name, appointmentDto.Status);
        Assert.Equal(staffId, appointmentDto.Phases[0].Staff[0]);
    }

    private SurgeryRoom DummySurgeryRoom(string roomCode)
    {
        return new SurgeryRoom(roomCode, "name", "description", true);
    }

    private Specialization DummySpecialization()
    {
        Specialization specialization = new Specialization("1", "1", "1");
#pragma warning disable CS8602 // Dereference of a possibly null reference.
        typeof(Specialization).GetProperty("Id").SetValue(specialization, new SpecializationId(1));
#pragma warning restore CS8602 // Dereference of a possibly null reference.
        return specialization;
    }

    private Staff DummyStaff()
    {
        List<DateTimeTuple> slots = [];
        slots.Add(new DateTimeTuple(DateTime.Now, DateTime.Now.AddDays(2)));
        Staff staff = new Staff("1", "1@mail.com", "1", "A", "B", "Doctor", slots, DummySpecialization());
#pragma warning disable CS8602 // Dereference of a possibly null reference.
        typeof(Staff).GetProperty("AutoId").SetValue(staff, 1);
#pragma warning restore CS8602 // Dereference of a possibly null reference.
        staff.AddPrefix();
        staffId = staff.Id.AsString();
        return staff;
    }

    private Patient DummyPatient()
    {
        Patient patient = new Patient("First", "Last", "First Last", "987654321", "Man", new DateTime(2000, 1, 1), "1@mail.com", "987321654", "Address");

        // Simulate setting the status to Scheduled
#pragma warning disable CS8602 // Dereference of a possibly null reference.
        typeof(Patient).GetProperty("Id").SetValue(patient, new PatientMedicalRecordNumber("1"));
#pragma warning restore CS8602 // Dereference of a possibly null reference.

        return patient;
    }

    private OperationRequest DummyOperationRequest()
    {
        List<OperationTypePhase> phases = [];
        Specialization specialization = DummySpecialization();
        List<OperationTypePhaseSpecialization> specializations = [];
        OperationTypePhaseSpecialization operationTypePhaseSpecialization = new OperationTypePhaseSpecialization(specialization, 1);
        specializations.Add(operationTypePhaseSpecialization);
        OperationTypePhase phase1 = new OperationTypePhase("Anesthesia/patient preparation", 1, specializations);
        phases.Add(phase1);
        OperationTypePhase phase2 = new OperationTypePhase("Surgery", 1, specializations);
        phases.Add(phase2);
        OperationTypePhase phase3 = new OperationTypePhase("Cleaning", 1, specializations);
        phases.Add(phase3);
        OperationType operationType = new OperationType("Operation type 1", phases, 1);

        OperationRequest operationRequest = new OperationRequest(DateTime.Now.AddDays(1),
        OperationRequestStatus.Pending.Name, DummyStaff(), operationType, DummyPatient());

#pragma warning disable CS8602 // Dereference of a possibly null reference.
        typeof(OperationRequest).GetProperty("Id").SetValue(operationRequest, new OperationRequestId(1));
#pragma warning restore CS8602 // Dereference of a possibly null reference.
        return operationRequest;
    }

    private Appointment DummyAppointment(bool withNullOpReq, bool withNullRoom, bool withNullPhases)
    {
        OperationRequest? operationRequest = null;
        if (withNullOpReq == false)
            operationRequest = DummyOperationRequest();

        SurgeryRoom? room = null;
        if (withNullRoom == false)
            room = DummySurgeryRoom(RoomCode1);

        List<AppointmentPhase> phases = [];
        if (withNullPhases == false)
        {
            Staff staff = DummyStaff();
            List<AppointmentPhaseStaff> phaseStaff = [];
            phaseStaff.Add(new AppointmentPhaseStaff(staff));
            AppointmentPhase phase = new AppointmentPhase(phaseStaff);
            phases.Add(phase); phases.Add(phase); phases.Add(phase);
        }

        Appointment appointment = new Appointment(AppointmentDateTime, operationRequest, room, phases);
#pragma warning disable CS8602 // Dereference of a possibly null reference.
        typeof(Appointment).GetProperty("Id").SetValue(appointment, new AppointmentId(1));
#pragma warning restore CS8602 // Dereference of a possibly null reference.

        return appointment;
    }
}