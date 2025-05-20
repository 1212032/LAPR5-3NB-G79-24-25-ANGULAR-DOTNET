using BackEnd.Domain.Appointments;
using BackEnd.Domain.Specializations;
using BackEnd.Domain.Shared;
using BackEnd.Domain.OperationRequests;
using BackEnd.Domain.OperationTypes;
using BackEnd.Domain.SurgeryRooms;
using BackEnd.Domain.Staffs;
using BackEnd.Domain.Patients;

namespace BackEnd.Tests
{
    public class AppointmentServiceTest
    {
        private readonly Mock<IUnitOfWork> _mockUnitOfWork;
        private readonly Mock<IAppointmentRepository> _mockAppointmentRepo;
        private readonly Mock<IOperationTypeRepository> _mockOperationTypeRepo;
        private readonly Mock<IOperationRequestRepository> _mockOperationRequestRepo;
        private readonly Mock<ISurgeryRoomRepository> _mockSurgeryRoomRepo;
        private readonly Mock<IStaffRepository> _mockStaffRepo;
        private readonly AppointmentService _service;
        private string staffId = "";
        private readonly string RoomCode1 = "12345678";
        private readonly string RoomCode2 = "87654321";
        private int appointmentId = 1;

        public AppointmentServiceTest()
        {
            _mockAppointmentRepo = new Mock<IAppointmentRepository>();
            _mockOperationTypeRepo = new Mock<IOperationTypeRepository>();
            _mockOperationRequestRepo = new Mock<IOperationRequestRepository>();
            _mockSurgeryRoomRepo = new Mock<ISurgeryRoomRepository>();
            _mockStaffRepo = new Mock<IStaffRepository>();
            _mockUnitOfWork = new Mock<IUnitOfWork>();
            _service = new AppointmentService(_mockUnitOfWork.Object, _mockAppointmentRepo.Object, _mockOperationTypeRepo.Object,
            _mockOperationRequestRepo.Object, _mockStaffRepo.Object, _mockSurgeryRoomRepo.Object);
        }

        [Fact]
        public async Task AddAsync_ShouldAddAppointment()
        {
            Tuple<Appointment, CreatingAppointmentDto> tuple = DummyAppointment();

            _mockOperationRequestRepo.Setup(repo => repo.GetByIdAsync(new OperationRequestId(1))).ReturnsAsync(DummyOperationRequest());
            _mockSurgeryRoomRepo.Setup(repo => repo.GetByCodeAsync(RoomCode1)).ReturnsAsync(DummySurgeryRoom(RoomCode1));

            List<Appointment> appointments = [];
            _mockAppointmentRepo.Setup(repo => repo.GetAppointmentsByRoom(It.IsAny<string>(), It.IsAny<DateTime>(), It.IsAny<DateTime>())).ReturnsAsync(appointments);
            _mockAppointmentRepo.Setup(repo => repo.GetAppointmentByStaff(It.IsAny<string>(), It.IsAny<DateTime>(), It.IsAny<DateTime>())).ReturnsAsync(appointments);

            Staff staff = DummyStaff();
            _mockStaffRepo.Setup(repo => repo.GetByIdAsync(staff.Id)).ReturnsAsync(staff);

            _mockAppointmentRepo.Setup(repo => repo.AddAsync(It.IsAny<Appointment>())).ReturnsAsync(tuple.Item1);
            await _service.AddAsync(tuple.Item2);

            _mockAppointmentRepo.Setup(repo => repo.GetByIdAsync(new AppointmentId(1))).ReturnsAsync(tuple.Item1);
            AppointmentDto result = await _service.GetByIdAsync(1);

            // Assert
            Assert.NotNull(result);
            _mockAppointmentRepo.Verify(repo => repo.AddAsync(It.IsAny<Appointment>()), Times.Once);//Verifica se so retorna 1 value
            Assert.Equal(tuple.Item2.Room, result.Room);
            Assert.Equal(tuple.Item2.OriginatingOperationRequest, result.OriginatingOperationRequest);
        }

