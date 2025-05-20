using BackEnd.Domain.Staffs;
using BackEnd.Domain.Specializations;
using BackEnd.Domain.Shared;
using BackEnd.Services;

namespace BackEnd.Tests
{
    public class StaffServiceTest
    {
        private readonly Mock<IUnitOfWork> _mockUnitOfWork;
        private readonly Mock<IStaffRepository> _mockStaffRepo;
        private readonly Mock<ISpecializationRepository> _mockSpecializationRepo;
        private readonly Mock<ISystemChangeLogRepository> _mockChangeLogRepo;
        private readonly StaffService _service;

        public StaffServiceTest()
        {
            _mockStaffRepo = new Mock<IStaffRepository>();
            _mockSpecializationRepo = new Mock<ISpecializationRepository>();
            _mockUnitOfWork = new Mock<IUnitOfWork>();
            _mockChangeLogRepo = new Mock<ISystemChangeLogRepository>();
            _service = new StaffService(_mockUnitOfWork.Object, _mockStaffRepo.Object, _mockSpecializationRepo.Object, _mockChangeLogRepo.Object);
        }

        [Fact]
        public async Task AddAsync_ShouldAddStaff()
        {
            Tuple<Staff, CreatingStaffDto> tuple = await DummyStaff("123", "mail@mail.com", "123456789", "Nome", "Apelido", "Doctor");

            // Act
            _mockStaffRepo.Setup(repo => repo.AddAsync(It.IsAny<Staff>())).ReturnsAsync(tuple.Item1);
            StaffDto result = await _service.AddAsync(tuple.Item2);

            // Assert
            Assert.NotNull(result);
            _mockStaffRepo.Verify(repo => repo.AddAsync(It.IsAny<Staff>()), Times.Once);//Verifica se so retorna 1 value
            Assert.Equal(tuple.Item2.FirstName, result.FirstName);
        }

        [Fact]
        public async Task UpdateAsync_ShouldUpdateStaff()
        {
            Tuple<Staff, CreatingStaffDto> tuple = await DummyStaff("123", "mail@mail.com", "123456789", "Nome", "Apelido", "Doctor");

            _mockStaffRepo.Setup(repo => repo.AddAsync(It.IsAny<Staff>())).ReturnsAsync(tuple.Item1);
            await _service.AddAsync(tuple.Item2);

            _mockStaffRepo.Setup(repo => repo.GetByIdAsync(tuple.Item1.Id)).ReturnsAsync(tuple.Item1);
            await _service.GetByIdAsync(tuple.Item1.Id.AsString());

            string updatedEmail = "updatedmail@mail.com";
            string updatedPhone = "987654321";
            string updatedFirstName = "Nome 2";
            string updatedLastName = "Apelido 2";
            tuple.Item1.Update(updatedEmail, updatedPhone, updatedFirstName, updatedLastName, DummyStaffAvailabilitySlots());

            _mockStaffRepo.Setup(repo => repo.GetByIdAsync(tuple.Item1.Id)).ReturnsAsync(tuple.Item1);
            StaffDto result = await _service.GetByIdAsync(tuple.Item1.Id.AsString());

            // Assert
            Assert.NotNull(result);
            Assert.Equal(updatedEmail, result.Email);
            Assert.Equal(updatedPhone, result.Phone);
            Assert.Equal(updatedFirstName, result.FirstName);
            Assert.Equal(updatedLastName, result.LastName);
        }

        [Fact]
        public async Task GetByIdAsync_ShouldReturnStaff()
        {
            Tuple<Staff, CreatingStaffDto> tuple = await DummyStaff("123", "mail@mail.com", "123456789", "Nome", "Apelido", "Doctor");

            _mockStaffRepo.Setup(repo => repo.AddAsync(It.IsAny<Staff>())).ReturnsAsync(tuple.Item1);
            await _service.AddAsync(tuple.Item2);

            _mockStaffRepo.Setup(repo => repo.GetByIdAsync(tuple.Item1.Id)).ReturnsAsync(tuple.Item1);
            StaffDto result = await _service.GetByIdAsync(tuple.Item1.Id.AsString());

            // Assert
            Assert.NotNull(result);
            _mockStaffRepo.Verify(repo => repo.GetByIdAsync(tuple.Item1.Id), Times.Once); //Verifica se so retorna 1 value
            Assert.Equal(tuple.Item1.FirstName, result.FirstName);
        }

        private async Task<Specialization> DummySpecialization()
        {
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

            return specialization;
        }

        private async Task<Tuple<Staff, CreatingStaffDto>> DummyStaff(string licenseNumber, string email, string phone, string firstName, string lastName, string role)
        {
            Specialization specialization = await DummySpecialization();

            List<Tuple<DateTime, DateTime>> availabilitySlotsDto = [];
            availabilitySlotsDto.Add(new Tuple<DateTime, DateTime>(DateTime.Now, DateTime.Now.AddHours(1)));

            // Arrange staff
            CreatingStaffDto creatingStaffDto = new CreatingStaffDto
            {
                LicenseNumber = licenseNumber,
                Email = email,
                Phone = phone,
                FirstName = firstName,
                LastName = lastName,
                Role = role,
                AvailabilitySlots = availabilitySlotsDto,
                Specialization = specialization.Id.ToInt
            };

            Staff staff = new Staff(creatingStaffDto.LicenseNumber, creatingStaffDto.Email, creatingStaffDto.Phone,
            creatingStaffDto.FirstName, creatingStaffDto.LastName, creatingStaffDto.Role, DummyStaffAvailabilitySlots(), specialization);

            return new Tuple<Staff, CreatingStaffDto>(staff, creatingStaffDto);
        }

        private List<DateTimeTuple> DummyStaffAvailabilitySlots()
        {
            List<Tuple<DateTime, DateTime>> availabilitySlotsDto = [];
            availabilitySlotsDto.Add(new Tuple<DateTime, DateTime>(DateTime.Now, DateTime.Now.AddHours(1)));

            List<DateTimeTuple> availabilitySlots = new();
            foreach (Tuple<DateTime, DateTime> tuple in availabilitySlotsDto)
            {
                availabilitySlots.Add(new DateTimeTuple(tuple.Item1, tuple.Item2));
            }
            return availabilitySlots;
        }
    }
}