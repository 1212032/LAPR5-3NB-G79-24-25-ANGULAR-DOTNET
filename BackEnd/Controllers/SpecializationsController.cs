using Microsoft.AspNetCore.Mvc;
using BackEnd.Services;
using System.Threading.Tasks;
using System.Collections.Generic;
using System;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using BackEnd.Domain.Specializations;
using BackEnd.Domain.Shared;

namespace BackEnd.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SpecializationsController : ControllerBase
    {
        private readonly SpecializationService _service;
        private readonly IAuthzService _authz;

        public SpecializationsController(SpecializationService service, IAuthzService authz)
        {
            _service = service;
            _authz = authz;
        }

        // POST: api/specializations
        [HttpPost]
        [Authorize(Roles = Roles.Admin)]
        public async Task<ActionResult<SpecializationDto>> Create(CreateSpecializationDto dto)
        {
            try
            {
                var spec = await _service.AddAsync(dto);
                return CreatedAtAction(nameof(GetById), new { id = spec.Id }, spec);
            }
            catch (DbUpdateException ex)
            {
                if (ex.InnerException != null && ex.InnerException.Message.Contains("Duplicate entry"))
                {
                    return BadRequest(new { message = "Specialization already exists." });
                }
                return BadRequest(new { message = ex.Message, details = ex.InnerException?.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An unexpected error occurred.", details = ex.Message });
            }
        }

        // GET: api/specializations/{id}
        [HttpGet("{id}")]
        [Authorize(Roles = Roles.Admin)]
        public async Task<ActionResult<SpecializationDto>> GetById(int id)
        {
            var spec = await _service.GetByIdAsync(id);
            if (spec == null)
            {
                return NotFound(new { message = "Specialization not found." });
            }
            return spec;
        }

        // GET: api/specializations
        [HttpGet]
        [Authorize(Roles = Roles.Admin)]
        public async Task<ActionResult<IEnumerable<SpecializationDto>>> GetAll()
        {
            return await _service.GetAllAsync();
        }

        // GET: api/specializations/search
        [HttpGet("search")]
        [Authorize(Roles = Roles.Admin)]
        public async Task<ActionResult<IEnumerable<SpecializationDto>>> Search([FromQuery] string code, [FromQuery] string name, [FromQuery] string description)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(code) && string.IsNullOrWhiteSpace(name) && string.IsNullOrWhiteSpace(description))
                {
                    return BadRequest(new { message = "At least one search parameter is required." });
                }

                var results = await _service.SearchAsync(code, name, description);
                return Ok(results);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while searching.", details = ex.Message });
            }
        }

        // DELETE: api/specializations/{id}
        [HttpDelete("{id}")]
        [Authorize(Roles = Roles.Admin)]
        public async Task<ActionResult> Delete(int id)
        {
            var spec = await _service.GetByIdAsync(id);

            if (spec == null)
            {
                return NotFound(new { message = "Specialization not found." });
            }
            await _service.DeleteSpecializationAsync(id);
            return Accepted(new { message = "Specialization deleted successfully." });
        }

        // PUT: api/specializations/{id}
        [HttpPut("{id}")]
        [Authorize(Roles = Roles.Admin)]
        public async Task<ActionResult<SpecializationDto>> Update(int id, SpecializationDto dto)
        {
            try
            {
                if (id != dto.Id)
                {
                    return BadRequest(new { message = "The ID in the route does not match the ID in the request body." });
                }

                var existingSpec = await _service.GetByIdAsync(id);
                if (existingSpec == null)
                {
                    return NotFound(new { message = "Specialization not found." });
                }

                var updatedSpec = await _service.UpdateAsync(dto);
                return Ok(updatedSpec);
            }
            catch (DbUpdateException ex)
            {
                if (ex.InnerException != null && ex.InnerException.Message.Contains("Duplicate entry"))
                {
                    return BadRequest(new { message = "Specialization with the same code already exists." });
                }
                return BadRequest(new { message = ex.Message, details = ex.InnerException?.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An unexpected error occurred.", details = ex.Message });
            }
        }

    }
}
