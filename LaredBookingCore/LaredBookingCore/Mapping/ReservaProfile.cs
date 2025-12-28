using LaredBookingCore.Models;
using LaredBookingCore.Models.Dto;
using Mapster;

namespace LaredBookingCore.Mapping;

public class ReservaProfile
{
    public static void Register()
    {
        TypeAdapterConfig<Reserva, CreateReservaDto>.NewConfig();
    }
}
