using LaredBookingCore.Models.Dto;
using LaredBookingCore.Repository.IRepository;
using Mapster;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LaredBookingCore.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PagoController : ControllerBase
    {
        private readonly IPagoRepository _pagoRepo;

        public PagoController(IPagoRepository pagoRepo)
        {
            _pagoRepo = pagoRepo;
        }

        /// CLIENTE: Registrar pago de su reserva
        [HttpPost]
        [Authorize(Roles = "cliente")]
        public async Task<IActionResult> RegistrarPago([FromBody] PagoDto dto)
        {
            if (dto == null) 
                return BadRequest("Los datos del pago no pueden ser nulos.");

            if (dto.IdReserva <= 0) 
                return BadRequest("El ID de la reserva no es válido.");

            var pago = await _pagoRepo.RegistrarPagoAsync(dto.IdReserva, dto);

            // Puedes devolver 201 Created si quieres, pero mantengo Ok para no romper el flujo
            return Ok(pago.Adapt<PagoDto>());
        }

        /// ADMIN: Ver pagos de una reserva
        [HttpGet("reserva/{idReserva}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> GetPagosPorReserva(int idReserva)
        {
            if (idReserva <= 0) 
                return BadRequest("El ID de la reserva no es válido.");

            var pagos = await _pagoRepo.GetPagosPorReservaAsync(idReserva);

            return Ok(pagos.Adapt<IEnumerable<PagoDto>>());
        }
    }
}
