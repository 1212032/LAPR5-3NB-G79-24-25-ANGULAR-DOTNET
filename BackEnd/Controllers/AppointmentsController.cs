using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using System;
using Microsoft.AspNetCore.Authorization;
using BackEnd.Domain.Shared;
using BackEnd.Domain.Appointments;
using System.Collections.Generic;

namespace BackEnd.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AppointmentsController : ControllerBase
    {
        private readonly AppointmentService _service;

        public AppointmentsController(AppointmentService service)
        {
            _service = service;
        }

        // GET: api/appointments
        // GET: api/appointments?patientName=...&room=...
        [HttpGet]
        [Authorize(Roles = Roles.Doctor)]
        public async Task<ActionResult<List<AppointmentDto>>> GetAll(string patientName, string patientMedicalRecordNumber,
        string room, string priority, DateTime? startDate, DateTime? endDate, string staff)
        {
            try
            {
                return await _service.GetAllAsync(patientName, patientMedicalRecordNumber, room, priority, startDate, endDate, staff);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        // POST: api/appointments
        [HttpPost]
        [Authorize(Roles = Roles.Doctor)]
        public async Task<ActionResult<AppointmentDto>> Create(CreatingAppointmentDto dto)
        {
            try
            {
                return await _service.AddAsync(dto);
            }
            catch (BusinessRuleValidationException ex)
            {
                return StatusCode(400, new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        // GET: api/appointments/1
        [HttpGet("{id}")]
        [Authorize(Roles = Roles.Doctor)]
        public async Task<ActionResult<AppointmentDto>> GetById(int id)
        {
            AppointmentDto dto = await _service.GetByIdAsync(id);
            if (dto == null)
                return NotFound();
            return dto;
        }

        // PUT: api/appointments/1
        [HttpPut("{id}")]
        [Authorize(Roles = Roles.Doctor)]
        public async Task<ActionResult<AppointmentDto>> Update(int id, UpdatingAppointmentDto dto)
        {
            if (id != dto.Id)
                return BadRequest();
            try
            {
                AppointmentDto updatedDto = await _service.UpdateAsync(dto);
                if (updatedDto == null)
                    return NotFound();
                return Ok(updatedDto);
            }
            catch (BusinessRuleValidationException ex)
            {
                return StatusCode(400, new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }
    }
}

