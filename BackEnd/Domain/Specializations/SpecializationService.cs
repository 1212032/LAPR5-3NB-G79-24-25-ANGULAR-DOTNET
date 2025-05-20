using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BackEnd.Domain.Shared;
using BackEnd.Domain.Specializations;
using Microsoft.EntityFrameworkCore;

namespace BackEnd.Services
{
    public class SpecializationService
    {
        private readonly ISpecializationRepository _repo;
        private readonly IUnitOfWork _unitOfWork;

        public SpecializationService(ISpecializationRepository repo, IUnitOfWork unitOfWork)
        {
            _repo = repo;
            _unitOfWork = unitOfWork;
        }

        public async Task<SpecializationDto> AddAsync(CreateSpecializationDto dto)
        {
            if (dto == null)
                throw new BusinessRuleValidationException("Specialization data cannot be null.");
            if (string.IsNullOrWhiteSpace(dto.Code))
                throw new BusinessRuleValidationException("Code is required.");
            if (string.IsNullOrWhiteSpace(dto.Name))
                throw new BusinessRuleValidationException("Name is required.");

            if (await _repo.ExistsAsync(dto.Code))
                throw new BusinessRuleValidationException("Specialization code must be unique.");

            var specialization = new Specialization(dto.Code, dto.Name, dto.Description);
            specialization = await _repo.AddAsync(specialization);
            await _unitOfWork.CommitAsync();
            return specialization.ToDto();
        }

        public async Task<SpecializationDto> GetByIdAsync(int id)
        {
            var specialization = await _repo.GetByIdAsync(new SpecializationId(id));
            if (specialization == null)
                throw new BusinessRuleValidationException("Specialization not found.");

            return specialization.ToDto();
        }

        public async Task<List<SpecializationDto>> GetAllAsync()
        {
            var specializations = await _repo.GetAllAsync();
            return specializations.Select(s => s.ToDto()).ToList();
        }

        public async Task<SpecializationDto> DeleteSpecializationAsync(int id)
        {
            var specialization = await _repo.GetByIdAsync(new SpecializationId(id));
            if (specialization == null)
                throw new BusinessRuleValidationException("Specialization not found.");

            _repo.Remove(specialization);
            await _unitOfWork.CommitAsync();
            return specialization.ToDto();
        }

        public async Task<List<SpecializationDto>> SearchAsync(string code, string name, string description)
        {
            var query = _repo.Query();

            if (!string.IsNullOrWhiteSpace(code))
            {
                query = query.Where(s => s.Code.Contains(code));
            }

            if (!string.IsNullOrWhiteSpace(name))
            {
                query = query.Where(s => s.Name.Contains(name));
            }

            if (!string.IsNullOrWhiteSpace(description))
            {
                query = query.Where(s => s.Description.Contains(description));
            }

            var results = await query.ToListAsync();
            return results.Select(s => s.ToDto()).ToList();
        }

public async Task<SpecializationDto> UpdateAsync(SpecializationDto dto)
{
    var specialization = await _repo.GetByIdAsync(new SpecializationId(dto.Id));
    if (specialization == null)
    {
        throw new KeyNotFoundException("Specialization not found.");
    }
    var exists = await _repo.ExistsAsync(dto.Code);
    if (exists && specialization.Code != dto.Code)
    {
        throw new BusinessRuleValidationException("Specialization with the same code already exists.");
    }

    specialization.Update(dto.Code, dto.Name, dto.Description);

    await _unitOfWork.CommitAsync();

    return specialization.ToDto();
}



    }
}