        [Fact]
        public async Task AddAsync_ShouldThrowError_RoomNotFound()
        {
            Tuple<Appointment, CreatingAppointmentDto> tuple = DummyAppointment();
            _mockOperationRequestRepo.Setup(repo => repo.GetByIdAsync(new OperationRequestId(1))).ReturnsAsync(DummyOperationRequest());

            List<Appointment> appointments = [];
            _mockAppointmentRepo.Setup(repo => repo.GetAppointmentsByRoom(It.IsAny<string>(), It.IsAny<DateTime>(), It.IsAny<DateTime>())).ReturnsAsync(appointments);
            _mockAppointmentRepo.Setup(repo => repo.GetAppointmentByStaff(It.IsAny<string>(), It.IsAny<DateTime>(), It.IsAny<DateTime>())).ReturnsAsync(appointments);

            Staff staff = DummyStaff();
            _mockStaffRepo.Setup(repo => repo.GetByIdAsync(staff.Id)).ReturnsAsync(staff);

            _mockAppointmentRepo.Setup(repo => repo.AddAsync(It.IsAny<Appointment>())).ReturnsAsync(tuple.Item1);
            Exception ex = await Assert.ThrowsAsync<BusinessRuleValidationException>(() => _service.AddAsync(tuple.Item2));
            Assert.Contains("room not found", ex.Message.ToLower());
        }

        [Fact]
        public async Task AddAsync_ShouldThrowError_StaffNotFound()
        {
            Tuple<Appointment, CreatingAppointmentDto> tuple = DummyAppointment();
            _mockOperationRequestRepo.Setup(repo => repo.GetByIdAsync(new OperationRequestId(1))).ReturnsAsync(DummyOperationRequest());
            _mockSurgeryRoomRepo.Setup(repo => repo.GetByCodeAsync(RoomCode1)).ReturnsAsync(DummySurgeryRoom(RoomCode1));

            List<Appointment> appointments = [];
            _mockAppointmentRepo.Setup(repo => repo.GetAppointmentsByRoom(It.IsAny<string>(), It.IsAny<DateTime>(), It.IsAny<DateTime>())).ReturnsAsync(appointments);
            _mockAppointmentRepo.Setup(repo => repo.GetAppointmentByStaff(It.IsAny<string>(), It.IsAny<DateTime>(), It.IsAny<DateTime>())).ReturnsAsync(appointments);

            _mockAppointmentRepo.Setup(repo => repo.AddAsync(It.IsAny<Appointment>())).ReturnsAsync(tuple.Item1);
            Exception ex = await Assert.ThrowsAsync<BusinessRuleValidationException>(() => _service.AddAsync(tuple.Item2));
            Assert.Contains(("staff id " + staffId + " not found").ToLower(), ex.Message.ToLower());
        }

        [Fact]
        public async Task AddAsync_ShouldThrowError_OperationRequestNotFound()
        {
            Tuple<Appointment, CreatingAppointmentDto> tuple = DummyAppointment();
            _mockSurgeryRoomRepo.Setup(repo => repo.GetByCodeAsync(RoomCode1)).ReturnsAsync(DummySurgeryRoom(RoomCode1));

            List<Appointment> appointments = [];
            _mockAppointmentRepo.Setup(repo => repo.GetAppointmentsByRoom(It.IsAny<string>(), It.IsAny<DateTime>(), It.IsAny<DateTime>())).ReturnsAsync(appointments);
            _mockAppointmentRepo.Setup(repo => repo.GetAppointmentByStaff(It.IsAny<string>(), It.IsAny<DateTime>(), It.IsAny<DateTime>())).ReturnsAsync(appointments);

            Staff staff = DummyStaff();
            _mockStaffRepo.Setup(repo => repo.GetByIdAsync(staff.Id)).ReturnsAsync(staff);

            _mockAppointmentRepo.Setup(repo => repo.AddAsync(It.IsAny<Appointment>())).ReturnsAsync(tuple.Item1);
            Exception ex = await Assert.ThrowsAsync<BusinessRuleValidationException>(() => _service.AddAsync(tuple.Item2));
            Assert.Contains("operation request not found", ex.Message.ToLower());
        }

