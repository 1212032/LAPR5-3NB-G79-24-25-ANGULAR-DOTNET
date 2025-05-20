using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using BackEnd.Domain.Shared;
using BackEnd.Domain.Specializations;
using Microsoft.EntityFrameworkCore;

namespace BackEnd.Domain.SurgeryRooms
{
    public class SurgeryRoomService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ISurgeryRoomRepository _surgeryRoomRepo;
        private readonly ISystemChangeLogRepository _changeLogRepo;
        private const string TABLE_NAME = "SurgeryRoom";

        public SurgeryRoomService(IUnitOfWork unitOfWork, ISurgeryRoomRepository surgeryRoomRepo, ISystemChangeLogRepository changeLogRepository)
        {
            this._unitOfWork = unitOfWork;
            this._surgeryRoomRepo = surgeryRoomRepo;
            this._changeLogRepo = changeLogRepository;
        }

        public async Task<SurgeryRoomDto> GetByCodeAsync(string code)
        {
            SurgeryRoom surgeryRoom = await this._surgeryRoomRepo.GetByCodeAsync(code);

            if (surgeryRoom == null)
                return null;

            return surgeryRoom.ToDto();
        }

        public async Task<List<SurgeryRoomDto>> GetAllAsync()
        {
            List<SurgeryRoom> list = await this._surgeryRoomRepo.GetAllAsync();

            List<SurgeryRoomDto> listDto = [];
            foreach (SurgeryRoom surgeryRoom in list)
            {
                listDto.Add(surgeryRoom.ToDto());
            }
            return listDto;
        }

        public async Task<List<SurgeryRoomDto>> GetAllAsyncWithFilters(string code, string name, string description, bool? forSurgery)
        {
            List<SurgeryRoom> list = await this._surgeryRoomRepo.GetAllAsyncWithFilters(code, name, description, forSurgery);
            List<SurgeryRoomDto> listDto = [];
            foreach (SurgeryRoom surgeryRoom in list)
            {
                listDto.Add(surgeryRoom.ToDto());
            }
            return listDto;
        }

        public async Task<SurgeryRoomDto> AddAsync(SurgeryRoomDto dto)
        {
            SurgeryRoom surgeryRoom = new SurgeryRoom(dto.Code, dto.Name, dto.Description, dto.ForSurgery);

            try
            {
                surgeryRoom = await this._surgeryRoomRepo.AddAsync(surgeryRoom);
                await this._unitOfWork.CommitAsync();

                string newValues = surgeryRoom.ToString();
                SystemChangeLog changeLog = new SystemChangeLog(surgeryRoom.Code, TABLE_NAME, null, newValues, "Admin", "Create");
                await _changeLogRepo.AddAsync(changeLog);

                await this._unitOfWork.CommitAsync();
            }
            catch (DbUpdateException ex)
            {
                if (ex.InnerException.Message.Contains("IX_SurgeryRoom_Code"))
                    throw new DbUpdateException("Room code already exists");
                throw;
            }

            return surgeryRoom.ToDto();
        }

        public async Task<SurgeryRoomDto> UpdateAsync(string code, SurgeryRoomDto dto)
        {
            SurgeryRoom surgeryRoom = await this._surgeryRoomRepo.GetByCodeAsync(code);

            if (surgeryRoom == null)
                return null;

            string oldValues = surgeryRoom.ToString();

            try
            {
                surgeryRoom.Update(dto.Code, dto.Name, dto.Description, dto.ForSurgery);

                string newValues = surgeryRoom.ToString();
                SystemChangeLog changeLog = new SystemChangeLog(surgeryRoom.Code, TABLE_NAME, oldValues, newValues, "Admin", "Edit");
                await _changeLogRepo.AddAsync(changeLog);

                await this._unitOfWork.CommitAsync();
            }
            catch (DbUpdateException ex)
            {
                if (ex.InnerException.Message.Contains("IX_SurgeryRoom_Code"))
                    throw new DbUpdateException("Room code already exists");
                throw;
            }

            return surgeryRoom.ToDto();
        }
    }
}