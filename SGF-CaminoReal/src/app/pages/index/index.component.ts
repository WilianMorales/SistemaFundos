import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ReservaModalComponent } from '../../shared/components/modal/reserva-modal/reserva-modal.component';

@Component({
  selector: 'app-index',
  imports: [ReservaModalComponent, RouterLink],
  templateUrl: './index.component.html',
  styles: ``
})
export class IndexComponent {
  showReservaModal = false;

  openReservaModal() {
    this.showReservaModal = true;
  }

  closeReservaModal() {
    this.showReservaModal = false;
  }
}
