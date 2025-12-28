using System.ComponentModel.DataAnnotations;

namespace LaredBookingCore.Models;

public class Reserva
{
    [Key]
    public int IdReserva { get; set; }
    public int IdUsuario { get; set; }
    public int IdFundo { get; set; }
    public DateTime FechaReserva { get; set; } = DateTime.UtcNow;
    public DateTime FechaInicio { get; set; }
    public DateTime FechaFin { get; set; }
    public string Estado { get; set; } = "pendiente"; // pendiente, confirmada, cancelada
    public decimal MontoTotal { get; set; }
    public Usuario Usuario { get; set; } = null!;
    public Fundo Fundo { get; set; } = null!;
    public ICollection<Pago> Pagos { get; set; } = new List<Pago>();
}
