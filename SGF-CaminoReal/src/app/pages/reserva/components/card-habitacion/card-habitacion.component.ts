import { NgClass } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-card-habitacion',
  imports: [NgClass],
  templateUrl: './card-habitacion.component.html',
  styles: ``
})
export class CardHabitacionComponent {
  @Input() nombre!: string;
  @Input() imagen!: string;
  @Input() precio!: number;
  @Input() capacidad!: number;
  @Input() noches!: number;
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
