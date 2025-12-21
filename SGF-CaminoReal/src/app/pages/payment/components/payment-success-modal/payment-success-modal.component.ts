import { DecimalPipe } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

export interface PaymentSuccessData {
  reservationCode: string;
  type: 'room' | 'event';
  habitacion?: string;
  tipoEvento?: string;
  espacio?: string;
  checkIn?: string;
  checkOut?: string;
  fecha?: string;
  total: number;
}

@Component({
  selector: 'app-payment-success-modal',
  imports: [DecimalPipe],
  templateUrl: './payment-success-modal.component.html',
  styles: ``
})
export class PaymentSuccessModalComponent {
  @Input() data!: PaymentSuccessData;
  @Output() close = new EventEmitter<'dashboard' | 'home'>();

}
