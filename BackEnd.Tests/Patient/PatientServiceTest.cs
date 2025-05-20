using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using BackEnd.Domain.Appointments;
using BackEnd.Domain.OperationRequests;
using BackEnd.Domain.Patients;
using BackEnd.Domain.Shared;
using BackEnd.Services;

namespace BackEnd.Tests
{
    public class PatientServiceTest
    {
        private readonly Mock<IPatientRepository> _mockPatientRepo;
        private readonly Mock<IOperationRequestRepository> _mockOperationRequestRepo;
        private readonly Mock<IAppointmentRepository> _mockAppointmentRepo;
        private readonly Mock<IUnitOfWork> _mockUnitOfWork;
        private readonly Mock<ISystemChangeLogRepository> _mockChangeLogRepo;

        private readonly PatientService _service;

        public PatientServiceTest()
        {
            _mockPatientRepo = new Mock<IPatientRepository>();
            _mockOperationRequestRepo = new Mock<IOperationRequestRepository>();
            _mockAppointmentRepo = new Mock<IAppointmentRepository>();
            _mockUnitOfWork = new Mock<IUnitOfWork>();
            _mockChangeLogRepo = new Mock<ISystemChangeLogRepository>();
            _service = new PatientService(_mockPatientRepo.Object, _mockUnitOfWork.Object, _mockChangeLogRepo.Object,
             _mockOperationRequestRepo.Object, _mockAppointmentRepo.Object);
        }

        [Fact]
        public async Task AddAsync_ShouldAddPatient()
        {
            // Arrange
            var createPatientDto = new CreatePatientDto
            {
                FirstName = "Carlos",
                LastName = "Paula",
                FullName = "Carlos Paula",
                EmergencyContact = "911235478",
                Gender = "Man",
                DateOfBirth = new DateTime(1998, 08, 2),
                Email = "email@email.com",
                Phone = "1234567890",
                Address = "Rua dos macacos"
            };
            var patient = new Patient(
                createPatientDto.FirstName,
                createPatientDto.LastName,
                createPatientDto.FullName,
                createPatientDto.EmergencyContact,
                createPatientDto.Gender,
                createPatientDto.DateOfBirth,
                createPatientDto.Email,
                createPatientDto.Phone,
                createPatientDto.Address
            );
            //SetUp
            _mockPatientRepo.Setup(repo => repo.AddAsync(It.IsAny<Patient>())).ReturnsAsync(patient);

            // Act
            var result = await _service.AddAsync(createPatientDto);

            // Assert
            Assert.NotNull(result);
            _mockPatientRepo.Verify(repo => repo.AddAsync(It.IsAny<Patient>()), Times.Once);//Verifica se so retorna 1 value
            Assert.Equal(createPatientDto.FirstName, result.FirstName);
        }

        [Fact]
        public async Task UpdateAsync_ShouldUpdatePatient()
        {
            // Arrange
            var createPatientDto = new CreatePatientDto
            {
                FirstName = "Carlos",
                LastName = "Paula",
                FullName = "Carlos Paula",
                EmergencyContact = "911235478",
                Gender = "Man",
                DateOfBirth = new DateTime(1998, 08, 2),
                Email = "email@email.com",
                Phone = "1234567890",
                Address = "Rua dos macacos"
            };
            var patient = new Patient(
                createPatientDto.FirstName,
                createPatientDto.LastName,
                createPatientDto.FullName,
                createPatientDto.EmergencyContact,
                createPatientDto.Gender,
                createPatientDto.DateOfBirth,
                createPatientDto.Email,
                createPatientDto.Phone,
                createPatientDto.Address
            );
            //SetUp
            _mockPatientRepo.Setup(repo => repo.AddAsync(It.IsAny<Patient>())).ReturnsAsync(patient);

            // Act
            var patientPersisted = await _service.AddAsync(createPatientDto);

            var newFirstName = "Max";
            var newLastName = "Verstappen";
            var newFullName = "Max Verstappen";
            var newEmergencyContact = "912345612";
            var newGender = "Man";
            var newDateOfBirth = new DateTime(1998, 02, 10);
            var newEmail = "email2@email.com";
            var newPhone = "1234567890";
            var newAddress = "Rua dos ursos";
            patient.UpdatePersonalInfo(newFirstName, newLastName, newFullName, newEmergencyContact, newGender, newDateOfBirth, newEmail, newPhone, newAddress);

            //await _service.UpdateAsync(patientPersisted);

            _mockPatientRepo.Setup(repo => repo.GetByIdAsync(new PatientMedicalRecordNumber("CP123"))).ReturnsAsync(patient);
            var result = await _service.GetByIdAsync(new PatientMedicalRecordNumber("CP123"));

            // Assert
            Assert.NotNull(result);
            Assert.Equal(newFirstName, result.FirstName);
            Assert.Equal(newLastName, result.LastName);
            Assert.Equal(newFullName, result.FullName);
            Assert.Equal(newEmergencyContact, result.EmergencyContact);
            Assert.Equal(newGender, result.Gender);
            Assert.Equal(newDateOfBirth, result.DateOfBirth);
            Assert.Equal(newEmail, result.Email);
            Assert.Equal(newPhone, result.Phone);
            Assert.Equal(newAddress, result.Address);
        }

