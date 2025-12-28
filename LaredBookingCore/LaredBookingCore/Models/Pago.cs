using System.ComponentModel.DataAnnotations;

namespace LaredBookingCore.Models;

public class Pago
{
    [Key]
    public int IdPago { get; set; }
    public int IdReserva { get; set; }
    public decimal Monto { get; set; }
    public string MetodoPago { get; set; } = "tarjeta"; // tarjeta, transferencia, efectivo
    public DateTime FechaPago { get; set; } = DateTime.UtcNow;
    public string Estado { get; set; } = "pendiente"; // pendiente, pagado, fallido

    public Reserva Reserva { get; set; } = null!;
}
