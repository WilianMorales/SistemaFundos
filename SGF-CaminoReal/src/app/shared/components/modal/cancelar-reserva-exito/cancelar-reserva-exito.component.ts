import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BookingDetail } from '../../../models/booking-detail.model';

@Component({
  selector: 'app-cancelar-reserva-exito',
  imports: [],
  templateUrl: './cancelar-reserva-exito.component.html',
  styles: ``
})
export class CancelarReservaExitoComponent {
  @Input() detail!: BookingDetail;
  @Output() close = new EventEmitter<void>();

  cerrar() {
    this.close.emit();
  }
}
