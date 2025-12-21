import { Injectable, signal, computed, inject } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { AuthService } from '../auth/auth.service';
import { BookingDetail } from '../../shared/models/booking-detail.model';

export type BookingType = 'room' | 'event';

export interface RoomBooking {
  type: 'room';
  habitacion: string;
  checkIn: string;
  checkOut: string;
  huespedes: number;
  noches: number;
  precioxnoche: number;
}

export interface EventBooking {
  type: 'event';
  tipoEvento: string;
  espacio: string;
  fecha: string;
  hora: string;
  duracion: string;
  invitados: number;
  rentaEspacio: number;
}

export type Booking = RoomBooking | EventBooking;

export interface PaymentInfo {
  method: string;
  amount: number;
  currency: string;
  reservationCode: string;
  paidAt: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
}

export interface ConfirmedBooking {
  id: string;
  userId: string;
  booking: Booking;
  payment: PaymentInfo;
  estado: 'confirmada' | 'cancelada';
}

const BOOKING_HISTORY_KEY = 'demo_booking_history';

@Injectable({ providedIn: 'root' })
export class BookingService {
  private auth = inject(AuthService);

  private booking = signal<Booking | null>(null);
  private payment = signal<PaymentInfo | null>(null);
  private history = signal<ConfirmedBooking[]>([]);

  currentBooking = computed(() => this.booking());
  currentPayment = computed(() => this.payment());

  bookingHistory = computed(() => {
    const user = this.auth.currentUser();
    if (!user) return [];
    return this.history().filter(h => h.userId === user.id);
  });

  // historial completo para admin
  allBookings = computed(() => this.history());

  constructor() {
    try {
      const rawHistory = localStorage.getItem(BOOKING_HISTORY_KEY);
      if (rawHistory) {
        this.history.set(JSON.parse(rawHistory));
      }
    } catch (e) {
      console.error('Error leyendo historial de reservas', e);
      this.history.set([]);
    }
  }

  private persistHistory() {
    try {
      localStorage.setItem(BOOKING_HISTORY_KEY, JSON.stringify(this.history()));
    } catch (e) {
      console.error('Error guardando historial de reservas', e);
    }
  }

  setBooking(data: Booking) {
    this.booking.set(data);
  }

  confirmPayment(info: Omit<PaymentInfo, 'paidAt'>) {
    const user = this.auth.currentUser();
    if (!user) {
      throw new Error('No hay usuario autenticado');
    }

    const booking = this.booking();
    if (!booking) {
      throw new Error('No hay reserva en curso');
    }

    const payment: PaymentInfo = {
      ...info,
      paidAt: new Date().toISOString()
    };

    //TODO: REVISAR CREO Q ESTO ELIMINA TODO DEL LOCALSTORAGE
    this.payment.set(payment);

    const confirmed: ConfirmedBooking = {
      id: uuidv4(),
      userId: user.id,
      booking,
      payment,
      estado: 'confirmada'
    };

    this.history.update(list => [...list, confirmed]);
    this.persistHistory();
  }

  clearCurrent() {
    this.booking.set(null);
    this.payment.set(null);
  }

  cancelBookingById(reservationCode: string) {
    this.history.update(list =>
      list.map(r =>
        r.payment.reservationCode === reservationCode
          ? { ...r, estado: 'cancelada' }
          : r
      )
    );
    this.persistHistory();
  }

