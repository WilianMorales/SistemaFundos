import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BookingSummary } from '../../../../shared/models/booking-summary.model';

@Component({
  selector: 'app-resumen',
  imports: [],
  templateUrl: './resumen.component.html',
})
export class ResumenComponent {

  @Input() habitacion!: any;
  @Input() checkIn!: string;
  @Input() checkOut!: string;
  @Input() noches!: number;
  @Input() huespedes!: number;

  @Output() cancelar = new EventEmitter<void>();
  @Output() pagar = new EventEmitter<BookingSummary>();

  onCancelar() {
    this.cancelar.emit();
  }

  onPagar() {
    const total = this.habitacion.precio * this.noches;
    const resumen: BookingSummary = {
      type: 'room',
      total,
      habitacion: this.habitacion.nombre,
      checkIn: this.checkIn,
      checkOut: this.checkOut,
      huespedes: this.huespedes,
      noches: this.noches,
      precioxnoche: this.habitacion.precio,
    };
    this.pagar.emit(resumen);
  }
}
