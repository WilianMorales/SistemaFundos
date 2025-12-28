namespace LaredBookingCore.Models.Dto;

public class UsuarioLoginDto
{
    public UsuarioDataDto? Usuario { get; set; }
    public string? Token { get; set; }
    public string? Message { get; set; } 
}
