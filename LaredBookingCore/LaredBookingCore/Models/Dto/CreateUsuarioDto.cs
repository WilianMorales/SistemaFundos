using System.ComponentModel.DataAnnotations;

namespace LaredBookingCore.Models.Dto;

public class CreateUsuarioDto
{
    [Required(ErrorMessage = "El campo nombre es requerido")]
    public string Nombre { get; set; } = string.Empty;
    [Required(ErrorMessage = "El campo email es requerido")]
    public string Email { get; set; } = string.Empty;
    [Required(ErrorMessage = "El campo password es requerido")]
    public string Password { get; set; } = string.Empty;

    public string? Telefono { get; set; }

}

