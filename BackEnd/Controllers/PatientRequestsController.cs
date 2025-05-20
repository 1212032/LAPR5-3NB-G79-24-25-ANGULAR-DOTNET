using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using System;
using Microsoft.AspNetCore.Authorization;
using BackEnd.Domain.Shared;
using BackEnd.Domain.PatientRequests;
using BackEnd.Domain.Patients;
using System.Collections.Generic;

namespace BackEnd.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PatientRequestsController : ControllerBase
    {
        private readonly PatientRequestService _service;
        private readonly IAuthzService _authz;

        public PatientRequestsController(PatientRequestService service, IAuthzService authz)
        {
            _service = service;
            _authz = authz;
        }

        // GET: api/PatientRequests/patient
        [HttpGet("patient")]
        [Authorize]
        public async Task<ActionResult<PatientDto>> Get()
        {
            return await _service.GetByEmailAsync(_authz.CurrentUserEmail());
        }

        // GET: api/PatientRequests/all
        [HttpGet("all")]
        [Authorize(Roles = Roles.Admin)]
        public async Task<ActionResult<IEnumerable<PatientRequestDto>>> GetAll()
        {
            return await _service.GetAllAsync();
        }

        // POST: api/PatientRequests
        [HttpPost]
        [Authorize]
        public async Task<ActionResult<PatientRequestDto>> Create(CreatePatientRequestDto dto)
        {
            try
            {
                return await _service.AddAsync(_authz.CurrentUserEmail(), dto);
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

        // Delete: api/PatientRequests/1
        [HttpDelete("{id}")]
        [Authorize(Roles = Roles.Admin)]
        public async Task<ActionResult<PatientRequestDto>> Delete(int id)
        {
            try
            {
                var patientRequestDto = await _service.DeleteAsync(id);
                if (patientRequestDto == null)
                    return NotFound();
                return Ok(patientRequestDto);
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

