using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using BackEnd.Domain.Shared;
using BackEnd.Domain.OperationTypes;
using Microsoft.AspNetCore.Authorization;
using System;
using Microsoft.EntityFrameworkCore;

namespace BackEnd.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OperationTypesController : ControllerBase
    {
        private readonly OperationTypeService _service;

        public OperationTypesController(OperationTypeService service)
        {
            _service = service;
        }

        // GET: api/OperationTypes/1
        [HttpGet("{id}")]
        [Authorize(Roles = Roles.Admin + "," + Roles.Doctor)]
        public async Task<ActionResult<OperationTypeDto>> GetById(int id)
        {
            var operationTypeDto = await _service.GetByIdAsync(id);

            if (operationTypeDto == null)
            {
                return NotFound();
            }

            return operationTypeDto;
        }

        // GET: api/OperationTypes
        // GET: api/OperationTypes?name=...&specialization=...
        [HttpGet]
        [Authorize(Roles = Roles.Admin + "," + Roles.Doctor)]
        public async Task<ActionResult<IEnumerable<OperationTypeDto>>> GetAllWithFilters(string name, int? specialization, bool? active)
        {
            try
            {
                return await _service.GetAllAsyncWithFilters(name, specialization, active);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = ex.Message });
            }
        }

        // POST: api/OperationTypes
        [HttpPost]
        [Authorize(Roles = Roles.Admin)]
        public async Task<ActionResult<OperationTypeDto>> Create(CreatingOperationTypeDto dto)
        {
            try
            {
                var operationTypeDto = await _service.AddAsync(dto);
                return operationTypeDto;
            }
            catch (Exception ex)
            {
                if (ex is BusinessRuleValidationException || ex is DbUpdateException)
                {
                    return BadRequest(new { Message = ex.Message + "\n" + ex.InnerException });
                }
                throw;
            }
        }


        // PUT: api/OperationTypes/1
        [HttpPut("{id}")]
        [Authorize(Roles = Roles.Admin)]
        public async Task<ActionResult<OperationTypeDto>> Update(int id, OperationTypeDto dto)
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
                throw;
            }
        }

        // Inactivate: api/OperationTypes/1
        [HttpDelete("{id}")]
        [Authorize(Roles = Roles.Admin)]
        public async Task<ActionResult<OperationTypeDto>> Inactivate(int id)
        {
            try
            {
                var operationTypeDto = await _service.InactivateAsync(id);

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
                throw;
            }
        }
    }
}