        [Fact]
        public async Task AddAsync_ShouldThrowError_OperationRequestAlreadyScheduled()
        {
            Tuple<Appointment, CreatingAppointmentDto> tuple = DummyAppointment();
            _mockOperationRequestRepo.Setup(repo => repo.GetByIdAsync(new OperationRequestId(1))).ReturnsAsync(DummyOperationRequest(true));
            _mockSurgeryRoomRepo.Setup(repo => repo.GetByCodeAsync(RoomCode1)).ReturnsAsync(DummySurgeryRoom(RoomCode1));

            List<Appointment> appointments = [];
            _mockAppointmentRepo.Setup(repo => repo.GetAppointmentsByRoom(It.IsAny<string>(), It.IsAny<DateTime>(), It.IsAny<DateTime>())).ReturnsAsync(appointments);
            _mockAppointmentRepo.Setup(repo => repo.GetAppointmentByStaff(It.IsAny<string>(), It.IsAny<DateTime>(), It.IsAny<DateTime>())).ReturnsAsync(appointments);

            Staff staff = DummyStaff();
            _mockStaffRepo.Setup(repo => repo.GetByIdAsync(staff.Id)).ReturnsAsync(staff);

            _mockAppointmentRepo.Setup(repo => repo.AddAsync(It.IsAny<Appointment>())).ReturnsAsync(tuple.Item1);
            Exception ex = await Assert.ThrowsAsync<BusinessRuleValidationException>(() => _service.AddAsync(tuple.Item2));
            Assert.Contains("operation request already scheduled", ex.Message.ToLower());
        }

        [Fact]
        public async Task AddAsync_ShouldThrowError_MissingPhases()
        {
            Tuple<Appointment, CreatingAppointmentDto> tuple = DummyAppointment(true);
            _mockOperationRequestRepo.Setup(repo => repo.GetByIdAsync(new OperationRequestId(1))).ReturnsAsync(DummyOperationRequest());
            _mockSurgeryRoomRepo.Setup(repo => repo.GetByCodeAsync(RoomCode1)).ReturnsAsync(DummySurgeryRoom(RoomCode1));

            List<Appointment> appointments = [];
            _mockAppointmentRepo.Setup(repo => repo.GetAppointmentsByRoom(It.IsAny<string>(), It.IsAny<DateTime>(), It.IsAny<DateTime>())).ReturnsAsync(appointments);
            _mockAppointmentRepo.Setup(repo => repo.GetAppointmentByStaff(It.IsAny<string>(), It.IsAny<DateTime>(), It.IsAny<DateTime>())).ReturnsAsync(appointments);

            Staff staff = DummyStaff();
            _mockStaffRepo.Setup(repo => repo.GetByIdAsync(staff.Id)).ReturnsAsync(staff);

            _mockAppointmentRepo.Setup(repo => repo.AddAsync(It.IsAny<Appointment>())).ReturnsAsync(tuple.Item1);
            Exception ex = await Assert.ThrowsAsync<BusinessRuleValidationException>(() => _service.AddAsync(tuple.Item2));
            Assert.Contains("wrong number of phases entered", ex.Message.ToLower());
        }

        [Fact]
        public async Task AddAsync_ShouldThrowError_RoomUnavailable()
        {
            Tuple<Appointment, CreatingAppointmentDto> tuple = DummyAppointment();
            _mockOperationRequestRepo.Setup(repo => repo.GetByIdAsync(new OperationRequestId(1))).ReturnsAsync(DummyOperationRequest());
            _mockSurgeryRoomRepo.Setup(repo => repo.GetByCodeAsync(RoomCode1)).ReturnsAsync(DummySurgeryRoom(RoomCode1));

            List<Appointment> appointments = [];
            appointments.Add(DummyAppointment().Item1);
            _mockAppointmentRepo.Setup(repo => repo.GetAppointmentsByRoom(It.IsAny<string>(), It.IsAny<DateTime>(), It.IsAny<DateTime>())).ReturnsAsync(appointments);
            _mockAppointmentRepo.Setup(repo => repo.GetAppointmentByStaff(It.IsAny<string>(), It.IsAny<DateTime>(), It.IsAny<DateTime>())).ReturnsAsync(appointments);

            Staff staff = DummyStaff();
            _mockStaffRepo.Setup(repo => repo.GetByIdAsync(staff.Id)).ReturnsAsync(staff);

            _mockAppointmentRepo.Setup(repo => repo.AddAsync(It.IsAny<Appointment>())).ReturnsAsync(tuple.Item1);
            Exception ex = await Assert.ThrowsAsync<BusinessRuleValidationException>(() => _service.AddAsync(tuple.Item2));
            Assert.Contains("room occupied", ex.Message.ToLower());
        }

