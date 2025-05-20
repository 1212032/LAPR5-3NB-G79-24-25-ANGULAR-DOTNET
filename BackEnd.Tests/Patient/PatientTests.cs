namespace BackEnd.Tests;
using BackEnd.Domain.Patients;

using BackEnd.Domain.Shared;
using System;

public class PatientTests
{
    [Fact]
    public void EnsurePatientCreation()
    {
        // Assert
        var patient = new Patient(
            firstName: "ze",
            lastName: "bicha",
            fullName: "ze bicha",
            emergencyContact: "123456789",
            gender: "Man",
            dateOfBirth: new DateTime(1985, 10, 10),
            email: "11@ze.com",
            phone: "1234567890",
            address: "rua torta"
        );

        // Act
        string firstName = patient.FirstName;
        string lastName = patient.LastName;
        string email = patient.Email;
        string phone = patient.Phone;
        string address = patient.Address;

        // Assert
        Assert.Equal("ze", firstName);
        Assert.Equal("bicha", lastName);
        Assert.Equal("11@ze.com", email);
        Assert.Equal("1234567890", phone);
        Assert.Equal("rua torta", address);
    }


    [Theory]
    [InlineData("Ze", "Broas", "Ze Broas", "123456789", "Man", "1985-10-10", null, "1234567890", "rua torta")]
    public void EnsureEmailNotNull(string firstName, string lastName, string fullName, string emergencyContact, string gender, string dateOfBirth, string email, string phone, string address)
    {
        Assert.Throws<BusinessRuleValidationException>(() => new Patient(firstName, lastName, fullName, emergencyContact, gender, DateTime.Parse(dateOfBirth), email, phone, address));
    }


    [Theory]
    [InlineData("Ze", "Broas", "Ze Broas", "123456789", "Man", "1985-10-10", "1@gmail.com", null, "rua torta")]
    public void EnsurePhoneNotNull(string firstName, string lastName, string fullName, string emergencyContact, string gender, string dateOfBirth, string email, string phone, string address)
    {
        Assert.Throws<BusinessRuleValidationException>(() => new Patient(firstName, lastName, fullName, emergencyContact, gender, DateTime.Parse(dateOfBirth), email, phone, address));
    }

    [Theory]
    [InlineData(null, "Broas", "Ze Broas", "123456789", "Man", "1985-10-10", "1@gmail.com", "1234567890", "rua torta")]
    public void EnsureFirstNameNotNull(string firstName, string lastName, string fullName, string emergencyContact, string gender, string dateOfBirth, string email, string phone, string address)
    {
        Assert.Throws<BusinessRuleValidationException>(() => new Patient(firstName, lastName, fullName, emergencyContact, gender, DateTime.Parse(dateOfBirth), email, phone, address));
    }
    [Theory]
    [InlineData("Ze", null, "Ze Broas", "123456789", "Man", "1985-10-10", "1@gmail.com", "1234567890", "rua torta")]
    public void EnsureLastNameNotNull(string firstName, string lastName, string fullName, string emergencyContact, string gender, string dateOfBirth, string email, string phone, string address)
    {
        Assert.Throws<BusinessRuleValidationException>(() => new Patient(firstName, lastName, fullName, emergencyContact, gender, DateTime.Parse(dateOfBirth), email, phone, address));
    }

    [Theory]
    [InlineData("Ze", "Broas", "Ze Broas", "123456789", null, "1985-10-10", "1@gmail.com", "1234567890", "rua torta")]
    public void EnsureGenderNotNull(string firstName, string lastName, string fullName, string emergencyContact, string gender, string dateOfBirth, string email, string phone, string address)
    {
        Assert.Throws<BusinessRuleValidationException>(() => new Patient(firstName, lastName, fullName, emergencyContact, gender, DateTime.Parse(dateOfBirth), email, phone, address));
    }
}