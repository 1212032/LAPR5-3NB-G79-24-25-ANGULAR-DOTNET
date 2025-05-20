using BackEnd.Domain.OperationTypes;
using BackEnd.Domain.Shared;
using BackEnd.Domain.Specializations;

namespace BackEnd.Tests
{
    public class OperationTypeServiceTest
    {
        private readonly Mock<IOperationTypeRepository> _mockOperationTypeRepo;
        private readonly Mock<ISpecializationRepository> _mockSpecializationRepo;
        private readonly Mock<IUnitOfWork> _mockUnitOfWork;
        private readonly OperationTypeService _service;

        public OperationTypeServiceTest()
        {
            _mockOperationTypeRepo = new Mock<IOperationTypeRepository>();
            _mockSpecializationRepo = new Mock<ISpecializationRepository>();
            _mockUnitOfWork = new Mock<IUnitOfWork>();
            _service = new OperationTypeService(_mockUnitOfWork.Object, _mockOperationTypeRepo.Object, _mockSpecializationRepo.Object);
        }
        [Fact]
        public async Task GetByIdAsync_ShouldReturnOperationType()
        {
            var dtoPhases = new List<OperationTypeDtoPhase>();
            OperationTypeDtoPhase dtoNewPhase = new();
            dtoNewPhase.Name = "Anesthesia/patient preparation";
            dtoNewPhase.Duration = 10;
            dtoNewPhase.Specializations = new Dictionary<int, int>
            {
                { 1, 1 }
            };
            dtoPhases.Add(dtoNewPhase);

            CreatingOperationTypeDto dto = new CreatingOperationTypeDto
            {
                Name = "Operation type name",
                Phases = dtoPhases
            };

            List<OperationTypePhase> phases = new();
            List<OperationTypePhaseSpecialization> specializations = new();
            Specialization specialization = await DummySpecialization();
            specializations.Add(new OperationTypePhaseSpecialization(specialization, 1));
            phases.Add(new OperationTypePhase("Anesthesia/patient preparation", 10, specializations));
            OperationType operationType = new OperationType(dto.Name, phases, 1);
#pragma warning disable CS8602 // Dereference of a possibly null reference.
            typeof(OperationType).GetProperty("Id").SetValue(operationType, new OperationTypeId(1));
#pragma warning restore CS8602 // Dereference of a possibly null reference.

            _mockOperationTypeRepo.Setup(repo => repo.GetByIdAsync(new OperationTypeId(1))).ReturnsAsync(operationType);
            var resultOperationRequest = await _service.GetByIdAsync(1);

            Assert.NotNull(resultOperationRequest);
            _mockOperationTypeRepo.Verify(repo => repo.GetByIdAsync(new OperationTypeId(1)), Times.Once); //Verifica se so retorna 1 value
            Assert.Equal(operationType.Name, resultOperationRequest.Name);
        }
        

        private async Task<OperationType> DummyOperationType()
        {
            List<OperationTypePhaseSpecialization> listOperationTypePhaseSpecialization = new List<OperationTypePhaseSpecialization>{
                new OperationTypePhaseSpecialization(new Specialization("12345", "Genecologist", "Specialization in gynecology and obstetrics."), 1)};

            OperationTypePhase phase = new OperationTypePhase("Anesthesia/patient preparation", 10, listOperationTypePhaseSpecialization);

            int operationTypeID = 1;
            OperationType operationType = new OperationType("Operation Type1", new List<OperationTypePhase> { phase }, 1);

#pragma warning disable CS8602 // Dereference of a possibly null reference.
            typeof(OperationType).GetProperty("Id").SetValue(operationType, new OperationTypeId(operationTypeID));
#pragma warning restore CS8602 // Dereference of a possibly null reference.

            _mockOperationTypeRepo.Setup(repo => repo.AddAsync(operationType)).ReturnsAsync(operationType);
            await _mockOperationTypeRepo.Object.AddAsync(operationType);

            // _mockOperationTypeRepo.Setup(repo => repo.GetByIdAsync(new OperationTypeId(operationTypeID))).ReturnsAsync(operationType);
            // await _mockOperationTypeRepo.Object.GetByIdAsync(new OperationTypeId(operationTypeID));

            return operationType;
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


    }
}