        [Fact]
        public async Task AddAsync_ShouldThrowError_InvalidExtraStaff()
        {
            Tuple<Appointment, CreatingAppointmentDto> tuple = DummyAppointment(false, true);
            _mockOperationRequestRepo.Setup(repo => repo.GetByIdAsync(new OperationRequestId(1))).ReturnsAsync(DummyOperationRequest());
            _mockSurgeryRoomRepo.Setup(repo => repo.GetByCodeAsync(RoomCode1)).ReturnsAsync(DummySurgeryRoom(RoomCode1));

            List<Appointment> appointments = [];
            _mockAppointmentRepo.Setup(repo => repo.GetAppointmentsByRoom(It.IsAny<string>(), It.IsAny<DateTime>(), It.IsAny<DateTime>())).ReturnsAsync(appointments);
            _mockAppointmentRepo.Setup(repo => repo.GetAppointmentByStaff(It.IsAny<string>(), It.IsAny<DateTime>(), It.IsAny<DateTime>())).ReturnsAsync(appointments);

            Staff staff = DummyStaff();
            _mockStaffRepo.Setup(repo => repo.GetByIdAsync(staff.Id)).ReturnsAsync(staff);

            _mockAppointmentRepo.Setup(repo => repo.AddAsync(It.IsAny<Appointment>())).ReturnsAsync(tuple.Item1);
            Exception ex = await Assert.ThrowsAsync<BusinessRuleValidationException>(() => _service.AddAsync(tuple.Item2));
            Assert.Contains("can't assign the same staff to different positions", ex.Message.ToLower());
        }

        [Fact]
        public async Task AddAsync_ShouldThrowError_StaffUnavailable()
        {
            Tuple<Appointment, CreatingAppointmentDto> tuple = DummyAppointment();
            _mockOperationRequestRepo.Setup(repo => repo.GetByIdAsync(new OperationRequestId(1))).ReturnsAsync(DummyOperationRequest());
            _mockSurgeryRoomRepo.Setup(repo => repo.GetByCodeAsync(RoomCode1)).ReturnsAsync(DummySurgeryRoom(RoomCode1));

            List<Appointment> roomAppointments = [];
            _mockAppointmentRepo.Setup(repo => repo.GetAppointmentsByRoom(It.IsAny<string>(), It.IsAny<DateTime>(), It.IsAny<DateTime>())).ReturnsAsync(roomAppointments);
            List<Appointment> staffAppointments = [];
            staffAppointments.Add(DummyAppointment().Item1);
            _mockAppointmentRepo.Setup(repo => repo.GetAppointmentByStaff(It.IsAny<string>(), It.IsAny<DateTime>(), It.IsAny<DateTime>())).ReturnsAsync(staffAppointments);

            Staff staff = DummyStaff();
            _mockStaffRepo.Setup(repo => repo.GetByIdAsync(staff.Id)).ReturnsAsync(staff);

            _mockAppointmentRepo.Setup(repo => repo.AddAsync(It.IsAny<Appointment>())).ReturnsAsync(tuple.Item1);
            Exception ex = await Assert.ThrowsAsync<BusinessRuleValidationException>(() => _service.AddAsync(tuple.Item2));
            Assert.Contains(("staff id " + staffId + " is not available at that date and time").ToLower(), ex.Message.ToLower());
        }

        [Fact]
        public async Task UpdateAsync_ShouldUpdateAppointment()
        {
            Tuple<Appointment, UpdatingAppointmentDto> tuple = DummyUpdatingAppointment();

            _mockOperationRequestRepo.Setup(repo => repo.GetByIdAsync(new OperationRequestId(1))).ReturnsAsync(DummyOperationRequest());
            _mockSurgeryRoomRepo.Setup(repo => repo.GetByCodeAsync(RoomCode2)).ReturnsAsync(DummySurgeryRoom(RoomCode2));

            List<Appointment> appointments = [];
            _mockAppointmentRepo.Setup(repo => repo.GetAppointmentsByRoom(It.IsAny<string>(), It.IsAny<DateTime>(), It.IsAny<DateTime>())).ReturnsAsync(appointments);
            _mockAppointmentRepo.Setup(repo => repo.GetAppointmentByStaff(It.IsAny<string>(), It.IsAny<DateTime>(), It.IsAny<DateTime>())).ReturnsAsync(appointments);

            Staff staff = DummyStaff();
            _mockStaffRepo.Setup(repo => repo.GetByIdAsync(staff.Id)).ReturnsAsync(staff);

            _mockAppointmentRepo.Setup(repo => repo.GetByIdAsync(new AppointmentId(1))).ReturnsAsync(tuple.Item1);

            tuple.Item2.Room = RoomCode2;
            AppointmentDto result = await _service.UpdateAsync(tuple.Item2);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(tuple.Item2.Room, result.Room);
            Assert.Equal(tuple.Item2.Id, result.Id);
        }

