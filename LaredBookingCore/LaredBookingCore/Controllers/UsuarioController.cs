using LaredBookingCore.Models.Dto;
using LaredBookingCore.Repository.IRepository;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LaredBookingCore.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "admin")]
    public class UsuarioController : ControllerBase
    {
        private readonly IUsuarioRepository _usuarioRepository;

        public UsuarioController(IUsuarioRepository usuarioRepository)
        {
            _usuarioRepository = usuarioRepository;
        }

        // GET api/usuario/5
        [HttpGet("{id:int}")]
        public IActionResult GetUsuario(int id)
        {
            var usuario = _usuarioRepository.GetUsuario(id);
            if (usuario == null)
                return NotFound("Usuario no encontrado.");

            return Ok(usuario);
        }

        // GET api/usuario
        [HttpGet]
        public IActionResult GetUsuarios()
        {
            var usuarios = _usuarioRepository.GetUsuarios();
            return Ok(usuarios);
        }

        // POST api/usuario/registrar
        [AllowAnonymous]
        [HttpPost("registrar")]
        public async Task<IActionResult> Registrar([FromBody] CreateUsuarioDto createUsuario)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var usuario = await _usuarioRepository.Registrar(createUsuario);
                return Ok(usuario);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UsuarioLoginRequestDto loginRequest)
        {
            var respuesta = await _usuarioRepository.Login(loginRequest);

            if (!string.IsNullOrEmpty(respuesta.Message) && respuesta.Message != "Login exitoso")
                return BadRequest(respuesta.Message);

            return Ok(respuesta);
        }
    }
}

