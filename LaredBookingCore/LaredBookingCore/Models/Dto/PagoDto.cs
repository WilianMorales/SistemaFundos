using System;

namespace LaredBookingCore.Models.Dto;

public class PagoDto
{
    public int IdPago { get; set; }
    public int IdReserva { get; set;}
    public decimal Monto { get; set; }
    public string MetodoPago { get; set; } = "tarjeta";
    public DateTime FechaPago { get; set; }
    public string Estado { get; set; } = "pendiente";

}