        [Fact]
        public async Task UpdateAsync_ShouldThrowError_RoomNotFound()
        {
            Tuple<Appointment, UpdatingAppointmentDto> tuple = DummyUpdatingAppointment();
            _mockOperationRequestRepo.Setup(repo => repo.GetByIdAsync(new OperationRequestId(1))).ReturnsAsync(DummyOperationRequest());

            List<Appointment> appointments = [];
            _mockAppointmentRepo.Setup(repo => repo.GetAppointmentsByRoom(It.IsAny<string>(), It.IsAny<DateTime>(), It.IsAny<DateTime>())).ReturnsAsync(appointments);
            _mockAppointmentRepo.Setup(repo => repo.GetAppointmentByStaff(It.IsAny<string>(), It.IsAny<DateTime>(), It.IsAny<DateTime>())).ReturnsAsync(appointments);

            Staff staff = DummyStaff();
            _mockStaffRepo.Setup(repo => repo.GetByIdAsync(staff.Id)).ReturnsAsync(staff);

            _mockAppointmentRepo.Setup(repo => repo.GetByIdAsync(new AppointmentId(1))).ReturnsAsync(tuple.Item1);
            Exception ex = await Assert.ThrowsAsync<BusinessRuleValidationException>(() => _service.UpdateAsync(tuple.Item2));
            Assert.Contains("room not found", ex.Message.ToLower());
        }

        [Fact]
        public async Task UpdateAsync_ShouldThrowError_StaffNotFound()
        {
            Tuple<Appointment, UpdatingAppointmentDto> tuple = DummyUpdatingAppointment();
            _mockOperationRequestRepo.Setup(repo => repo.GetByIdAsync(new OperationRequestId(1))).ReturnsAsync(DummyOperationRequest());
            _mockSurgeryRoomRepo.Setup(repo => repo.GetByCodeAsync(RoomCode1)).ReturnsAsync(DummySurgeryRoom(RoomCode1));

            List<Appointment> appointments = [];
            _mockAppointmentRepo.Setup(repo => repo.GetAppointmentsByRoom(It.IsAny<string>(), It.IsAny<DateTime>(), It.IsAny<DateTime>())).ReturnsAsync(appointments);
            _mockAppointmentRepo.Setup(repo => repo.GetAppointmentByStaff(It.IsAny<string>(), It.IsAny<DateTime>(), It.IsAny<DateTime>())).ReturnsAsync(appointments);

            _mockAppointmentRepo.Setup(repo => repo.GetByIdAsync(new AppointmentId(1))).ReturnsAsync(tuple.Item1);
            Exception ex = await Assert.ThrowsAsync<BusinessRuleValidationException>(() => _service.UpdateAsync(tuple.Item2));
            Assert.Contains(("staff id " + staffId + " not found").ToLower(), ex.Message.ToLower());
        }

        [Fact]
        public async Task UpdateAsync_ShouldThrowError_AppointmentNotScheduled()
        {
            Tuple<Appointment, UpdatingAppointmentDto> tuple = DummyUpdatingAppointment(false, false, true);
            _mockOperationRequestRepo.Setup(repo => repo.GetByIdAsync(new OperationRequestId(1))).ReturnsAsync(DummyOperationRequest(true));
            _mockSurgeryRoomRepo.Setup(repo => repo.GetByCodeAsync(RoomCode1)).ReturnsAsync(DummySurgeryRoom(RoomCode1));

            List<Appointment> appointments = [];
            _mockAppointmentRepo.Setup(repo => repo.GetAppointmentsByRoom(It.IsAny<string>(), It.IsAny<DateTime>(), It.IsAny<DateTime>())).ReturnsAsync(appointments);
            _mockAppointmentRepo.Setup(repo => repo.GetAppointmentByStaff(It.IsAny<string>(), It.IsAny<DateTime>(), It.IsAny<DateTime>())).ReturnsAsync(appointments);

            Staff staff = DummyStaff();
            _mockStaffRepo.Setup(repo => repo.GetByIdAsync(staff.Id)).ReturnsAsync(staff);

            _mockAppointmentRepo.Setup(repo => repo.GetByIdAsync(new AppointmentId(1))).ReturnsAsync(tuple.Item1);
            Exception ex = await Assert.ThrowsAsync<BusinessRuleValidationException>(() => _service.UpdateAsync(tuple.Item2));
            Assert.Contains("appointment not scheduled", ex.Message.ToLower());
        }

