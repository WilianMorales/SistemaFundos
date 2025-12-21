import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-card-evento',
  imports: [],
  templateUrl: './card-evento.component.html',
})
export class CardEventoComponent {
  @Input() nombre!: string;
  @Input() icon!: string;
  @Input() descripcion!: string;
  @Input() minCap!: number;
  @Input() maxCap!: number;
  @Input() precioPersona!: number;
  @Input() isSelected = false;

  @Output() select = new EventEmitter<void>();

  onSelect() {
    this.select.emit();
  }
}
