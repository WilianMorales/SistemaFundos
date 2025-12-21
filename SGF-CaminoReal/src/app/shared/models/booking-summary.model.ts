export type BookingType = 'room' | 'event';

export interface BookingSummary {
  type: BookingType;
  total: number;

  // reserva de habitación
  habitacion?: string;
  checkIn?: string;
  checkOut?: string;
  huespedes?: number;
  noches?: number;
  precioxnoche?: number;

  // evento
  tipoEvento?: string;
  espacio?: string;
  fecha?: string;
  hora?: string;
  duracion?: string;
  invitados?: number;
  rentaEspacio?: number;
  costoPersona?: number;
}
