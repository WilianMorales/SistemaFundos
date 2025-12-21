import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BookingDetail } from '../../../../shared/models/booking-detail.model';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-reserva-detail-modal',
  imports: [TitleCasePipe],
  templateUrl: './reserva-detail-modal.component.html',
  styles: ``
})
export class ReservaDetailModalComponent {
  @Input() detail!: BookingDetail;
  @Output() close = new EventEmitter<void>();

  onClose() {
    this.close.emit();
  }
}
