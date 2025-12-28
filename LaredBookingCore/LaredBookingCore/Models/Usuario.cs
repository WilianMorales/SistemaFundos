using System.ComponentModel.DataAnnotations;

namespace LaredBookingCore.Models;

public class Usuario
{   
    [Key]
    public int IdUsuario { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string? Telefono { get; set; }
    public string Rol { get; set; } = "cliente"; 
    public DateTime FechaRegistro { get; set; } = DateTime.UtcNow;
    public bool Estado { get; set; } = true;

    public ICollection<Reserva> Reservas { get; set; } = new List<Reserva>();
}
