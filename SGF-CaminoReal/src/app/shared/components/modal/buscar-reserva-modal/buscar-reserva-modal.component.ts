import { Component, EventEmitter, inject, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BookingService } from '../../../../core/booking/booking.service';

@Component({
  selector: 'app-buscar-reserva-modal',
  imports: [FormsModule],
  templateUrl: './buscar-reserva-modal.component.html',
  styles: ``
})
export class BuscarReservaModalComponent {
  @Output() close = new EventEmitter<void>();
  @Output() notFound = new EventEmitter<void>();

  private bookingService = inject(BookingService);
  private router = inject(Router);

  reservaId = signal('');

  buscar() {
    const id = this.reservaId().trim();
    if (!id) return;

    const exists = this.bookingService.getBookingDetailById(id);

    if (!exists) {
      this.notFound.emit();
      return;
    }

    sessionStorage.setItem('canEditReservation', 'true');
    this.close.emit();
    this.router.navigate(['/modificar-reserva', id]);
  }

  cerrar() {
    this.close.emit();
  }
}
