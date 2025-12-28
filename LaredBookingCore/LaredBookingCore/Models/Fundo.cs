using System.ComponentModel.DataAnnotations;

namespace LaredBookingCore.Models;

public class Fundo
{
    [Key]
    public int IdFundo { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string Ubicacion { get; set; } = string.Empty;
    public string? Descripcion { get; set; }
    public int Capacidad { get; set; }
    public bool Estado { get; set; } = true;

    public ICollection<Reserva> Reservas { get; set; } = new List<Reserva>();
}
