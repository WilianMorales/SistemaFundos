using LaredBookingCore.Models.Dto;
using LaredBookingCore.Repository.IRepository;
using Mapster;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace LaredBookingCore.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReservaController : ControllerBase
    {
        private readonly IReservaRepository _reservaRepo;

        public ReservaController(IReservaRepository reservaRepo)
        {
            _reservaRepo = reservaRepo;
        }

        /// ADMIN: Ver todas las reservas
        [HttpGet]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> GetAll()
        {
            var reservas = await _reservaRepo.GetAllAsync();
            return Ok(reservas.Adapt<IEnumerable<ReservaResponseDto>>());
        }

        /// CLIENTE o ADMIN: Ver reservas por usuario
        [HttpGet("usuario/{idUsuario}")]
        [Authorize(Roles = "cliente,admin")]
        public async Task<IActionResult> GetByUsuario(int idUsuario)
        {
            if (idUsuario <= 0) return BadRequest("ID de usuario inválido.");

            var reservas = await _reservaRepo.GetByUsuarioAsync(idUsuario);
            return Ok(reservas.Adapt<IEnumerable<ReservaResponseDto>>());
        }

        /// CLIENTE: Crear una nueva reserva
        [HttpPost]
        [Authorize(Roles = "cliente")]
        public async Task<IActionResult> Create([FromBody] CreateReservaDto dto)
        {
            if (dto == null) return BadRequest("Datos incompletos para la reserva.");

            var reserva = await _reservaRepo.CrearReservaAsync(dto);

            // Mapear manualmente o con Mapster
            var response = new ReservaResponseDto
            {
                IdReserva = reserva.IdReserva,
                FechaReserva = reserva.FechaReserva,
                FechaInicio = reserva.FechaInicio,
                FechaFin = reserva.FechaFin,
                Estado = reserva.Estado,
                MontoTotal = reserva.MontoTotal,
                UsuarioNombre = reserva.Usuario.Nombre,
                FundoNombre = reserva.Fundo.Nombre,
                Pagos = reserva.Pagos.Adapt<IEnumerable<PagoDto>>()
            };

            return CreatedAtAction(nameof(GetByUsuario), new { idUsuario = dto.IdUsuario }, response);
        }

        /// ADMIN: Confirmar una reserva
        [HttpPatch("{id}/confirmar")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> Confirmar(int id)
        {
            if (id <= 0) return BadRequest("ID inválido.");

            await _reservaRepo.ConfirmarReservaAsync(id);
            return NoContent();
        }

        /// CLIENTE o ADMIN: Cancelar una reserva
        [HttpPatch("{id}/cancelar")]
        [Authorize(Roles = "cliente,admin")]
        public async Task<IActionResult> Cancelar(int id)
        {
            if (id <= 0) return BadRequest("ID inválido.");

            await _reservaRepo.CancelarReservaAsync(id);
            return NoContent();
        }

        /// ADMIN: Ver detalle de una reserva
        [HttpGet("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> GetById(int id)
        {
            if (id <= 0) return BadRequest("ID inválido.");

            var reserva = await _reservaRepo.GetByIdAsync(id);
            if (reserva == null) return NotFound($"No se encontró la reserva con id {id}.");

            return Ok(reserva.Adapt<ReservaResponseDto>());
        }
    }
}