        [Fact]
        public async Task UpdateAsync_ShouldThrowError_MissingPhases()
        {
            Tuple<Appointment, UpdatingAppointmentDto> tuple = DummyUpdatingAppointment(true);
            _mockOperationRequestRepo.Setup(repo => repo.GetByIdAsync(new OperationRequestId(1))).ReturnsAsync(DummyOperationRequest());
            _mockSurgeryRoomRepo.Setup(repo => repo.GetByCodeAsync(RoomCode1)).ReturnsAsync(DummySurgeryRoom(RoomCode1));

            List<Appointment> appointments = [];
            _mockAppointmentRepo.Setup(repo => repo.GetAppointmentsByRoom(It.IsAny<string>(), It.IsAny<DateTime>(), It.IsAny<DateTime>())).ReturnsAsync(appointments);
            _mockAppointmentRepo.Setup(repo => repo.GetAppointmentByStaff(It.IsAny<string>(), It.IsAny<DateTime>(), It.IsAny<DateTime>())).ReturnsAsync(appointments);

            Staff staff = DummyStaff();
            _mockStaffRepo.Setup(repo => repo.GetByIdAsync(staff.Id)).ReturnsAsync(staff);

            _mockAppointmentRepo.Setup(repo => repo.GetByIdAsync(new AppointmentId(1))).ReturnsAsync(tuple.Item1);
            Exception ex = await Assert.ThrowsAsync<BusinessRuleValidationException>(() => _service.UpdateAsync(tuple.Item2));
            Assert.Contains("wrong number of phases entered", ex.Message.ToLower());
        }

        [Fact]
        public async Task UpdateAsync_ShouldThrowError_RoomUnavailable()
        {
            _mockOperationRequestRepo.Setup(repo => repo.GetByIdAsync(new OperationRequestId(1))).ReturnsAsync(DummyOperationRequest());
            _mockSurgeryRoomRepo.Setup(repo => repo.GetByCodeAsync(RoomCode1)).ReturnsAsync(DummySurgeryRoom(RoomCode1));

            Staff staff = DummyStaff();
            _mockStaffRepo.Setup(repo => repo.GetByIdAsync(staff.Id)).ReturnsAsync(staff);

            appointmentId = 2;
            Tuple<Appointment, UpdatingAppointmentDto> tuple2 = DummyUpdatingAppointment();

            appointmentId = 1;
            List<Appointment> appointments = [];
            appointments.Add(DummyUpdatingAppointment().Item1);
            appointments.Add(tuple2.Item1);
            _mockAppointmentRepo.Setup(repo => repo.GetAppointmentsByRoom(It.IsAny<string>(), It.IsAny<DateTime>(), It.IsAny<DateTime>())).ReturnsAsync(appointments);
            _mockAppointmentRepo.Setup(repo => repo.GetAppointmentByStaff(It.IsAny<string>(), It.IsAny<DateTime>(), It.IsAny<DateTime>())).ReturnsAsync(appointments);

            _mockAppointmentRepo.Setup(repo => repo.GetByIdAsync(new AppointmentId(2))).ReturnsAsync(tuple2.Item1);
            Exception ex = await Assert.ThrowsAsync<BusinessRuleValidationException>(() => _service.UpdateAsync(tuple2.Item2));
            Assert.Contains("room occupied", ex.Message.ToLower());
        }

