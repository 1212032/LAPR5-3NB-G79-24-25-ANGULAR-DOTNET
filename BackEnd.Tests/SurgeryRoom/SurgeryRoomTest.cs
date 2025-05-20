using BackEnd.Domain.Shared;
using BackEnd.Domain.SurgeryRooms;

namespace BackEnd.Tests;

public class SurgeryRoomTests
{
    [Fact]
    public void EnsureCodeHasCorrectLength()
    {
        Assert.Throws<BusinessRuleValidationException>(() => new SurgeryRoom("1", "name", "description", true));

        SurgeryRoom surgeryRoom = new SurgeryRoom("12345678", "name", "description", true);
        Assert.Equal("12345678", surgeryRoom.Code);
    }

    [Fact]
    public void EnsureCodeHasCorrectFormat()
    {
        Assert.Throws<BusinessRuleValidationException>(() => new SurgeryRoom("1234 BCD", "name", "description", true));

        SurgeryRoom surgeryRoom = new SurgeryRoom("1234-BCD", "name", "description", true);
        Assert.Equal("1234-BCD", surgeryRoom.Code);
    }

    [Fact]
    public void EnsureNameIsFilled()
    {
        Assert.Throws<BusinessRuleValidationException>(() => new SurgeryRoom("1234-BCD", "", "description", true));
    }

    [Fact]
    public void EnsureFieldsEqual()
    {
        SurgeryRoom surgeryRoom = new SurgeryRoom("1234-BCD", "name", "description", true);
        Assert.Equal("1234-BCD", surgeryRoom.Code);
        Assert.Equal("name", surgeryRoom.Name);
        Assert.Equal("description", surgeryRoom.Description);
        Assert.True(surgeryRoom.ForSurgery);
    }
}