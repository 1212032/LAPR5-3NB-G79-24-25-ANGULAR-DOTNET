using BackEnd.Domain.OperationTypes;
using BackEnd.Domain.Shared;
using BackEnd.Domain.Specializations;

namespace OperationTypeTest;

public class OperationTypePhaseTest
{
    [Fact]
    public void OperationTypePhaseValidArguments()
    {
        // Given
        string name = "Cleaning";
        int duration = 10;
        List<OperationTypePhaseSpecialization> operationTypePhaseSpecializations = DummyOperationTypePhaseSpecializations();

        // When
        OperationTypePhase operationTypePhase = new OperationTypePhase(name, duration, operationTypePhaseSpecializations);

        // Then
        Assert.NotNull(operationTypePhase);
        Assert.Equal(name, operationTypePhase.Name.Name);
        Assert.Equal(duration, operationTypePhase.Duration);
        Assert.Equal(operationTypePhaseSpecializations, operationTypePhase.NeededSpecializations);
    }

    [Fact]
    public void OperationTypePhaseInvalidNameThrowsException()
    {
        // Given
        string name = "AAAAAAAAAA";
        int duration = 10;
        List<OperationTypePhaseSpecialization> operationTypePhaseSpecializations = DummyOperationTypePhaseSpecializations();

        // When & Then
        Assert.Throws<BusinessRuleValidationException>(() => new OperationTypePhase(name, duration, operationTypePhaseSpecializations));
    }

    [Fact]
    public void OperationTypePhaseInvalidDurationThrowsException()
    {
        // Given
        string name = "Cleaning";
        int duration = 0;
        List<OperationTypePhaseSpecialization> operationTypePhaseSpecializations = DummyOperationTypePhaseSpecializations();

        // When & Then
        Assert.Throws<BusinessRuleValidationException>(() => new OperationTypePhase(name, duration, operationTypePhaseSpecializations));
    }

    [Fact]
    public void OperationTypePhaseInvalidSpecializationsThrowsException()
    {
        // Given
        string name = "Cleaning";
        int duration = 10;

        // When & Then
        Assert.Throws<BusinessRuleValidationException>(() => new OperationTypePhase(name, duration, null));
    }

    private List<OperationTypePhaseSpecialization> DummyOperationTypePhaseSpecializations()
    {
        Specialization specialization;
        OperationTypePhaseSpecialization phaseSpecialization;

        List<OperationTypePhaseSpecialization> neededSpecializations = new();
        specialization = new("12345", "Genecologist", "Specialization in gynecology and obstetrics.");
        phaseSpecialization = new OperationTypePhaseSpecialization(specialization, 1);
        neededSpecializations.Add(phaseSpecialization);
        specialization = new("12345", "Nurse", "Specialization in gynecology and obstetrics.");
        phaseSpecialization = new OperationTypePhaseSpecialization(specialization, 2);
        neededSpecializations.Add(phaseSpecialization);

        return neededSpecializations;
    }
}