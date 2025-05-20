using System;

using BackEnd.Domain.Shared;
using BackEnd.Domain.OperationRequests;
using BackEnd.Domain.Staffs;
using BackEnd.Domain.Patients;
using BackEnd.Domain.OperationTypes;
using BackEnd.Domain.Specializations;
using BackEnd.Services;


namespace BackEnd.Tests
{
    public class OperationRequestServiceTest
    {
        private readonly Mock<IOperationRequestRepository> _mockoperationRepo;
        private readonly Mock<IStaffRepository> _mockStaffRepo;
        private readonly Mock<IOperationTypeRepository> _mockOperationTypeRepo;
        private readonly Mock<IPatientRepository> _mockPatientRepo;
        private readonly Mock<ISpecializationRepository> _mockSpecializationRepo;
        private readonly Mock<ISystemChangeLogRepository> _mockChangeLogRepo;
        private readonly Mock<IUnitOfWork> _mockUnitOfWork;
        private readonly Mock<IAuthzService> _mockAuthz;
        private readonly OperationRequestService _service;

        public OperationRequestServiceTest()
        {
            _mockoperationRepo = new Mock<IOperationRequestRepository>();
            _mockStaffRepo = new Mock<IStaffRepository>();
            _mockOperationTypeRepo = new Mock<IOperationTypeRepository>();
            _mockPatientRepo = new Mock<IPatientRepository>();
            _mockSpecializationRepo = new Mock<ISpecializationRepository>();
            _mockUnitOfWork = new Mock<IUnitOfWork>();
            _mockChangeLogRepo = new Mock<ISystemChangeLogRepository>();
            _mockAuthz = new Mock<IAuthzService>();
            _service = new OperationRequestService(_mockoperationRepo.Object, _mockStaffRepo.Object, _mockOperationTypeRepo.Object, _mockPatientRepo.Object, _mockUnitOfWork.Object, _mockChangeLogRepo.Object, _mockAuthz.Object);
        }

