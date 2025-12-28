using LaredBookingCore.Models;
using LaredBookingCore.Models.Dto;

namespace LaredBookingCore.Repository.IRepository;

public interface IUsuarioRepository
{
    ICollection<Usuario> GetUsuarios();
    Usuario? GetUsuario(int id);
    Task<UsuarioLoginDto> Login(UsuarioLoginRequestDto loginRequest);
    Task<UsuarioDataDto> Registrar(CreateUsuarioDto createUsuario);
}
