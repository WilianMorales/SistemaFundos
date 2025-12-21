import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-reserva-no-encontrada-modal',
  imports: [],
  templateUrl: './reserva-no-encontrada-modal.component.html',
  styles: ``
})
export class ReservaNoEncontradaModalComponent {
   @Output() close = new EventEmitter<void>();
}
