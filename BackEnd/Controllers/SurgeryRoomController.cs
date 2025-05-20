using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using System.Collections.Generic;
using BackEnd.Domain.Shared;
using Microsoft.EntityFrameworkCore;
using System;
using BackEnd.Domain.SurgeryRooms;

namespace BackEnd.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SurgeryRoomController : ControllerBase
    {
        private readonly SurgeryRoomService _service;

        public SurgeryRoomController(SurgeryRoomService service)
        {
            _service = service;
        }

        // GET: api/SurgeryRoom/ABC
        [HttpGet("{code}")]
        [Authorize(Roles = Roles.Admin)]
        public async Task<ActionResult<SurgeryRoomDto>> GetByCode(string code)
        {
            var dto = await _service.GetByCodeAsync(code);
            if (dto == null)
            {
                return NotFound();
            }
            return dto;
        }

        // GET: api/SurgeryRoom
        // GET: api/SurgeryRoom?name=...&description=...
        [HttpGet]
        [Authorize(Roles = Roles.Admin + "," + Roles.Doctor)]
        public async Task<ActionResult<IEnumerable<SurgeryRoomDto>>> GetAllWithFilters(string code, string name, string description, bool? forSurgery)
        {
            try
            {
                return await _service.GetAllAsyncWithFilters(code, name, description, forSurgery);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = ex.Message });
            }
        }

        // POST: api/SurgeryRoom
        [HttpPost]
        [Authorize(Roles = Roles.Admin)]
        public async Task<ActionResult<SurgeryRoomDto>> Create(SurgeryRoomDto creatingDto)
        {
            try
            {
                var dto = await _service.AddAsync(creatingDto);
                return dto;
            }
            catch (Exception ex)
            {
                if (ex is BusinessRuleValidationException || ex is DbUpdateException)
                {
                    return BadRequest(new { Message = ex.Message });
                }
                throw;
            }
        }

        // PUT: api/SurgeryRoom/ABC
        [HttpPut("{code}")]
        [Authorize(Roles = Roles.Admin)]
        public async Task<ActionResult<SurgeryRoomDto>> Update(string code, SurgeryRoomDto dto)
        {
            try
            {
                var updatedDto = await _service.UpdateAsync(code, dto);

                if (updatedDto == null)
                {
                    return NotFound();
                }
                return Ok(updatedDto);
            }
            catch (Exception ex)
            {
                if (ex is BusinessRuleValidationException || ex is DbUpdateException)
                {
                    return BadRequest(new { Message = ex.Message });
                }
                throw;
            }
        }
    }
}