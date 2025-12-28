using System;

namespace LaredBookingCore.Models.Dto;

public class FundoDto
{
    public int IdFundo { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string Ubicacion { get; set; } = string.Empty;
    public string? Descripcion { get; set; }
    public int Capacidad { get; set; }

}
