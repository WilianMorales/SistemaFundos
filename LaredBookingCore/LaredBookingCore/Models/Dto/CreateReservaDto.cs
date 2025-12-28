namespace LaredBookingCore.Models.Dto;

public class CreateReservaDto
{
    public int IdUsuario { get; set; }
    public int IdFundo { get; set; }
    public DateTime FechaInicio { get; set; }
    public DateTime FechaFin { get; set; }
    public decimal MontoTotal { get; set; }
}
