using LaredBookingCore.Data;
using LaredBookingCore.Models;
using LaredBookingCore.Models.Dto;
using Mapster;
using Microsoft.EntityFrameworkCore;

namespace LaredBookingCore.Repository.IRepository;

public class ReservaRepository : IReservaRepository
{
    private readonly ApplicationDbContext _context;

    public ReservaRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Reserva>> GetAllAsync()
    {
        return await _context.Reservas
            .Include(r => r.Usuario)
            .Include(r => r.Fundo)
            .Include(r => r.Pagos)
            .ToListAsync();
    }

    public async Task<Reserva?> GetByIdAsync(int id)
    {
        return await _context.Reservas
            .Include(r => r.Usuario)
            .Include(r => r.Fundo)
            .Include(r => r.Pagos)
            .FirstOrDefaultAsync(r => r.IdReserva == id);
    }

    public async Task<IEnumerable<Reserva>> GetByUsuarioAsync(int idUsuario)
    {
        return await _context.Reservas
            .Where(r => r.IdUsuario == idUsuario)
            .Include(r => r.Fundo)
            .Include(r => r.Pagos)
            .ToListAsync();
    }

    public async Task<bool> IsFundoAvailableAsync(int idFundo, DateTime inicio, DateTime fin)
    {
        return !await _context.Reservas
            .AnyAsync(r => r.IdFundo == idFundo &&
                           r.Estado != "cancelada" &&
                           r.FechaInicio < fin &&
                           r.FechaFin > inicio);
    }

    public async Task<Reserva> CrearReservaAsync(CreateReservaDto dto)
    {
        // Validar disponibilidad
        var disponible = await IsFundoAvailableAsync(dto.IdFundo, dto.FechaInicio, dto.FechaFin);
        if (!disponible)
            throw new InvalidOperationException("El fundo no está disponible en las fechas seleccionadas.");

        // Crear entidad Reserva
        var reserva = dto.Adapt<Reserva>();
        reserva.FechaReserva = DateTime.UtcNow;
        reserva.Estado = "pendiente";

        await _context.Reservas.AddAsync(reserva);
        await _context.SaveChangesAsync();

        // Recargar la reserva con las relaciones (Usuario y Fundo)
        var reservaConDatos = await _context.Reservas
            .Include(r => r.Usuario)
            .Include(r => r.Fundo)
            .Include(r => r.Pagos) // puede ser null, pero lo incluimos para consistencia
            .FirstOrDefaultAsync(r => r.IdReserva == reserva.IdReserva);

        if (reservaConDatos == null)
            throw new Exception("Error al cargar la reserva recién creada.");

        return reservaConDatos;
    }


    public async Task ConfirmarReservaAsync(int idReserva)
    {
        var reserva = await _context.Reservas.FindAsync(idReserva);
        if (reserva == null) throw new KeyNotFoundException("Reserva no encontrada.");

        reserva.Estado = "confirmada";
        await _context.SaveChangesAsync();
    }

    public async Task CancelarReservaAsync(int idReserva)
    {
        var reserva = await _context.Reservas.FindAsync(idReserva);
        if (reserva == null) throw new KeyNotFoundException("Reserva no encontrada.");

        reserva.Estado = "cancelada";
        await _context.SaveChangesAsync();
    }
}