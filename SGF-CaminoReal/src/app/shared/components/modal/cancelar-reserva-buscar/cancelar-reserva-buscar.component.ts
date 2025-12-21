import { Component, EventEmitter, inject, Output } from '@angular/core';
import { BookingService } from '../../../../core/booking/booking.service';
import { BookingDetail } from '../../../models/booking-detail.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cancelar-reserva-buscar',
  imports: [FormsModule],
  templateUrl: './cancelar-reserva-buscar.component.html',
  styles: ``
})
export class CancelarReservaBuscarComponent {
  @Output() close = new EventEmitter<void>();
  @Output() reservaEncontrada = new EventEmitter<BookingDetail>();

  private bookingService = inject(BookingService);

  reservaId = '';
  email = '';
  errorMsg = '';

  buscar() {
    this.errorMsg = '';
    const detail = this.bookingService.findBookingByIdAndEmail(
      this.reservaId,
      this.email
    );
    if (!detail) {
      this.errorMsg = 'No se encontró ninguna reserva con ese ID y correo.';
      return;
    }
    this.reservaEncontrada.emit(detail);
  }

  cerrar() {
    this.close.emit();
  }
}
