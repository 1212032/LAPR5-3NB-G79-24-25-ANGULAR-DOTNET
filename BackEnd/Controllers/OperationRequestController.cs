using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using BackEnd.Domain.Shared;
using BackEnd.Domain.OperationTypes;
using Microsoft.AspNetCore.Authorization;
using System;
using Microsoft.EntityFrameworkCore;
using BackEnd.Services;
using BackEnd.Domain.OperationRequests;

namespace BackEnd.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = Roles.Doctor)]
    public class OperationRequestsController : ControllerBase
    {
        private readonly OperationRequestService _service;

        public OperationRequestsController(OperationRequestService service)
        {
            _service = service;
        }

        // GET: api/OperationRequests/1
        [HttpGet("{id}")]
        public async Task<ActionResult<OperationRequestDto>> GetById(int id)
        {
            try
            {
                var operationRequestDto = await _service.GetByIdAsync(new OperationRequestId(id));

                if (operationRequestDto == null)
                {
                    return NotFound(new { Message = "Operation request not found." });
                }

                return operationRequestDto;
            }
            catch (Exception ex)
            {
                if (ex is UnauthorizedAccessException)
                    return Unauthorized(new { ex.Message });
                if (ex is BusinessRuleValidationException | ex is DbUpdateException)
                {
                    return BadRequest(new { ex.Message });
                }
                throw;
            }
        }

        // GET: api/OperationRequests
        [HttpGet]
        public async Task<ActionResult<IEnumerable<OperationRequestDto>>> GetAll()
        {
            try
            {
                return await _service.GetAllAsync();
            }
            catch (Exception ex)
            {
                if (ex is BusinessRuleValidationException | ex is DbUpdateException)
                {
                    return BadRequest(new { ex.Message });
                }
                throw;
            }
        }

        // GET: api/OperationRequests/filter?priority=""patientName=""...
        [HttpGet("filter")]
        public async Task<ActionResult<IEnumerable<OperationRequestDto>>> GetAllWithFilters(
            string priority = null,
            int? operationtype = -1,
            string patientName = null,
            string patientMedicalRecordNumber = null,
            DateTime? startDate = null,
            DateTime? endDate = null)
        {
            try
            {
                return await _service.GetAllAsyncWithFilters(priority, operationtype, patientName, patientMedicalRecordNumber, startDate, endDate);
            }
            catch (Exception ex)
            {
                if (ex is BusinessRuleValidationException | ex is DbUpdateException)
                {
                    return BadRequest(new { ex.Message });
                }
                if (ex is BusinessRuleNotFoundException)
                {
                    return StatusCode(404, new { ex.Message });
                }
                if (ex is BusinessRuleNotAllowedException)
                {
                    //Status Code: Not Allowed
                    return StatusCode(405, new { ex.Message });
                }
                throw;
            }
        }

        // POST: api/OperationRequests
        [HttpPost]
        public async Task<ActionResult<OperationRequestDto>> Create(CreatingOperationRequestDto dto)
        {
            try
            {
                var operationTypeDto = await _service.AddAsync(dto);
                return operationTypeDto;
            }
            catch (Exception ex)
            {
                if (ex is BusinessRuleValidationException)
                {
                    return BadRequest(new { ex.Message });
                }
                if (ex is DbUpdateException)
                {
                    return BadRequest(new { Message = "Operation Request already exists" });
                }
                if (ex is BusinessRuleNotFoundException)
                {
                    return StatusCode(404, new { ex.Message });
                }
                if (ex is BusinessRuleNotAllowedException)
                {
                    //Status Code: Not Allowed
                    return StatusCode(405, new { ex.Message });
                }
                throw;
            }
        }


        // PUT: api/OperationRequests/1
        [HttpPut("{id}")]
        public async Task<ActionResult<OperationRequestDto>> Update(int id, OperationRequestDto dto)
        {
            if (id != dto.Id)
            {
                return BadRequest();
            }

            try
            {
                var operationTypeDto = await _service.UpdateAsync(dto);

                if (operationTypeDto == null)
                {
                    return NotFound();
                }
                return Ok(operationTypeDto);
            }
            catch (Exception ex)
            {
                if (ex is BusinessRuleValidationException || ex is DbUpdateException)
                {
                    return BadRequest(new { Message = ex.Message + "\n" + ex.InnerException });
                }
                if (ex is BusinessRuleNotFoundException)
                {
                    return StatusCode(404, new { Message = ex.Message + "\n" + ex.InnerException });
                }
                if (ex is BusinessRuleNotAllowedException)
                {
                    //Status Code: Not Allowed
                    return StatusCode(405, new { Message = ex.Message + "\n" + ex.InnerException });
                }
                throw;
            }
        }


        // DELETE: api/OperationRequests/1
        [HttpDelete("{id}")]
        public async Task<ActionResult<OperationRequestDto>> Delete(int id)
        {
            try
            {
                var operationRequestDto = await _service.DeleteAsync(id);
                // catch exception for not authorized and // return Unauthorized();
                if (operationRequestDto == null)
                {
                    return NotFound();
                }

                return Ok(operationRequestDto);
            }
            catch (Exception ex)
            {
                if (ex is BusinessRuleValidationException || ex is DbUpdateException)
                {
                    return BadRequest(new { Message = ex.Message + "\n" + ex.InnerException });
                }
                if (ex is BusinessRuleNotFoundException)
                {
                    return StatusCode(404, new { Message = ex.Message + "\n" + ex.InnerException });
                }
                if (ex is BusinessRuleNotAllowedException)
                {
                    //Status Code: Not Allowed
                    return StatusCode(405, new { Message = ex.Message + "\n" + ex.InnerException });
                }
                throw;
            }
        }
    }
}