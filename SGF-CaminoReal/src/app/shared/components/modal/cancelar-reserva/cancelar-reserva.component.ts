import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-cancelar-reserva',
  imports: [],
  templateUrl: './cancelar-reserva.component.html',
  styles: ``
})
export class CancelarReservaComponent {
  @Output() close = new EventEmitter<void>();
}

