using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using BackEnd.Domain.Staffs;
using Microsoft.AspNetCore.Authorization;
using System.Collections.Generic;
using BackEnd.Domain.Shared;
using Microsoft.EntityFrameworkCore;
using System;

namespace BackEnd.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StaffController : ControllerBase
    {
        private readonly StaffService _service;

        public StaffController(StaffService service)
        {
            _service = service;
        }

        // GET: api/Staff/1
        [HttpGet("{id}")]
        [Authorize(Roles = Roles.Admin)]
        public async Task<ActionResult<StaffDto>> GetById(string id)
        {
            var dto = await _service.GetByIdAsync(id);
            if (dto == null)
            {
                return NotFound();
            }
            return dto;
        }

        // GET: api/Staff
        // GET: api/Staff?name=...&phone=...
        [HttpGet]
        [Authorize(Roles = Roles.Admin + "," + Roles.Doctor)]
        public async Task<ActionResult<IEnumerable<StaffDto>>> GetAllWithFilters(string name, string phone,
        string email, string licenseNumber, int? specialization, string role, bool? active)
        {
            try
            {
                return await _service.GetAllAsyncWithFilters(name, phone, email, licenseNumber, specialization, role, active);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = ex.Message });
            }
        }

        // POST: api/Staff
        [HttpPost]
        [Authorize(Roles = Roles.Admin)]
        public async Task<ActionResult<StaffDto>> Create(CreatingStaffDto creatingDto)
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

        // PUT: api/Staff/1
        [HttpPut("{id}")]
        [Authorize(Roles = Roles.Admin)]
        public async Task<ActionResult<StaffDto>> Update(string id, StaffDto dto)
        {
            if (id != dto.Id)
            {
                return BadRequest();
            }
            try
            {
                var updatedDto = await _service.UpdateAsync(dto);

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

        // Inactivate: api/Staff/1
        [HttpDelete("{id}")]
        [Authorize(Roles = Roles.Admin)]
        public async Task<ActionResult<StaffDto>> Inactivate(string id)
        {
            var dto = await _service.InactivateAsync(id);
            if (dto == null)
            {
                return NotFound();
            }
            return Ok(dto);
        }
    }
}