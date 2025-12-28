using LaredBookingCore.Models;
using LaredBookingCore.Models.Dto;
using Mapster;

namespace LaredBookingCore.Mapping;

public class FundoProfile
{
    public static void Register()
    {
        TypeAdapterConfig<Fundo, FundoDto>.NewConfig().TwoWays();
    }

}
