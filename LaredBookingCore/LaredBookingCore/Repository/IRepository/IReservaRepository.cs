using LaredBookingCore.Models;
using LaredBookingCore.Models.Dto;

namespace LaredBookingCore.Repository.IRepository;

public interface IReservaRepository
{
    Task<IEnumerable<Reserva>> GetAllAsync();
    Task<Reserva?> GetByIdAsync(int id);
    Task<IEnumerable<Reserva>> GetByUsuarioAsync(int idUsuario);
    Task<bool> IsFundoAvailableAsync(int idFundo, DateTime inicio, DateTime fin);
    Task<Reserva> CrearReservaAsync(CreateReservaDto dto);
    Task ConfirmarReservaAsync(int idReserva);
    Task CancelarReservaAsync(int idReserva);

}
