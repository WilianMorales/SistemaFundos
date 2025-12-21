import { DecimalPipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-card-espacio',
  imports: [DecimalPipe],
  templateUrl: './card-espacio.component.html',
  styles: ``
})
export class CardEspacioComponent {
  @Input() nombre!: string;
  @Input() imagen!: string;
  @Input() capacidad!: number;
  @Input() renta!: number;
  @Input() caracteristicas!: string[];
  @Input() isSelected = false;
  @Input() isDisabled = false;

  @Output() select = new EventEmitter<void>();

  onSelect() {
    if (!this.isDisabled) {
      this.select.emit();
    }
  }
}
