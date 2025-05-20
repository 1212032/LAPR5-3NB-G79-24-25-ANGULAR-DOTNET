using BackEnd.Domain.Shared;
using BackEnd.Domain.Specializations;
// using MockQueryable.Moq;
using BackEnd.Services;

namespace BackEnd.Tests.Services
{
    public class SpecializationServiceTests
    {
        private readonly Mock<ISpecializationRepository> _repoMock;
        private readonly Mock<IUnitOfWork> _unitOfWorkMock;
        private readonly SpecializationService _service;

        public SpecializationServiceTests()
        {
            _repoMock = new Mock<ISpecializationRepository>();
            _unitOfWorkMock = new Mock<IUnitOfWork>();
            _service = new SpecializationService(_repoMock.Object, _unitOfWorkMock.Object);
        }

        [Fact]
        public async Task AddAsync_ShouldAddSpecialization_WhenValidData()
        {
            var dto = new CreateSpecializationDto { Code = "ABC", Name = "Test", Description = "Description" };
            var specialization = new Specialization("ABC", "Test", "Description");

            _repoMock.Setup(r => r.ExistsAsync(dto.Code)).ReturnsAsync(false);
            _repoMock.Setup(r => r.AddAsync(It.IsAny<Specialization>())).ReturnsAsync(specialization);

            var result = await _service.AddAsync(dto);

            Assert.NotNull(result);
            Assert.Equal("ABC", result.Code);
            Assert.Equal("Test", result.Name);
            Assert.Equal("Description", result.Description);
        }

        [Fact]
        public async Task DeleteSpecializationAsync_ShouldDeleteSpecialization_WhenFound()
        {
            var specialization = new Specialization("ABC", "Test", "Description");
            _repoMock.Setup(r => r.GetByIdAsync(new SpecializationId(1))).ReturnsAsync(specialization);

            var result = await _service.DeleteSpecializationAsync(1);

            Assert.NotNull(result);
            Assert.Equal("ABC", result.Code);
        }

        // [Fact]
        // public async Task SearchAsync_ShouldReturnFilteredSpecializations()
        // {
        //     var specializations = new List<Specialization>
        //     {
        //         new Specialization("ABC", "Test1", "Description1"),
        //         new Specialization("DEF", "Test2", "Description2"),
        //     }.AsQueryable().BuildMock();

        //     _repoMock.Setup(r => r.Query()).Returns(specializations.Object);

        //     var result = await _service.SearchAsync("ABC", null, null);

        //     Assert.Single(result);
        //     Assert.Equal("ABC", result.First().Code);
        // }
    }
}