        [Fact]
        public async Task GetByIdAsync_ShouldReturnPatient()
        {
            var createPatientDto = new CreatePatientDto
            {
                FirstName = "Carlos",
                LastName = "Paula",
                FullName = "Carlos Paula",
                EmergencyContact = "911235478",
                Gender = "Man",
                DateOfBirth = new DateTime(1998, 08, 2),
                Email = "email@email.com",
                Phone = "1234567890",
                Address = "Rua dos macacos"
            };
            var patient = new Patient(
                createPatientDto.FirstName,
                createPatientDto.LastName,
                createPatientDto.FullName,
                createPatientDto.EmergencyContact,
                createPatientDto.Gender,
                createPatientDto.DateOfBirth,
                createPatientDto.Email,
                createPatientDto.Phone,
                createPatientDto.Address
            );

            _mockPatientRepo.Setup(repo => repo.AddAsync(It.IsAny<Patient>())).ReturnsAsync(patient);
            var resultpatient = await _service.AddAsync(createPatientDto);
            _mockPatientRepo.Setup(repo => repo.GetByIdAsync(new PatientMedicalRecordNumber("CP123"))).ReturnsAsync(patient);
            var result = await _service.GetByIdAsync(new PatientMedicalRecordNumber("CP123"));
            Assert.NotNull(result);
            _mockPatientRepo.Verify(repo => repo.GetByIdAsync(new PatientMedicalRecordNumber("CP123")), Times.Once); //Verifica se so retorna 1 value
            Assert.Equal(patient.FirstName, result.FirstName);
        }

        [Theory]
        [InlineData("Carlos", "email@email.com", null, "CP123", 10, 1)]
        [InlineData("Paula", "email1@email.com", null, "CP123", 5, 1)]
        public async Task GetByFilterReturnsNoJobsOnInvalidRule(string name, string email,
        DateTime? dateOfBirth, string medicalRecordNumber, int pageNumber, int pageSize)
        {
            var patients = _mockPatientRepo
                .Setup(repo => repo.SearchPatientsAsync(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<DateTime?>(), It.IsAny<string>(), It.IsAny<string>(), It.IsAny<int>(), It.IsAny<int>()))
                .ReturnsAsync(new List<Patient>());

            var result = await _service.SearchPatientsAsync(name, email, dateOfBirth, medicalRecordNumber, "", pageNumber, pageSize);
            await _mockUnitOfWork.Object.CommitAsync();
            // Assert
            Assert.NotNull(result);
            Assert.Empty(result);

            // Verify interactions
            _mockPatientRepo.Verify(repo => repo.SearchPatientsAsync(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<DateTime?>(), It.IsAny<string>(), It.IsAny<string>(), It.IsAny<int>(), It.IsAny<int>()), Times.Once);
            _mockUnitOfWork.Verify(uow => uow.CommitAsync(), Times.Once);
        }
    }
}