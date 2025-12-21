import { Component, inject, signal } from '@angular/core';
import { BookingDetail } from '../../shared/models/booking-detail.model';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingService } from '../../core/booking/booking.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-modificar-reservas',
  imports: [FormsModule],
  templateUrl: './modificar-reservas.component.html',
  styleUrls: ['./modificar-reservas.component.css'],
})
export class ModificarReservasComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private bookingService = inject(BookingService);

  reserva = signal<BookingDetail | null>(null);

  constructor() {
    const canEdit = sessionStorage.getItem('canEditReservation');
    sessionStorage.removeItem('canEditReservation');

    if (!canEdit) {
      this.router.navigate(['/']);
      return;
    }

    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.reserva.set(null);
      return;
    }

    const detail = this.bookingService.getBookingDetailById(id);
    this.reserva.set(detail);
  }

  todayInputDate = (() => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  })();

  toInputDate(fechaVista: string | undefined | null): string {
    if (!fechaVista) return '';
    const partes = fechaVista.split('-');
    if (partes.length !== 3) return '';
    const [dd, mm, yyyy] = partes;
    return `${yyyy}-${mm}-${dd}`;
  }

  setCheckIn(value: string) {
    const r = this.reserva();
    if (!r) return;
    this.reserva.set({ ...r, checkIn: value });
  }

  setCheckOut(value: string) {
    const r = this.reserva();
    if (!r) return;
    this.reserva.set({ ...r, checkOut: value });
  }

  setFechaEvento(value: string) {
    const r = this.reserva();
    if (!r) return;
    this.reserva.set({ ...r, fechaEvento: value });
  }

  guardarCambios() {
    const r = this.reserva();
    if (!r) return;

    this.bookingService.updateBookingDetail(r);
    alert('Cambios guardados correctamente.');
    this.router.navigate(['/dashboard']);
  }

  cancelar() {
    this.router.navigate(['/dashboard']);
  }

}