        [Fact]
        public async Task GetByIdAsync_ShouldReturnOperationRequest()
        {
            //inicializar 
            Staff doctor = await DummyStaff();
            Patient patient = await DummyPatient();
            OperationType operationType = await DummyOperationType();
            var createOperationRequestDto = new CreatingOperationRequestDto(
                "2024-10-20",
                "Urgent",
                1,
                "202410000001"
            );
            OperationRequest operationRequest = new OperationRequest(
                DateTime.Parse(createOperationRequestDto.DeadlineDate),
                createOperationRequestDto.Priority,
                doctor,
                operationType,
                patient
            );

#pragma warning disable CS8602 // Dereference of a possibly null reference.
            typeof(OperationRequest).GetProperty("Id").SetValue(operationRequest, new OperationRequestId(1));
#pragma warning restore CS8602 // Dereference of a possibly null reference.

            _mockStaffRepo.Setup(repo => repo.GetByEmailAsync(It.IsAny<string>())).ReturnsAsync(doctor);
            _mockAuthz.Setup(authz => authz.CurrentUserEmail()).Returns(doctor.Email);

            _mockoperationRepo.Setup(repo => repo.AddAsync(It.IsAny<OperationRequest>())).ReturnsAsync(operationRequest);
            await _service.AddAsync(createOperationRequestDto);

            _mockoperationRepo.Setup(repo => repo.GetByIdAsync(new OperationRequestId(1))).ReturnsAsync(operationRequest);
            var resultOperationRequest = await _service.GetByIdAsync(new OperationRequestId(1));

            Assert.NotNull(resultOperationRequest);
            _mockoperationRepo.Verify(repo => repo.GetByIdAsync(new OperationRequestId(1)), Times.Once); //Verifica se so retorna 1 value
            Assert.Equal(operationRequest.Priority.ToString(), resultOperationRequest.Priority.ToString());
        }
        [Fact]
        public async Task AddAsync_ShouldAddOperationRequest()
        {
            //inicializar 
            Staff doctor = await DummyStaff();
            Patient patient = await DummyPatient();
            OperationType operationType = await DummyOperationType();
            var createOperationRequestDto = new CreatingOperationRequestDto(
                "2024-10-20",
                "Urgent",
                1,
                "202410000001"
            );
            OperationRequest operationRequest = new OperationRequest(
                DateTime.Parse(createOperationRequestDto.DeadlineDate),
                createOperationRequestDto.Priority,
                doctor,
                operationType,
                patient
            );

#pragma warning disable CS8602 // Dereference of a possibly null reference.
            typeof(OperationRequest).GetProperty("Id").SetValue(operationRequest, new OperationRequestId(1));
#pragma warning restore CS8602 // Dereference of a possibly null reference.

            _mockStaffRepo.Setup(repo => repo.GetByEmailAsync(It.IsAny<string>())).ReturnsAsync(doctor);
            _mockAuthz.Setup(authz => authz.CurrentUserEmail()).Returns(doctor.Email);

            //SetUp
            _mockoperationRepo.Setup(repo => repo.AddAsync(It.IsAny<OperationRequest>())).ReturnsAsync(operationRequest);

            // Act
            var result = await _service.AddAsync(createOperationRequestDto);

            // Assert
            Assert.NotNull(result);
            _mockoperationRepo.Verify(repo => repo.AddAsync(It.IsAny<OperationRequest>()), Times.Once);//Verifica se so retorna 1 value
            Assert.Equal(createOperationRequestDto.Priority, result.Priority);
        }
        [Fact]
        public async Task UpdateAsync_ShouldUpdateOperationRequest()
        {
            //inicializar 
            Staff doctor = await DummyStaff();
            Patient patient = await DummyPatient();
            OperationType operationType = await DummyOperationType();
            var createOperationRequestDto = new CreatingOperationRequestDto(
                "2024-10-20",
                "Urgent",
                1,
                "202410000001"
            );
            OperationRequest operationRequest = new OperationRequest(
                DateTime.Parse(createOperationRequestDto.DeadlineDate),
                createOperationRequestDto.Priority,
                doctor,
                operationType,
                patient
            );

#pragma warning disable CS8602 // Dereference of a possibly null reference.
            typeof(OperationRequest).GetProperty("Id").SetValue(operationRequest, new OperationRequestId(1));
#pragma warning restore CS8602 // Dereference of a possibly null reference.

            _mockStaffRepo.Setup(repo => repo.GetByEmailAsync(It.IsAny<string>())).ReturnsAsync(doctor);
            _mockAuthz.Setup(authz => authz.CurrentUserEmail()).Returns(doctor.Email);

            _mockoperationRepo.Setup(repo => repo.AddAsync(It.IsAny<OperationRequest>())).ReturnsAsync(operationRequest);

            //DateTime deadlineDate, string priority, Staff requestedByDoctor, OperationType operationType, Patient patient
            var newDeadlineDate = new DateTime(1999, 10, 02);
            var newPriority = "Elective";

            operationRequest.Update(newDeadlineDate, newPriority, doctor, operationType, patient);

            _mockoperationRepo.Setup(repo => repo.GetByIdAsync(new OperationRequestId(1))).ReturnsAsync(operationRequest);
            var resultOperationRequest = await _service.GetByIdAsync(new OperationRequestId(1));

            Assert.NotNull(resultOperationRequest);
            Assert.Equal(newPriority, resultOperationRequest.Priority.ToString());
            Assert.Equal(newDeadlineDate.ToString(), resultOperationRequest.DeadlineDate);
        }


