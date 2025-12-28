using LaredBookingCore.Data;
using LaredBookingCore.Models;
using LaredBookingCore.Models.Dto;
using LaredBookingCore.Repository.IRepository;
using Microsoft.EntityFrameworkCore;

namespace LaredBookingCore.Repository;

public class PagoRepository : IPagoRepository
{
    private readonly ApplicationDbContext _context;
    private readonly IReservaRepository _reservaRepository;

    public PagoRepository(ApplicationDbContext context, IReservaRepository reservaRepository)
    {
        _context = context;
        _reservaRepository = reservaRepository;
    }

    public async Task<Pago> RegistrarPagoAsync(int idReserva, PagoDto dto)
    {
        var pago = new Pago
        {
            IdReserva = idReserva,
            Monto = dto.Monto,
            MetodoPago = dto.MetodoPago,
            FechaPago = DateTime.UtcNow,
            Estado = "pagado"
        };

        await _context.Pagos.AddAsync(pago);
        await _context.SaveChangesAsync();

        await _reservaRepository.ConfirmarReservaAsync(idReserva);

        return pago;
    }

    public async Task<IEnumerable<Pago>> GetPagosPorReservaAsync(int idReserva)
    {
        return await _context.Pagos
            .Where(p => p.IdReserva == idReserva)
            .ToListAsync();
    }
}
