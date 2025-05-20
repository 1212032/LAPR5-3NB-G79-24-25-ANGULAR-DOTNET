using Microsoft.AspNetCore.Mvc;
using BackEnd.Services;
using BackEnd.Domain.Patients;
using System.Threading.Tasks;
using System.Collections.Generic;
using System;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using BackEnd.Domain.Shared;

namespace BackEnd.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PatientsController : ControllerBase
    {
        private readonly PatientService _service;
        private readonly IAuthzService _authz;

        public PatientsController(PatientService service, IAuthzService authz)
        {
            _service = service;
            _authz = authz;
        }

        // POST: api/patients
        [HttpPost]
        [Authorize(Roles = Roles.Admin)]
        public async Task<ActionResult<PatientDto>> Create(CreatePatientDto dto)
        {
            try
            {
                var patient = await _service.AddAsync(dto);
                return CreatedAtAction(nameof(GetById), new { id = patient.Id }, patient);
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

        // GET: api/patients/{id}
        [HttpGet("{id}")]
        [Authorize(Roles = Roles.Admin + "," + Roles.Doctor)]
        public async Task<ActionResult<PatientDto>> GetById(string id)
        {
            var patient = await _service.GetByIdAsync(new PatientMedicalRecordNumber(id));
            if (patient == null)
            {
                return NotFound();
            }
            return patient;
        }

        // GET: api/patients
        [HttpGet]
        [Authorize(Roles = Roles.Admin + "," + Roles.Doctor)]
        public async Task<ActionResult<IEnumerable<PatientDto>>> GetAll()
        {
            return await _service.GetAllAsync();
        }

        // GET: Search
        [HttpGet("search")]
        [Authorize(Roles = Roles.Admin + "," + Roles.Doctor)]
        public async Task<ActionResult<IEnumerable<PatientDto>>> SearchPatients(
            string name = null,
            string email = null,
            DateTime? dateOfBirth = null,
            string medicalRecordNumber = null,
            string medicalRecord = null,
            int pageNumber = 1,
            int pageSize = 10)
        {
            var result = await _service.SearchPatientsAsync(name, email, dateOfBirth, medicalRecordNumber, medicalRecord, pageNumber, pageSize);
            return Ok(result);
        }

        // PUT: api/Patients/1
        [HttpPut("{id}")]
        [Authorize(Roles = Roles.Admin)]
        public async Task<ActionResult<PatientDto>> Update(string id, PatientDto dto)
        {
            if (id != dto.Id)
            {
                return BadRequest(new { message = "The ID in the URL does not match the ID in the body." });
            }
            try
            {
                var updatedPatient = await _service.UpdateAsync(dto);
                if (updatedPatient == null)
                {
                    return NotFound(new { message = "Patient not found." });
                }
                return Ok(updatedPatient);
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

        //DELETE : api/patients/{id}

        [HttpDelete("{id}")]
        [Authorize(Roles = Roles.Admin)]
        public async Task<ActionResult> Delete(string id)
        {
            var patient = await _service.GetByIdAsync(new PatientMedicalRecordNumber(id));

            if (patient == null)
            {
                return NotFound(new { message = "Patient not found." });
            }
            string result;
            try
            {
                result = await _service.DeletePatientAsync(id);
            }
            catch (BusinessRuleValidationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            return Accepted(new { message = result });
        }
    }
}