        [Fact]
        public async Task UpdateAsync_ShouldThrowError_InvalidExtraStaff()
        {
            Tuple<Appointment, UpdatingAppointmentDto> tuple = DummyUpdatingAppointment(false, true);
            _mockOperationRequestRepo.Setup(repo => repo.GetByIdAsync(new OperationRequestId(1))).ReturnsAsync(DummyOperationRequest());
            _mockSurgeryRoomRepo.Setup(repo => repo.GetByCodeAsync(RoomCode1)).ReturnsAsync(DummySurgeryRoom(RoomCode1));

            List<Appointment> appointments = [];
            _mockAppointmentRepo.Setup(repo => repo.GetAppointmentsByRoom(It.IsAny<string>(), It.IsAny<DateTime>(), It.IsAny<DateTime>())).ReturnsAsync(appointments);
            _mockAppointmentRepo.Setup(repo => repo.GetAppointmentByStaff(It.IsAny<string>(), It.IsAny<DateTime>(), It.IsAny<DateTime>())).ReturnsAsync(appointments);

            Staff staff = DummyStaff();
            _mockStaffRepo.Setup(repo => repo.GetByIdAsync(staff.Id)).ReturnsAsync(staff);

            _mockAppointmentRepo.Setup(repo => repo.GetByIdAsync(new AppointmentId(1))).ReturnsAsync(tuple.Item1);
            Exception ex = await Assert.ThrowsAsync<BusinessRuleValidationException>(() => _service.UpdateAsync(tuple.Item2));
            Assert.Contains("can't assign the same staff to different positions", ex.Message.ToLower());
        }

