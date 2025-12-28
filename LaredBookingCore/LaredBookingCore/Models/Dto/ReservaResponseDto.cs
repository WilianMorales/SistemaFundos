namespace LaredBookingCore.Models.Dto;


public class ReservaResponseDto
{
    public int IdReserva { get; set; }
    public DateTime FechaReserva { get; set; }
    public DateTime FechaInicio { get; set; }
    public DateTime FechaFin { get; set; }
    public string Estado { get; set; } = "pendiente";
    public decimal MontoTotal { get; set; }
    // Solo lo que necesitas mostrar
    public string UsuarioNombre { get; set; } = string.Empty;
    public string FundoNombre { get; set; } = string.Empty;
    public IEnumerable<PagoDto> Pagos { get; set; } = new List<PagoDto>();
}


