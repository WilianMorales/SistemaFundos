import { DecimalPipe, NgClass, UpperCasePipe } from '@angular/common';
import { Component, Input, signal } from '@angular/core';

export interface ClienteDashboard {
  nombre: string;
  email: string;
  telefono: string;
  reservas: number;
  totalGastado: number;
  ultimaReserva: string;
}

@Component({
  selector: 'app-clientes-tabla',
  imports: [UpperCasePipe, NgClass, DecimalPipe],
  templateUrl: './clientes-tabla.component.html',
  styles: ``
})
export class ClientesTablaComponent {
  page = signal(1);
  pageSize = 10;

  @Input() clientes: ClienteDashboard[] = [];

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.clientes.length / this.pageSize));
  }

  get pagedClientes() {
    const start = (this.page() - 1) * this.pageSize;
    return this.clientes.slice(start, start + this.pageSize);
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  goToPage(p: number) {
    if (p < 1 || p > this.totalPages) return;
    this.page.set(p);
  }

}
