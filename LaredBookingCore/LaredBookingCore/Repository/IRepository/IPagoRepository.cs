using LaredBookingCore.Models;
using LaredBookingCore.Models.Dto;

namespace LaredBookingCore.Repository.IRepository;

public interface IPagoRepository
{
    Task<Pago> RegistrarPagoAsync(int idReserva, PagoDto dto);
    Task<IEnumerable<Pago>> GetPagosPorReservaAsync(int idReserva);

}