  // Editar solo datos visuales (BookingDetail)
  updateBookingDetail(updated: BookingDetail) {
    this.history.update(list =>
      list.map(r => {
        if (r.payment.reservationCode !== updated.id) return r;

        if (r.booking.type === 'room') {
          const newBooking: RoomBooking = {
            ...r.booking,
            checkIn: this.parseFecha(updated.checkIn),
            checkOut: this.parseFecha(updated.checkOut),
            huespedes: updated.huespedes ?? r.booking.huespedes,
            noches: updated.noches ?? r.booking.noches
          };
          const newPayment: PaymentInfo = {
            ...r.payment,
            customerName: updated.clienteNombre,
            customerEmail: updated.clienteEmail,
            customerPhone: updated.clienteTelefono,
            amount: updated.total
          };
          return { ...r, booking: newBooking, payment: newPayment };
        } else {
          const newBooking: EventBooking = {
            ...r.booking,
            fecha: this.parseFecha(updated.fechaEvento),
            hora: updated.horaEvento ?? r.booking.hora,
            invitados: updated.invitados ?? r.booking.invitados,
            duracion: updated.duracionHoras
              ? String(updated.duracionHoras)
              : r.booking.duracion
          };
          const newPayment: PaymentInfo = {
            ...r.payment,
            customerName: updated.clienteNombre,
            customerEmail: updated.clienteEmail,
            customerPhone: updated.clienteTelefono,
            amount: updated.total
          };
          return { ...r, booking: newBooking, payment: newPayment };
        }
      })
    );
    this.persistHistory();
  }

  // ---------- util de fecha ----------
  private formatDate(dateIso: string | undefined): string {
    if (!dateIso) return '';
    const d = new Date(dateIso);
    if (Number.isNaN(d.getTime())) return dateIso;
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
  }

  private parseFecha(fecha: string | undefined): string {
    if (!fecha) return '';
    if (fecha.includes('T')) return fecha;
    const [dd, mm, yyyy] = fecha.split('-').map(x => Number(x));
    if (!dd || !mm || !yyyy) return fecha;

    const d = new Date(yyyy, mm - 1, dd);
    return d.toISOString();
  }

  // ---------- Adaptador a BookingDetail ----------
  toBookingDetail(res: ConfirmedBooking): BookingDetail {
    const b = res.booking;
    const p = res.payment;

    if (b.type === 'room') {
      return {
        id: p.reservationCode,
        tipo: 'room',
        estado: res.estado,
        titulo: b.habitacion,
        tipoTexto: 'Habitación',

        habitacion: b.habitacion,
        checkIn: this.formatDate(b.checkIn),
        checkOut: this.formatDate(b.checkOut),
        noches: b.noches,
        huespedes: b.huespedes,

        total: p.amount,

        clienteNombre: p.customerName,
        clienteEmail: p.customerEmail,
        clienteTelefono: p.customerPhone,

        fechaCreacion: this.formatDate(p.paidAt),
        fechaPago: this.formatDate(p.paidAt)
      };
    }

    // event
    return {
      id: p.reservationCode,
      tipo: 'event',
      estado: res.estado,
      titulo: b.tipoEvento,
      tipoTexto: 'Evento',

      espacio: b.espacio,
      fechaEvento: this.formatDate(b.fecha),
      horaEvento: b.hora,
      duracionHoras: b.duracion ? Number.parseInt(b.duracion) || undefined : undefined,
      invitados: b.invitados,

      total: p.amount,

      clienteNombre: p.customerName,
      clienteEmail: p.customerEmail,
      clienteTelefono: p.customerPhone,

      fechaCreacion: this.formatDate(p.paidAt),
      fechaPago: this.formatDate(p.paidAt)
    };
  }

  // versión observable del historial ya adaptado
  bookingDetails = computed<BookingDetail[]>(() =>
    this.history().map(res => this.toBookingDetail(res))
  );

  // helper por id de reserva
  getBookingDetailById(id: string): BookingDetail | null {
    const found = this.history().find(r => r.payment.reservationCode === id);
    return found ? this.toBookingDetail(found) : null;
  }

  findBookingByIdAndEmail(id: string, email: string): BookingDetail | null {
    const normalizedId = id.trim();
    const normalizedEmail = email.trim().toLowerCase();

    const found = this.history().find(
      r =>
        r.payment.reservationCode === normalizedId &&
        r.payment.customerEmail.toLowerCase() === normalizedEmail
    );

    return found ? this.toBookingDetail(found) : null;
  }
}
