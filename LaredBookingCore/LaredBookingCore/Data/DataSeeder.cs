using LaredBookingCore.Data;
using LaredBookingCore.Models;
using System.Security.Cryptography;
using System.Text;

public static class DataSeeder
{
    public static void SeedData(ApplicationDbContext context)
    {
        // Eliminar primero todas las reservas para evitar conflictos de FK
        context.Reservas.RemoveRange(context.Reservas);
        context.SaveChanges();

        var usuarioSeeder = new List<Usuario>
        {
            new Usuario
            {
                Nombre = "Administrador",
                Email = "admin@admin.com",
                PasswordHash = HashPassword("Admin123!"),
                Telefono = "999999999",
                Rol = "admin",
                FechaRegistro = DateTime.UtcNow,
                Estado = true
            },
            new Usuario
            {
                Nombre = "Cliente Demo",
                Email = "cliente@demo.com",
                PasswordHash = HashPassword("Cliente123!"),
                Telefono = "987654321",
                Rol = "cliente",
                FechaRegistro = DateTime.UtcNow,
                Estado = true
            }
        };

        var seederIdUsuario = usuarioSeeder.Select(usuario => usuario.IdUsuario).ToList();
        var registrosParaEliminar = context.Usuarios.Where(x => seederIdUsuario.Contains(x.IdUsuario) == false).ToList();
        context.Usuarios.RemoveRange(registrosParaEliminar);

        foreach (var usuario in usuarioSeeder)
        {
            var usuarioExistente = context.Usuarios.FirstOrDefault(x => x.IdUsuario == usuario.IdUsuario);
            if (usuarioExistente == null)
            {
                context.Usuarios.Add(usuario);
            }
            else
            {
                usuarioExistente.Nombre = usuario.Nombre;
                usuarioExistente.Email = usuario.Email;
                usuarioExistente.PasswordHash = usuario.PasswordHash;
                usuarioExistente.Telefono = usuario.Telefono;
                usuarioExistente.Rol = usuario.Rol;
                usuarioExistente.FechaRegistro = usuario.FechaRegistro;
                usuarioExistente.Estado = usuario.Estado;
            }
        }

        var fundosSeeder = new List<Fundo>
        {
            new Fundo
            {
                Nombre = "Fundo Camino Real",
                Ubicacion = "Lared, Perú",
                Descripcion = "Hermoso fundo para eventos, rodeado de naturaleza",
                Capacidad = 200,
                Estado = true
            },
        };

        var seederIds = fundosSeeder.Select(x => x.IdFundo).ToList();

        var registrosAEliminar = context.Fundos
            .Where(x => seederIds.Contains(x.IdFundo) == false)
            .ToList();
        context.Fundos.RemoveRange(registrosAEliminar);


        foreach (var fundo in fundosSeeder)
        {
            var existente = context.Fundos.FirstOrDefault(x => x.IdFundo == fundo.IdFundo);
            if (existente == null)
            {
                context.Fundos.Add(fundo);     
            }
            else
            {
                existente.Nombre = fundo.Nombre;
                existente.Ubicacion = fundo.Ubicacion;
                existente.Descripcion = fundo.Descripcion;
                existente.Capacidad = fundo.Capacidad;
                existente.Estado = fundo.Estado;
            }
        }

        context.SaveChanges();
    }

    private static string HashPassword(string password)
    {
        return BCrypt.Net.BCrypt.HashPassword(password);
    }
}
