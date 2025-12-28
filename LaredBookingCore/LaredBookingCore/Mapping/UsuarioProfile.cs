using LaredBookingCore.Models;
using LaredBookingCore.Models.Dto;
using Mapster;

namespace LaredBookingCore.Mapping;

public class UsuarioProfile
{
    public static void Register()
    {
        TypeAdapterConfig<Usuario, CreateUsuarioDto>.NewConfig().TwoWays();
        TypeAdapterConfig<Usuario, UsuarioLoginDto>.NewConfig().TwoWays();
        TypeAdapterConfig<Usuario, UsuarioDataDto>.NewConfig().TwoWays();
    }
}   
