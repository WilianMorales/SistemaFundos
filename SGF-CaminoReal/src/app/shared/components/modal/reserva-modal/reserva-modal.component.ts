import { Component, EventEmitter, Output } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-reserva-modal',
  imports: [RouterLink],
  templateUrl: './reserva-modal.component.html',
  styles: ``
})
export class ReservaModalComponent {
  @Output() close = new EventEmitter<void>();
}