        [Theory]
        [InlineData("Urgent", null, "Ze", "202410000001", false, false)]
        [InlineData("Urgent", 1, "Ze", "202410000001", false, false)]
        [InlineData("Urgent", null, "Ze", "202410000001", true, false)]
        [InlineData("Urgent", null, "Ze", "202410000001", false, true)]
        [InlineData("Urgent", null, "Ze", "202410000001", true, true)]
        public async Task GetAllAsyncWithFiltersReturnsOperationRequestList(
            string priority,
            int? operationtype,
            string patientName,
            string patientMedicalRecordNumber,
            bool hasStartDate,
            bool hasEndDate)
        {
            //inicializar 
            Staff doctor = await DummyStaff();
            Patient patient = await DummyPatient();
            OperationType operationType = await DummyOperationType();
            var createOperationRequestDto = new CreatingOperationRequestDto(
                "2024-10-20",
                "Urgent",
                1,
                "202410000001"
            );
            OperationRequest operationRequest = new OperationRequest(
                DateTime.Parse(createOperationRequestDto.DeadlineDate),
                createOperationRequestDto.Priority,
                doctor,
                operationType,
                patient
            );

#pragma warning disable CS8602 // Dereference of a possibly null reference.
            typeof(OperationRequest).GetProperty("Id").SetValue(operationRequest, new OperationRequestId(1));
#pragma warning restore CS8602 // Dereference of a possibly null reference.

            _mockStaffRepo.Setup(repo => repo.GetByEmailAsync(It.IsAny<string>())).ReturnsAsync(doctor);
            _mockAuthz.Setup(authz => authz.CurrentUserEmail()).Returns(doctor.Email);

            _mockoperationRepo.Setup(repo => repo.AddAsync(It.IsAny<OperationRequest>())).ReturnsAsync(operationRequest);
            await _service.AddAsync(createOperationRequestDto);
            _mockoperationRepo.Setup(repo => repo.GetByIdAsync(new OperationRequestId(1))).ReturnsAsync(operationRequest);
            OperationRequestDto dto = await _service.GetByIdAsync(new OperationRequestId(1));

            _mockoperationRepo
                .Setup(repo => repo.GetAllAsyncWithFilters(It.IsAny<string>(), It.IsAny<int?>(), It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>(), It.IsAny<DateTime?>(), It.IsAny<DateTime?>()))
                .ReturnsAsync(new List<OperationRequest>());

            DateTime? startDateTime = null;
            DateTime? endDateTime = null;
            if (hasStartDate)
                startDateTime = new DateTime(2024, 10, 15);
            if (hasEndDate)
                endDateTime = new DateTime(2024, 10, 25);


            var result = await _service.GetAllAsyncWithFilters(priority, operationtype, patientName, patientMedicalRecordNumber, startDateTime, endDateTime);

            // Assert
            Assert.NotNull(result);
            Assert.Empty(result);
        }
        private async Task<Staff> DummyStaff()
        {
            // Arrange specialization
            int specializationId = 1;

            SpecializationDto specializationDto = new SpecializationDto();
            specializationDto.Name = "Genecologist";
            specializationDto.Code = "12345"; 
            specializationDto.Description= "Specialization in gynecology and obstetrics."
            ;

            Specialization specialization = new Specialization(specializationDto.Name,specializationDto.Code,specializationDto.Description);
#pragma warning disable CS8602 // Dereference of a possibly null reference.
            typeof(Specialization).GetProperty("Id").SetValue(specialization, new SpecializationId(specializationId));
#pragma warning restore CS8602 // Dereference of a possibly null reference.

            _mockSpecializationRepo.Setup(repo => repo.AddAsync(It.IsAny<Specialization>())).ReturnsAsync(specialization);
            await _mockSpecializationRepo.Object.AddAsync(specialization);

            _mockSpecializationRepo.Setup(repo => repo.GetByIdAsync(new SpecializationId(specializationId))).ReturnsAsync(specialization);
            await _mockSpecializationRepo.Object.GetByIdAsync(new SpecializationId(specializationId));

            List<Tuple<DateTime, DateTime>> availabilitySlotsDto = new List<Tuple<DateTime, DateTime>>();
            availabilitySlotsDto.Add(new Tuple<DateTime, DateTime>(DateTime.Now, DateTime.Now.AddHours(1)));
            CreatingStaffDto creatingStaffDto = new CreatingStaffDto
            {
                LicenseNumber = "123",
                Email = "mail@mail.com",
                Phone = "123456789",
                FirstName = "Tomas",
                LastName = "de Oliveira",
                Role = "Doctor",
                AvailabilitySlots = availabilitySlotsDto,
                Specialization = 1
            };

            List<DateTimeTuple> availabilitySlots = new();
            foreach (Tuple<DateTime, DateTime> tuple in creatingStaffDto.AvailabilitySlots)
            {
                availabilitySlots.Add(new DateTimeTuple(tuple.Item1, tuple.Item2));
            }

            string staffId = "D202400001";
            Staff staff = new Staff(creatingStaffDto.LicenseNumber, creatingStaffDto.Email, creatingStaffDto.Phone,
            creatingStaffDto.FirstName, creatingStaffDto.LastName, creatingStaffDto.Role, availabilitySlots, specialization);

#pragma warning disable CS8602 // Dereference of a possibly null reference.
            typeof(Staff).GetProperty("Id").SetValue(staff, new StaffId(staffId));
#pragma warning restore CS8602 // Dereference of a possibly null reference.

            _mockStaffRepo.Setup(repo => repo.AddAsync(It.IsAny<Staff>())).ReturnsAsync(staff);
            await _mockStaffRepo.Object.AddAsync(staff);

            _mockStaffRepo.Setup(repo => repo.GetByIdAsync(staff.Id)).ReturnsAsync(staff);
            await _mockStaffRepo.Object.GetByIdAsync(new StaffId(staff.Id.AsString()));

            return staff;
        }
        private async Task<Patient> DummyPatient()
        {
            //PatientMedicalRecordNumber= P202400002
            string patientID = "202410000001";
            Patient patient = new Patient(
                "Ze",
                "Broas",
                "Ze Broas",
                "123456789",
                "Man",
                DateTime.Parse("1998-08-02"),
                "1@gmail.com",
                "1234567890",
                "rua torta"
            );

#pragma warning disable CS8602 // Dereference of a possibly null reference.
            typeof(Patient).GetProperty("Id").SetValue(patient, new PatientMedicalRecordNumber(patientID));
#pragma warning restore CS8602 // Dereference of a possibly null reference.

            _mockPatientRepo.Setup(repo => repo.AddAsync(It.IsAny<Patient>())).ReturnsAsync(patient);
            await _mockPatientRepo.Object.AddAsync(patient);

            _mockPatientRepo.Setup(repo => repo.GetByIdAsync(new PatientMedicalRecordNumber(patientID))).ReturnsAsync(patient);
            await _mockPatientRepo.Object.GetByIdAsync(new PatientMedicalRecordNumber(patientID));

            return patient;
        }
        private async Task<OperationType> DummyOperationType()
        {
            List<OperationTypePhaseSpecialization> listOperationTypePhaseSpecialization = new List<OperationTypePhaseSpecialization>{
                new OperationTypePhaseSpecialization(new Specialization("12345", "Genecologist", "Specialization in gynecology and obstetrics."), 1),
                new OperationTypePhaseSpecialization(new Specialization("12345", "Genecologist", "Specialization in gynecology and obstetrics."), 2)};

            OperationTypePhase phase = new OperationTypePhase("Anesthesia/patient preparation", 10, listOperationTypePhaseSpecialization);

            int operationTypeID = 1;
            OperationType operationType = new OperationType("Operation Type1", new List<OperationTypePhase> { phase }, 1);

#pragma warning disable CS8602 // Dereference of a possibly null reference.
            typeof(OperationType).GetProperty("Id").SetValue(operationType, new OperationTypeId(operationTypeID));
#pragma warning restore CS8602 // Dereference of a possibly null reference.

            _mockOperationTypeRepo.Setup(repo => repo.AddAsync(It.IsAny<OperationType>())).ReturnsAsync(operationType);
            await _mockOperationTypeRepo.Object.AddAsync(operationType);

            _mockOperationTypeRepo.Setup(repo => repo.GetByIdAsync(new OperationTypeId(operationTypeID))).ReturnsAsync(operationType);
            await _mockOperationTypeRepo.Object.GetByIdAsync(new OperationTypeId(operationTypeID));

            return operationType;
        }
    }
}