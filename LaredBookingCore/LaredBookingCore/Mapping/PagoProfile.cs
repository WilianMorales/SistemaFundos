using LaredBookingCore.Models;
using LaredBookingCore.Models.Dto;
using Mapster;

namespace LaredBookingCore.Mapping;

public class PagoProfile
{
    public static void Register()
    {
        TypeAdapterConfig<Pago, PagoDto>.NewConfig().TwoWays();
    }

}
