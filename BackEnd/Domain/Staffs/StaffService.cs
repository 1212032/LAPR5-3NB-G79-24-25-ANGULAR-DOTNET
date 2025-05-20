using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using BackEnd.Domain.Shared;
using BackEnd.Domain.Specializations;
using Microsoft.EntityFrameworkCore;

namespace BackEnd.Domain.Staffs
{
    public class StaffService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IStaffRepository _staffRepo;
        private readonly ISpecializationRepository _specializationRepo;
        private readonly ISystemChangeLogRepository _changeLogRepo;
        private const string TABLE_NAME = "Staff";

        public StaffService(IUnitOfWork unitOfWork, IStaffRepository staffRepo, ISpecializationRepository specializationRepo, ISystemChangeLogRepository changeLogRepository)
        {
            this._unitOfWork = unitOfWork;
            this._staffRepo = staffRepo;
            this._specializationRepo = specializationRepo;
            this._changeLogRepo = changeLogRepository;
        }

        public async Task<StaffDto> GetByIdAsync(string id)
        {
            var staff = await this._staffRepo.GetByIdAsync(new StaffId(id));

            if (staff == null)
                return null;

            return staff.ToDto();
        }
        public async Task<List<StaffDto>> GetAllAsync()
        {
            List<Staff> list = await this._staffRepo.GetAllAsync();

            List<StaffDto> listDto = [];
            foreach (Staff staff in list)
            {
                listDto.Add(staff.ToDto());
            }

            return listDto;
        }

        public async Task<List<StaffDto>> GetAllAsyncWithFilters(string name, string phone,
        string email, string licenseNumber, int? specialization, string role, bool? active)
        {
            List<Staff> list = await this._staffRepo.GetAllAsyncWithFilters(name, phone, email, licenseNumber, specialization, role, active);
            List<StaffDto> listDto = [];
            foreach (Staff staff in list)
            {
                listDto.Add(staff.ToDto());
            }
            return listDto;
        }

        public async Task<StaffDto> AddAsync(CreatingStaffDto dto)
        {
            Staff staff;
            try
            {
                List<DateTimeTuple> availabilitySlots = new();
                foreach (Tuple<DateTime, DateTime> tuple in dto.AvailabilitySlots)
                {
                    availabilitySlots.Add(new DateTimeTuple(tuple.Item1, tuple.Item2));
                }
                Specialization specialization = await _specializationRepo.GetByIdAsync(new SpecializationId(dto.Specialization));
                if (specialization == null)
                {
                    throw new BusinessRuleValidationException("The specialization " + dto.Specialization.ToString() + " does not exist.");
                }
                staff = new Staff(dto.LicenseNumber, dto.Email, dto.Phone, dto.FirstName, dto.LastName, dto.Role, availabilitySlots, specialization);

                staff = await this._staffRepo.AddAsync(staff);
                await this._unitOfWork.CommitAsync();

                staff.AddPrefix();

                string newValues = staff.ToString();
                SystemChangeLog changeLog = new SystemChangeLog(staff.Id.AsString(), TABLE_NAME, null, newValues, "Admin", "Create");
                await _changeLogRepo.AddAsync(changeLog);

                await this._unitOfWork.CommitAsync();
            }
            catch (DbUpdateException ex)
            {
                if (ex.InnerException.Message.Contains("IX_Staff_Email"))
                    throw new DbUpdateException("Staff email already exists");
                if (ex.InnerException.Message.Contains("IX_Staff_LicenseNumber"))
                    throw new DbUpdateException("Staff license number already exists");
                if (ex.InnerException.Message.Contains("IX_Staff_Phone"))
                    throw new DbUpdateException("Staff phone already exists");
                throw;
            }
            return staff.ToDto();
        }

        public async Task<StaffDto> UpdateAsync(UpdateStaffDto dto)
        {
            Staff staff;
            try
            {
                staff = await this._staffRepo.GetByIdAsync(new StaffId(dto.Id));

                if (staff == null)
                    return null;

                string oldValues = staff.ToString();

                List<DateTimeTuple> availabilitySlots = new();
                foreach (Tuple<DateTime, DateTime> tuple in dto.AvailabilitySlots)
                {
                    availabilitySlots.Add(new DateTimeTuple(tuple.Item1, tuple.Item2));
                }
                staff.Update(dto.Email, dto.Phone, dto.FirstName, dto.LastName, availabilitySlots);

                string newValues = staff.ToString();
                SystemChangeLog changeLog = new SystemChangeLog(staff.Id.AsString(), TABLE_NAME, oldValues, newValues, "Admin", "Edit");
                await _changeLogRepo.AddAsync(changeLog);

                await this._unitOfWork.CommitAsync();
            }
            catch (DbUpdateException ex)
            {
                if (ex.InnerException.Message.Contains("IX_Staff_Email"))
                    throw new DbUpdateException("Staff email already exists");
                if (ex.InnerException.Message.Contains("IX_Staff_LicenseNumber"))
                    throw new DbUpdateException("Staff license number already exists");
                if (ex.InnerException.Message.Contains("IX_Staff_Phone"))
                    throw new DbUpdateException("Staff phone already exists");
                throw;
            }
            return staff.ToDto();
        }

        public async Task<StaffDto> InactivateAsync(string id)
        {
            Staff staff = await this._staffRepo.GetByIdAsync(new StaffId(id));

            if (staff == null)
                return null;

            string oldValues = staff.ToString();

            staff.Inactivate();

            SystemChangeLog changeLog = new SystemChangeLog(staff.Id.AsString(), TABLE_NAME, oldValues, null, "Admin", "Delete");
            await _changeLogRepo.AddAsync(changeLog);
            await this._unitOfWork.CommitAsync();

            return staff.ToDto();
        }
    }
}