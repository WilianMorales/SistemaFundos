export interface BookingDetail {
  id: string;
  tipo: 'room' | 'event';
  estado: 'confirmada' | 'cancelada';
  titulo: string;
  tipoTexto: string;

  // habitación
  habitacion?: string;
  checkIn?: string;
  checkOut?: string;
  noches?: number;
  huespedes?: number;

  // evento
  espacio?: string;
  fechaEvento?: string;
  horaEvento?: string;
  duracionHoras?: number;
  invitados?: number;

  // común
  total: number;

  // cliente
  clienteNombre: string;
  clienteEmail: string;
  clienteTelefono: string;

  // fechas importantes
  fechaCreacion: string;
  fechaPago?: string;
}
