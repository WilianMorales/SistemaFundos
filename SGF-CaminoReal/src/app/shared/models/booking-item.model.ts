import { BookingDetail } from "./booking-detail.model";

// models.ts
export type UserRole = 'cliente' | 'empleado' | 'admin';
export type BookingKind = 'room' | 'event';
export type BookingStatus = 'confirmada' | 'cancelada';

export interface BookingItem {
  id: string;
  titulo: string;
  tipo: BookingKind;       // 'room' | 'event'
  estado: BookingStatus;   // 'confirmada' | 'cancelada'
  etiquetaTipo: string;    // "Habitación" | "Evento"
  monto: number;
  resumenLinea: string;    // "3 noches" / "3 horas"
  detalleCols: {
    icon: string;
    label: string;
    value: string;
  }[];
  detail: BookingDetail;
}
