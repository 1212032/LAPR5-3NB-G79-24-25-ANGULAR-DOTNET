using BackEnd.Domain.OperationTypes;
using BackEnd.Domain.Shared;
using BackEnd.Domain.Specializations;

namespace OperationTypeTest;

public class OperationTypeTest
{
    [Fact]
    public void OperationTypeValidArguments()
    {
        // Given
        string name = "Operation type test";
        List<OperationTypePhase> operationTypePhases = DummyOperationTypePhases();
        int version = 1;

        // When
        OperationType operationType = new OperationType(name, operationTypePhases, version);

        // Then
        Assert.NotNull(operationType);
        Assert.Equal(name, operationType.Name);
        Assert.Equal(operationTypePhases, operationType.Phases);
        Assert.Equal(version, operationType.Version);
    }

    [Fact]
    public void OperationTypeInvalidNameThrowsException()
    {
        // Given
        List<OperationTypePhase> operationTypePhases = DummyOperationTypePhases();
        int version = 1;

        // When & Then
        Assert.Throws<BusinessRuleValidationException>(() => new OperationType(null, operationTypePhases, version));
    }

    [Fact]
    public void OperationTypeInvalidVersionThrowsException()
    {
        // Given
        string name = "Operation type test";
        List<OperationTypePhase> operationTypePhases = DummyOperationTypePhases();
        int version = -1;

        // When & Then
        Assert.Throws<BusinessRuleValidationException>(() => new OperationType(name, operationTypePhases, version));
    }

    [Fact]
    public void OperationTypeInvalidPhasesThrowsException()
    {
        // Given
        string name = "Operation type test";
        int version = 1;

        // When & Then
        Assert.Throws<BusinessRuleValidationException>(() => new OperationType(name, null, version));
    }

    [Fact]
    public void InactivateOperationType()
    {
        // Given
        string name = "Operation type test";
        List<OperationTypePhase> operationTypePhases = DummyOperationTypePhases();
        int version = 1;
        OperationType operationType = new OperationType(name, operationTypePhases, version);

        // When
        operationType.Inactivate();

        // Then
        Assert.False(operationType.Active);
    }

    private List<OperationTypePhase> DummyOperationTypePhases()
    {
        Specialization specialization;
        OperationTypePhaseSpecialization phaseSpecialization;

        List<OperationTypePhaseSpecialization> neededSpecializations1 = new();
        specialization = new("12345", "Genecologist", "Specialization in gynecology and obstetrics.");
        phaseSpecialization = new OperationTypePhaseSpecialization(specialization, 1);
        neededSpecializations1.Add(phaseSpecialization);
        specialization = new("12345", "Genecologist", "Specialization in gynecology and obstetrics.");
        phaseSpecialization = new OperationTypePhaseSpecialization(specialization, 2);
        neededSpecializations1.Add(phaseSpecialization);
        OperationTypePhase phase1 = new OperationTypePhase("Anesthesia/patient preparation", 10, neededSpecializations1);

        List<OperationTypePhaseSpecialization> neededSpecializations2 = new();
        specialization = new("12345", "Genecologist", "Specialization in gynecology and obstetrics.");
        phaseSpecialization = new OperationTypePhaseSpecialization(specialization, 2);
        neededSpecializations2.Add(phaseSpecialization);
        specialization = new("12345", "Genecologist", "Specialization in gynecology and obstetrics.");
        phaseSpecialization = new OperationTypePhaseSpecialization(specialization, 1);
        neededSpecializations2.Add(phaseSpecialization);
        OperationTypePhase phase2 = new OperationTypePhase("Surgery", 30, neededSpecializations2);

        List<OperationTypePhaseSpecialization> neededSpecializations3 = new();
        specialization = new("12345", "Genecologist", "Specialization in gynecology and obstetrics.");
        phaseSpecialization = new OperationTypePhaseSpecialization(specialization, 2);
        neededSpecializations3.Add(phaseSpecialization);
        OperationTypePhase phase3 = new OperationTypePhase("Cleaning", 15, neededSpecializations3);

        return [phase1, phase2, phase3];
    }
}