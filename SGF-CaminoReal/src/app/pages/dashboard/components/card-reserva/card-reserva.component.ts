import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BookingItem } from '../../../../shared/models/booking-item.model';

@Component({
  selector: 'app-card-reserva',
  imports: [],
  templateUrl: './card-reserva.component.html',
})
export class CardReservaComponent {
  @Input() reserva!: BookingItem;

  @Output() ver = new EventEmitter<void>();
  @Output() cancelar = new EventEmitter<void>();

  onVer()      { this.ver.emit(); }
  onCancelar() { this.cancelar.emit(); }

}
