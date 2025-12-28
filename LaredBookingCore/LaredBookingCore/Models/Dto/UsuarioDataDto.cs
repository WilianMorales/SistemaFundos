namespace LaredBookingCore.Models.Dto;

public class UsuarioDataDto
{
    public string Nombre { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Telefono { get; set; }
    public string Rol { get; set; } = "cliente"; 
    public DateTime FechaRegistro { get; set; } = DateTime.UtcNow;
    public bool Estado { get; set; } = true;
}
