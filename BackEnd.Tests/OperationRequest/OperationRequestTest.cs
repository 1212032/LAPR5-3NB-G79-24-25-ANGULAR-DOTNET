namespace OperationRequestTest;
using BackEnd.Domain.Staffs;
using BackEnd.Domain.Shared;
using BackEnd.Domain.Specializations;
using BackEnd.Domain.Patients;
using BackEnd.Domain.OperationTypes;
using BackEnd.Domain.OperationRequests;

public class OperationRequestTest
{
    [Fact]
    public void OperationRequestValidArguments()
    {
        // Given
        DateTime deadlineDate = DateTime.Parse("2024-10-26");
        var priority = "Urgent";
        var doctor = DummyStaff();
        var operationType = DummyOperationType();
        var patient = DummyPatient();

        // When
        var operationRequest = new OperationRequest(deadlineDate, priority, doctor, operationType, patient);

        // Then
        Assert.NotNull(operationRequest);
        Assert.Equal(deadlineDate, operationRequest.DeadlineDate);
        Assert.Equal(priority, operationRequest.Priority.ToString());
        Assert.Equal(doctor, operationRequest.RequestedByDoctor);
        Assert.Equal(operationType, operationRequest.OperationType);
        Assert.Equal(patient, operationRequest.Patient);
    }

    [Fact]
    public void OperationRequestInvalidPriorityThrowsException()
    {
        // Given
        var deadlineDate = DateTime.Now.AddDays(10);
        var invalidPriority = "";
        var doctor = DummyStaff();
        var operationType = DummyOperationType();
        var patient = DummyPatient();

        // When & Then
        Assert.Throws<ArgumentException>(() => new OperationRequest(deadlineDate, invalidPriority, doctor, operationType, patient));
    }

    [Fact]
    public void UpdateOperationRequest()
    {
        // Given
        var deadlineDate = DateTime.Now.AddDays(10);
        var priority = "Emergency";
        var doctor = DummyStaff();
        var operationType = DummyOperationType();
        var patient = DummyPatient();
        var operationRequest = new OperationRequest(deadlineDate, priority, doctor, operationType, patient);

        var newDeadlineDate = DateTime.Now.AddDays(20);
        var newPriority = "Urgent";
        var newDoctor = DummyStaff();
        var newOperationType = DummyOperationType();
        var newPatient = DummyPatient();
        // When
        operationRequest.Update(newDeadlineDate, newPriority, newDoctor, newOperationType, newPatient);

        // Then
        Assert.Equal(newDeadlineDate, operationRequest.DeadlineDate);
        Assert.Equal(newPriority, operationRequest.Priority.ToString());
        Assert.Equal(newDoctor, operationRequest.RequestedByDoctor);
        Assert.Equal(newOperationType, operationRequest.OperationType);
        Assert.Equal(newPatient, operationRequest.Patient);
    }

    [Fact]
    public void IsScheduledReturnsTrueWhenStatusIsScheduled()
    {
        // Given
        var deadlineDate = DateTime.Now.AddDays(10);
        var priority = "High";
        var doctor = DummyStaff();
        var operationType = DummyOperationType();
        var patient = DummyPatient();
        var operationRequest = new OperationRequest(deadlineDate, priority, doctor, operationType, patient);

        // Simulate setting the status to Scheduled
#pragma warning disable CS8602 // Dereference of a possibly null reference.
        typeof(OperationRequest).GetProperty("Status").SetValue(operationRequest, OperationRequestStatus.Scheduled);
#pragma warning restore CS8602 // Dereference of a possibly null reference.

        // When
        var isScheduled = operationRequest.IsScheduled();

        // Then
        Assert.True(isScheduled);
    }

    private Staff DummyStaff()
    {

        Specialization specialization = new Specialization("12345", "Genecologist", "Specialization in gynecology and obstetrics.");
        var availabilitySlots = new List<DateTimeTuple>
        {
            new DateTimeTuple(DateTime.Now, DateTime.Now.AddHours(1))
        };
        //string licenseNumber, string email, string phone, string firstName, string lastName,
        // string role, List<DateTimeTuple> availabilitySlots, Specialization specialization
        return new Staff("D202400001", "email@email.com", "123456789", "Carlos", "Sainz", "Doctor", availabilitySlots, specialization);
    }
    private Patient DummyPatient()
    {
        //PatientMedicalRecordNumber= P202400002
        return new Patient("Ze", "Broas", "Ze Broas", "123456789", "Man", DateTime.Parse("1985-10-10"), "1@gmail.com", "1234567890", "rua torta");
    }
    private OperationType DummyOperationType()
    {
        List<OperationTypePhaseSpecialization> listOperationTypePhaseSpecialization = new List<OperationTypePhaseSpecialization>{
                new OperationTypePhaseSpecialization(new Specialization("12345", "Genecologist", "Specialization in gynecology and obstetrics."), 1),
                new OperationTypePhaseSpecialization(new Specialization("12345", "Genecologist", "Specialization in gynecology and obstetrics."), 2)};

        OperationTypePhase phase = new OperationTypePhase("Anesthesia/patient preparation", 10, listOperationTypePhaseSpecialization);
        //OperationTypePhase(string name, int duration, List<OperationTypePhaseSpecialization> neededSpecializations);


        // OperationType(string name, List<OperationTypePhase> phases, int version)


        return new OperationType("Operation Type1", new List<OperationTypePhase> { phase }, 1);
    }
}