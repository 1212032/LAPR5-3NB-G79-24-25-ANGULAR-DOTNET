using BackEnd.Domain.Shared;
using BackEnd.Domain.Specializations;
using BackEnd.Domain.Staffs;

namespace BackEnd.Tests;

public class StaffTests
{
    [Theory]
    [InlineData("D202400001", "email", "918596542", "Carlos", "Sainz", "Doctor")]
    [InlineData("N202400009", "email", "912023415", "Max", "Verstappen", "Nurse")]
    public void EnsureIsAnEmail(string licenseNumber, string email, string phone, string firstName, string lastName,
        string role)
    {
        Specialization specialization = new Specialization("12345", "Genecologist", "Specialization in gynecology and obstetrics.");
        var availabilitySlots = new List<DateTimeTuple>
        {
            new DateTimeTuple(DateTime.Now, DateTime.Now.AddHours(1))
        };

        Assert.Throws<BusinessRuleValidationException>(() => new Staff(licenseNumber, email, phone, firstName, lastName, role, availabilitySlots, specialization));
    }

    [Theory]
    [InlineData("D202400001", null, "918596542", "Carlos", "Sainz", "Doctor")]
    [InlineData("N202400009", null, "912023415", "Max", "Verstappen", "Nurse")]
    public void EnsureEmailNotNull(string licenseNumber, string email, string phone, string firstName, string lastName,
        string role)
    {
        Specialization specialization = new Specialization("12345", "Genecologist", "Specialization in gynecology and obstetrics.");
        var availabilitySlots = new List<DateTimeTuple>
        {
            new DateTimeTuple(DateTime.Now, DateTime.Now.AddHours(1))
        };

        Assert.Throws<BusinessRuleValidationException>(() => new Staff(licenseNumber, email, phone, firstName, lastName, role, availabilitySlots, specialization));
    }

    [Theory]
    [InlineData("D202400001", "email@email.com", null, "Carlos", "Sainz", "Doctor")]
    [InlineData("N202400009", "email@email.com", null, "Max", "Verstappen", "Nurse")]
    public void EnsurePhoneNotNull(string licenseNumber, string email, string phone, string firstName, string lastName,
        string role)
    {
        Specialization specialization = new Specialization("12345", "Genecologist", "Specialization in gynecology and obstetrics.");
        var availabilitySlots = new List<DateTimeTuple>
        {
            new DateTimeTuple(DateTime.Now, DateTime.Now.AddHours(1))
        };
        Assert.Throws<BusinessRuleValidationException>(() => new Staff(licenseNumber, email, phone, firstName, lastName, role, availabilitySlots, specialization));
    }

    [Theory]
    [InlineData("D202400001", "email@email.com", "918596542", null, "Sainz", "Doctor")]
    [InlineData("N202400009", "email@email.com", "912023415", null, "Verstappen", "Nurse")]
    public void EnsureFirstNameNotNull(string licenseNumber, string email, string phone, string firstName, string lastName,
        string role)
    {
        Specialization specialization = new Specialization("12345", "Genecologist", "Specialization in gynecology and obstetrics.");
        var availabilitySlots = new List<DateTimeTuple>
        {
            new DateTimeTuple(DateTime.Now, DateTime.Now.AddHours(1))
        };
        Assert.Throws<BusinessRuleValidationException>(() => new Staff(licenseNumber, email, phone, firstName, lastName, role, availabilitySlots, specialization));
    }

    [Theory]
    [InlineData("D202400001", "email@email.com", "918596542", "Carlos", null, "Doctor")]
    [InlineData("N202400009", "email@email.com", "912023415", "Max", null, "Nurse")]
    public void EnsureLastNameNotNull(string licenseNumber, string email, string phone, string firstName, string lastName,
        string role)
    {
        Specialization specialization = new Specialization("12345", "Genecologist", "Specialization in gynecology and obstetrics.");
        var availabilitySlots = new List<DateTimeTuple>
        {
            new DateTimeTuple(DateTime.Now, DateTime.Now.AddHours(1))
        };
        Assert.Throws<BusinessRuleValidationException>(() => new Staff(licenseNumber, email, phone, firstName, lastName, role, availabilitySlots, specialization));
    }

    [Theory]
    [InlineData("D202400001", "email@email.com", "918596542", "Carlos", "Sainz", null)]
    [InlineData("N202400009", "email@email.com", "912023415", "Max", "Verstappen", null)]
    public void EnsureRoleNotNull(string licenseNumber, string email, string phone, string firstName, string lastName,
        string role)
    {
        Specialization specialization = new Specialization("12345", "Genecologist", "Specialization in gynecology and obstetrics.");
        var availabilitySlots = new List<DateTimeTuple>
        {
            new DateTimeTuple(DateTime.Now, DateTime.Now.AddHours(1))
        };
        Assert.Throws<BusinessRuleValidationException>(() => new Staff(licenseNumber, email, phone, firstName, lastName, role, availabilitySlots, specialization));
    }

    [Theory]
    [InlineData("D202400001", "email@email.com", "918596542", "Carlos", "Sainz", "Doctor")]
    public void EnsureUpdateWorks(string licenseNumber, string email, string phone, string firstName, string lastName,
        string role)
    {
        Specialization specialization = new Specialization("12345", "Genecologist", "Specialization in gynecology and obstetrics.");
        var availabilitySlots = new List<DateTimeTuple>
        {
            new DateTimeTuple(DateTime.Now, DateTime.Now.AddHours(1))
        };

        var staff = new Staff(licenseNumber, email, phone, firstName, lastName, role, availabilitySlots, specialization);

        var newEmail = "email2@email.com";
        var newPhone = "918596543";
        var newFirstName = "Max";
        var newLastName = "Verstappen";
        var newavailabilitySlots = new List<DateTimeTuple>
        {
            new DateTimeTuple(DateTime.Now, DateTime.Now.AddHours(1))
        };

        staff.Update(newEmail, newPhone, newFirstName, newLastName, newavailabilitySlots);

        Assert.Equal(newEmail, staff.Email);
        Assert.Equal(newPhone, staff.Phone);
        Assert.Equal(newFirstName, staff.FirstName);
        Assert.Equal(newLastName, staff.LastName);
        Assert.Equal(newavailabilitySlots, staff.AvailabilitySlots);
    }

    [Theory]
    [InlineData("D202400001", "email@email.com", "918596542", "Carlos", "Sainz", "Doctor")]
    public void EnsureInactivateWorks(string licenseNumber, string email, string phone, string firstName, string lastName,
        string role)
    {
        Specialization specialization = new Specialization("12345", "Genecologist", "Specialization in gynecology and obstetrics.");
        var availabilitySlots = new List<DateTimeTuple>
        {
            new DateTimeTuple(DateTime.Now, DateTime.Now.AddHours(1))
        };

        var staff = new Staff(licenseNumber, email, phone, firstName, lastName, role, availabilitySlots, specialization);

        staff.Inactivate();

        Assert.False(staff.Active);
    }
}