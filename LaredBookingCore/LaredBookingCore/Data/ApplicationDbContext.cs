using LaredBookingCore.Models;
using Microsoft.EntityFrameworkCore;

namespace LaredBookingCore.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Relación Reserva -> Usuario
        modelBuilder.Entity<Reserva>()
            .HasOne(r => r.Usuario)
            .WithMany(u => u.Reservas)
            .HasForeignKey(r => r.IdUsuario)
            .OnDelete(DeleteBehavior.Restrict);

        // Relación Reserva -> Fundo
        modelBuilder.Entity<Reserva>()
            .HasOne(r => r.Fundo)
            .WithMany(f => f.Reservas)
            .HasForeignKey(r => r.IdFundo)
            .OnDelete(DeleteBehavior.Restrict);

        // Relación Pago -> Reserva
        modelBuilder.Entity<Pago>()
            .HasOne(p => p.Reserva)
            .WithMany(r => r.Pagos)
            .HasForeignKey(p => p.IdReserva)
            .OnDelete(DeleteBehavior.Cascade);
    }

    public DbSet<Usuario> Usuarios { get; set; }
    public DbSet<Reserva> Reservas { get; set; }
    public DbSet<Fundo> Fundos { get; set; }
    public DbSet<Pago> Pagos { get; set; }
}