        [Fact]
        public async Task UpdateAsync_ShouldThrowError_StaffUnavailable()
        {
            Tuple<Appointment, UpdatingAppointmentDto> tuple = DummyUpdatingAppointment();
            _mockOperationRequestRepo.Setup(repo => repo.GetByIdAsync(new OperationRequestId(1))).ReturnsAsync(DummyOperationRequest());
            _mockSurgeryRoomRepo.Setup(repo => repo.GetByCodeAsync(RoomCode1)).ReturnsAsync(DummySurgeryRoom(RoomCode1));

            Staff staff = DummyStaff();
            _mockStaffRepo.Setup(repo => repo.GetByIdAsync(staff.Id)).ReturnsAsync(staff);

            List<Appointment> roomAppointments = [];
            _mockAppointmentRepo.Setup(repo => repo.GetAppointmentsByRoom(It.IsAny<string>(), It.IsAny<DateTime>(), It.IsAny<DateTime>())).ReturnsAsync(roomAppointments);

            appointmentId = 2;
            Tuple<Appointment, UpdatingAppointmentDto> tuple2 = DummyUpdatingAppointment();

            appointmentId = 1;
            List<Appointment> appointments = [];
            appointments.Add(DummyUpdatingAppointment().Item1);
            appointments.Add(tuple2.Item1);
            _mockAppointmentRepo.Setup(repo => repo.GetAppointmentByStaff(It.IsAny<string>(), It.IsAny<DateTime>(), It.IsAny<DateTime>())).ReturnsAsync(appointments);

            _mockAppointmentRepo.Setup(repo => repo.GetByIdAsync(new AppointmentId(2))).ReturnsAsync(tuple2.Item1);
            Exception ex = await Assert.ThrowsAsync<BusinessRuleValidationException>(() => _service.UpdateAsync(tuple2.Item2));
            Assert.Contains(("staff id " + staffId + " is not available at that date and time").ToLower(), ex.Message.ToLower());
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

        private OperationRequest DummyOperationRequest(bool scheduled = false)
        {
            List<OperationTypePhase> phases = [];
            Specialization specialization = DummySpecialization();
            List<OperationTypePhaseSpecialization> specializations = [];
            OperationTypePhaseSpecialization operationTypePhaseSpecialization = new OperationTypePhaseSpecialization(specialization, 1);
            specializations.Add(operationTypePhaseSpecialization);
            OperationTypePhase phase1 = new OperationTypePhase("Anesthesia/patient preparation", 10, specializations);
            phases.Add(phase1);
            OperationTypePhase phase2 = new OperationTypePhase("Surgery", 10, specializations);
            phases.Add(phase2);
            OperationTypePhase phase3 = new OperationTypePhase("Cleaning", 10, specializations);
            phases.Add(phase3);
            OperationType operationType = new OperationType("Operation type 1", phases, 1);

            OperationRequest operationRequest = new OperationRequest(DateTime.Now.AddDays(1),
            OperationRequestStatus.Pending.Name, DummyStaff(), operationType, DummyPatient());

#pragma warning disable CS8602 // Dereference of a possibly null reference.
            typeof(OperationRequest).GetProperty("Id").SetValue(operationRequest, new OperationRequestId(1));
#pragma warning restore CS8602 // Dereference of a possibly null reference.

            if (scheduled)
                operationRequest.MarkAsScheduled();

            return operationRequest;
        }

        private Tuple<Appointment, CreatingAppointmentDto> DummyAppointment(bool missingPhases = false, bool extraStaff = false)
        {
            DateTime dateTime = DateTime.Now.AddDays(1);
            OperationRequest operationRequest = DummyOperationRequest();
            SurgeryRoom room = DummySurgeryRoom(RoomCode1);
            Staff staff = DummyStaff();

            List<AppointmentPhase> phases = [];
            List<AppointmentPhaseStaff> phaseStaff = [];
            phaseStaff.Add(new AppointmentPhaseStaff(staff));
            if (extraStaff)
            {
                phaseStaff.Add(new AppointmentPhaseStaff(staff));
            }
            AppointmentPhase phase = new AppointmentPhase(phaseStaff);
            phases.Add(phase);
            if (missingPhases == false)
            {
                phases.Add(phase);
                phases.Add(phase);
            }

            Appointment appointment = new Appointment(dateTime, operationRequest, room, phases);
#pragma warning disable CS8602 // Dereference of a possibly null reference.
            typeof(Appointment).GetProperty("Id").SetValue(appointment, new AppointmentId(1));
#pragma warning restore CS8602 // Dereference of a possibly null reference.

            CreatingAppointmentDto dto = new();
            dto.DateTime = dateTime;
            dto.OriginatingOperationRequest = 1;
            dto.Room = RoomCode1;

            dto.Phases = new List<AppointmentPhaseDto>();
            List<string> staffList = [];
            staffList.Add(staff.Id.AsString());
            if (extraStaff)
            {
                staffList.Add(staff.Id.AsString());
            }
            AppointmentPhaseDto phaseDto = new();
            phaseDto.Staff = staffList;
            dto.Phases.Add(phaseDto);
            if (missingPhases == false)
            {
                dto.Phases.Add(phaseDto);
                dto.Phases.Add(phaseDto);
            }

            return new Tuple<Appointment, CreatingAppointmentDto>(appointment, dto);
        }

        private Tuple<Appointment, UpdatingAppointmentDto> DummyUpdatingAppointment(bool missingPhases = false, bool extraStaff = false, bool completed = false)
        {
            DateTime dateTime = DateTime.Now.AddDays(1);
            OperationRequest operationRequest = DummyOperationRequest();
            SurgeryRoom room = DummySurgeryRoom(RoomCode1);
            Staff staff = DummyStaff();

            List<AppointmentPhase> phases = [];
            List<AppointmentPhaseStaff> phaseStaff = [];
            phaseStaff.Add(new AppointmentPhaseStaff(staff));
            if (extraStaff)
            {
                phaseStaff.Add(new AppointmentPhaseStaff(staff));
            }
            AppointmentPhase phase = new AppointmentPhase(phaseStaff);
            phases.Add(phase);
            if (missingPhases == false)
            {
                phases.Add(phase);
                phases.Add(phase);
            }

            Appointment appointment = new Appointment(dateTime, operationRequest, room, phases);
#pragma warning disable CS8602 // Dereference of a possibly null reference.
            typeof(Appointment).GetProperty("Id").SetValue(appointment, new AppointmentId(1));
#pragma warning restore CS8602 // Dereference of a possibly null reference.

            UpdatingAppointmentDto dto = new();
            dto.Id = appointmentId;
            dto.DateTime = dateTime;
            dto.Room = RoomCode1;

            dto.Phases = new List<AppointmentPhaseDto>();
            List<string> staffList = [];
            staffList.Add(staff.Id.AsString());
            if (extraStaff)
            {
                staffList.Add(staff.Id.AsString());
            }
            AppointmentPhaseDto phaseDto = new();
            phaseDto.Staff = staffList;
            dto.Phases.Add(phaseDto);
            if (missingPhases == false)
            {
                dto.Phases.Add(phaseDto);
                dto.Phases.Add(phaseDto);
            }

            if (completed)
                appointment.MarkAsCompleted();

            return new Tuple<Appointment, UpdatingAppointmentDto>(appointment, dto);
        }
    }
}