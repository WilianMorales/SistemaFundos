import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BookingSummary } from '../../../../shared/models/booking-summary.model';

@Component({
  selector: 'app-resumen-evento',
  imports: [],
  templateUrl: './resumen-evento.component.html',
  styles: ``
})
export class ResumenEventoComponent  {
  @Input() tipoEvento!: string;
  @Input() espacio!: string;
  @Input() fecha!: string;
  @Input() hora!: string;
  @Input() duracion!: number;
  @Input() invitados!: number;
  @Input() rentaEspacio!: number;
  @Input() costoPersona!: number;

  @Output() cancelar = new EventEmitter<void>();
  @Output() pagar = new EventEmitter<BookingSummary>();

  get totalInvitados(): number {
    return this.costoPersona * this.invitados;
  }

  get total(): number {
    return this.rentaEspacio + this.totalInvitados;
  }

  onCancelar() {
    this.cancelar.emit();
  }

  onPagar() {
    const resumen: BookingSummary = {
      type: 'event',
      total: this.total,
      tipoEvento: this.tipoEvento,
      espacio: this.espacio,
      fecha: this.fecha,
      hora: this.hora,
      duracion: `${this.duracion} horas`,
      invitados: this.invitados,
      rentaEspacio: this.rentaEspacio,
      costoPersona: this.costoPersona
    };
    this.pagar.emit(resumen);
  }
}
