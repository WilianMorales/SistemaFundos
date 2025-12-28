using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using LaredBookingCore.Data;
using LaredBookingCore.Models;
using LaredBookingCore.Models.Dto;
using LaredBookingCore.Repository.IRepository;
using Mapster;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace LaredBookingCore.Repository;

public class UsuarioRepository : IUsuarioRepository
{
    private readonly ApplicationDbContext _db;
    private readonly string? _secretKey;

    public UsuarioRepository(ApplicationDbContext db, IConfiguration configuration)
    {
        _db = db;
        _secretKey = configuration.GetValue<string>("ApiSettings:SecretKey");
    }

    public Usuario? GetUsuario(int id)
    {
        return _db.Usuarios.FirstOrDefault(u => u.IdUsuario == id);
    }

    public ICollection<Usuario> GetUsuarios()
    {
        return _db.Usuarios.OrderBy(u => u.Nombre).ToList();
    }

    public async Task<UsuarioDataDto> Registrar(CreateUsuarioDto createUsuario)
    {
        if (string.IsNullOrWhiteSpace(createUsuario.Nombre) || string.IsNullOrWhiteSpace(createUsuario.Email))
            throw new ArgumentException("Nombre y email son obligatorios.");

        if (string.IsNullOrWhiteSpace(createUsuario.Password))
            throw new ArgumentException("La contraseña es obligatoria.");

        var encryptedPassword = BCrypt.Net.BCrypt.HashPassword(createUsuario.Password);

        var nuevoUsuario = new Usuario
        {
            Nombre = createUsuario.Nombre,
            Email = createUsuario.Email,
            PasswordHash = encryptedPassword,
            Telefono = createUsuario.Telefono,
            FechaRegistro = DateTime.UtcNow,
            Rol = "cliente", // Default por seguridad
            Estado = true
        };

        _db.Usuarios.Add(nuevoUsuario);
        await _db.SaveChangesAsync();

        return nuevoUsuario.Adapt<UsuarioDataDto>();
    }

    public async Task<UsuarioLoginDto> Login(UsuarioLoginRequestDto loginRequest)
    {
        if (string.IsNullOrWhiteSpace(loginRequest.Email))
            return new UsuarioLoginDto { Message = "El email es obligatorio." };

        var usuario = await _db.Usuarios.FirstOrDefaultAsync(u =>
            u.Email.ToLower().Trim() == loginRequest.Email.ToLower().Trim());

        if (usuario == null)
            return new UsuarioLoginDto { Message = "Usuario no encontrado." };

        if (!BCrypt.Net.BCrypt.Verify(loginRequest.Password, usuario.PasswordHash))
            return new UsuarioLoginDto { Message = "Contraseña incorrecta." };

        if (string.IsNullOrWhiteSpace(_secretKey))
            throw new InvalidOperationException("La clave secreta (SecretKey) no está configurada.");

        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.UTF8.GetBytes(_secretKey);

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[]
            {
                new Claim("id", usuario.IdUsuario.ToString()),
                new Claim("email", usuario.Email),
                new Claim(ClaimTypes.Role, usuario.Rol)
            }),
            Expires = DateTime.UtcNow.AddHours(2),
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);

        return new UsuarioLoginDto
        {
            Usuario = usuario.Adapt<UsuarioDataDto>(),
            Token = tokenHandler.WriteToken(token),
            Message = "Login exitoso"
        };
    }
}
