import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BookingDetail } from '../../../models/booking-detail.model';
import { BookingService } from '../../../../core/booking/booking.service';

@Component({
  selector: 'app-cancelar-reserva-confirmar',
  imports: [FormsModule],
  templateUrl: './cancelar-reserva-confirmar.component.html',
  styles: ``
})
export class CancelarReservaConfirmarComponent {
  @Input() detail!: BookingDetail;
  @Output() close = new EventEmitter<void>();
  @Output() cancelacionExitosa = new EventEmitter<void>();

  private bookingService = inject(BookingService);

  motivo = '';

  confirmar() {
    if (!this.detail) return;
    this.bookingService.cancelBookingById(this.detail.id);
    this.cancelacionExitosa.emit();
  }

  volverABuscar() {
    this.close.emit();
  }
}
