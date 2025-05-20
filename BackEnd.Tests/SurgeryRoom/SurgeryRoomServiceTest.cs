using BackEnd.Domain.SurgeryRooms;
using BackEnd.Domain.Shared;

namespace BackEnd.Tests
{
    public class SurgeryRoomServiceTest
    {
        private readonly Mock<IUnitOfWork> _mockUnitOfWork;
        private readonly Mock<ISurgeryRoomRepository> _mockSurgeryRoomRepo;
        private readonly Mock<ISystemChangeLogRepository> _mockChangeLogRepo;
        private readonly SurgeryRoomService _service;

        public SurgeryRoomServiceTest()
        {
            _mockSurgeryRoomRepo = new Mock<ISurgeryRoomRepository>();
            _mockUnitOfWork = new Mock<IUnitOfWork>();
            _mockChangeLogRepo = new Mock<ISystemChangeLogRepository>();
            _service = new SurgeryRoomService(_mockUnitOfWork.Object, _mockSurgeryRoomRepo.Object, _mockChangeLogRepo.Object);
        }

        [Fact]
        public async Task AddAsync_ShouldAddSurgeryROom()
        {
            SurgeryRoom surgeryRoom = new SurgeryRoom("ABC-1234", "Room name", "Room description", true);
            _mockSurgeryRoomRepo.Setup(repo => repo.AddAsync(It.IsAny<SurgeryRoom>())).ReturnsAsync(surgeryRoom);

            SurgeryRoomDto dto = new();
            dto.Code = "ABC-1234";
            dto.Name = "Room name";
            dto.Description = "Room description";
            dto.ForSurgery = true;
            SurgeryRoomDto result = await _service.AddAsync(dto);

            Assert.NotNull(result);
            _mockSurgeryRoomRepo.Verify(repo => repo.AddAsync(It.IsAny<SurgeryRoom>()), Times.Once);
            Assert.Equal(surgeryRoom.Code, result.Code);
            Assert.Equal(surgeryRoom.Name, result.Name);
            Assert.Equal(surgeryRoom.Description, result.Description);
            Assert.Equal(surgeryRoom.ForSurgery, result.ForSurgery);
        }

        [Fact]
        public async Task GetByIdAsync_ShouldReturnStaff()
        {
            // add surgery room
            SurgeryRoom surgeryRoom = new SurgeryRoom("ABC-1234", "Room name", "Room description", true);
            _mockSurgeryRoomRepo.Setup(repo => repo.AddAsync(It.IsAny<SurgeryRoom>())).ReturnsAsync(surgeryRoom);

            SurgeryRoomDto dto = new();
            dto.Code = "ABC-1234";
            dto.Name = "Room name 1";
            dto.Description = "Room description 1";
            dto.ForSurgery = true;
            await _service.AddAsync(dto);

            // get surgery room
            _mockSurgeryRoomRepo.Setup(repo => repo.GetByCodeAsync(surgeryRoom.Code)).ReturnsAsync(surgeryRoom);
            SurgeryRoomDto result = await _service.GetByCodeAsync(surgeryRoom.Code);

            Assert.Equal(surgeryRoom.Code, result.Code);
            Assert.Equal(surgeryRoom.Name, result.Name);
            Assert.Equal(surgeryRoom.Description, result.Description);
            Assert.Equal(surgeryRoom.ForSurgery, result.ForSurgery);
        }

        [Fact]
        public async Task UpdateAsync_ShouldUpdateSurgeryRoom()
        {
            // add surgery room
            SurgeryRoom surgeryRoom = new SurgeryRoom("ABC-1234", "Room name", "Room description", true);
            _mockSurgeryRoomRepo.Setup(repo => repo.AddAsync(It.IsAny<SurgeryRoom>())).ReturnsAsync(surgeryRoom);

            SurgeryRoomDto dto = new();
            dto.Code = "ABC-1234";
            dto.Name = "Room name 1";
            dto.Description = "Room description 1";
            dto.ForSurgery = true;
            await _service.AddAsync(dto);

            // update surgery room
            string updatedCode = "ABC-5678";
            string updatedName = "Room name 2";
            string updatedDescription = "Room description 2";
            bool updatedForSurgery = false;
            surgeryRoom.Update(updatedCode, updatedName, updatedDescription, updatedForSurgery);

            _mockSurgeryRoomRepo.Setup(repo => repo.GetByCodeAsync(surgeryRoom.Code)).ReturnsAsync(surgeryRoom);
            SurgeryRoomDto result = await _service.GetByCodeAsync(surgeryRoom.Code);

            Assert.NotNull(result);
            Assert.Equal(updatedCode, result.Code);
            Assert.Equal(updatedName, result.Name);
            Assert.Equal(updatedDescription, result.Description);
            Assert.Equal(updatedForSurgery, result.ForSurgery);
        }
    }
}