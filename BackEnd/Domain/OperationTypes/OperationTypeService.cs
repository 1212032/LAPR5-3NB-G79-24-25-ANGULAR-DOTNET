using System.Threading.Tasks;
using BackEnd.Domain.Shared;
using System.Collections.Generic;
using BackEnd.Domain.Specializations;

namespace BackEnd.Domain.OperationTypes
{
    public class OperationTypeService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IOperationTypeRepository _operationTypeRepo;
        private readonly ISpecializationRepository _specializationRepo;
        private int OperationTypeVersion = 0;

        public OperationTypeService(IUnitOfWork unitOfWork, IOperationTypeRepository operationTypeRepo, ISpecializationRepository specializationRepo)
        {
            this._unitOfWork = unitOfWork;
            this._operationTypeRepo = operationTypeRepo;
            this._specializationRepo = specializationRepo;
        }

        public async Task<OperationTypeDto> GetByIdAsync(int id)
        {
            var operationType = await this._operationTypeRepo.GetByIdAsync(new OperationTypeId(id));

            if (operationType == null)
                return null;

            return operationType.ToDto();
        }

        public async Task<List<OperationTypeDto>> GetAllAsync()
        {
            List<OperationType> list = await this._operationTypeRepo.GetAllAsync();

            List<OperationTypeDto> listDto = new();
            foreach (OperationType operationType in list)
            {
                listDto.Add(operationType.ToDto());
            }
            return listDto;
        }

        public async Task<List<OperationTypeDto>> GetAllAsyncWithFilters(string name, int? specialization, bool? active)
        {
            List<OperationType> list = await this._operationTypeRepo.GetAllAsyncWithFilters(name, specialization, active);
            List<OperationTypeDto> listDto = [];
            foreach (OperationType operationType in list)
            {
                listDto.Add(operationType.ToDto());
            }
            return listDto;
        }

        public async Task<OperationTypeDto> AddAsync(CreatingOperationTypeDto dto)
        {
            List<OperationTypePhase> phases = new();
            if (dto.Phases == null || dto.Phases.Count < 3) throw new BusinessRuleValidationException("Operation type is missing phases.");

            foreach (OperationTypeDtoPhase dtoPhase in dto.Phases)
            {
                List<OperationTypePhaseSpecialization> specializations = new();
                if (dtoPhase.Specializations == null) throw new BusinessRuleValidationException(dtoPhase.Name + " phase missing specializations.");

                foreach (KeyValuePair<int, int> specializationDto in dtoPhase.Specializations)
                {
                    Specialization specialization = await _specializationRepo.GetByIdAsync(new SpecializationId(specializationDto.Key));
                    if (specialization == null) throw new BusinessRuleValidationException("Specialization " + specializationDto.Key + " does not exist.");

                    specializations.Add(new OperationTypePhaseSpecialization(specialization, specializationDto.Value));
                }
                phases.Add(new OperationTypePhase(dtoPhase.Name, dtoPhase.Duration, specializations));
            }
            OperationTypeVersion++;
            OperationType operationType = new OperationType(dto.Name, phases, OperationTypeVersion);

            await this._operationTypeRepo.AddAsync(operationType);

            await this._unitOfWork.CommitAsync();

            return operationType.ToDto();
        }

        public async Task<OperationTypeDto> UpdateAsync(OperationTypeDto dto)
        {
            OperationType operationType = await this._operationTypeRepo.GetByIdAsync(new OperationTypeId(dto.Id));

            if (operationType == null)
                return null;

            operationType.Inactivate();
            //await this._unitOfWork.CommitAsync();

            OperationTypeVersion = this._operationTypeRepo.GetMaxVersionByName(operationType.Name);
            return await AddAsync(dto);
        }

        public async Task<OperationTypeDto> InactivateAsync(int id)
        {
            OperationType operationType = await this._operationTypeRepo.GetByIdAsync(new OperationTypeId(id));

            if (operationType == null)
                return null;

            operationType.Inactivate();
            await this._unitOfWork.CommitAsync();

            return operationType.ToDto();
        }
    }
}