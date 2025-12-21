import { Component, computed, inject, signal } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookingItem, UserRole } from '../../shared/models/booking-item.model';
import { BookingDetail } from '../../shared/models/booking-detail.model';
import { BookingService } from '../../core/booking/booking.service';

import { CardReservaComponent } from "./components/card-reserva/card-reserva.component";
import { ReservaDetailModalComponent } from "./components/reserva-detail-modal/reserva-detail-modal.component";
import { ClientesTablaComponent } from './components/clientes-tabla/clientes-tabla.component';
import { DashboardReportComponent } from "./components/dashboard-report/dashboard-report.component";
import { ReservaModalComponent } from '../../shared/components/modal/reserva-modal/reserva-modal.component';
import { BuscarReservaModalComponent } from "../../shared/components/modal/buscar-reserva-modal/buscar-reserva-modal.component";
import { ReservaNoEncontradaModalComponent } from "../../shared/components/modal/reserva-no-encontrada-modal/reserva-no-encontrada-modal.component";
import { AuthService } from '../../core/auth/auth.service';
import { CancelarReservaBuscarComponent } from "../../shared/components/modal/cancelar-reserva-buscar/cancelar-reserva-buscar.component";
import { CancelarReservaConfirmarComponent } from "../../shared/components/modal/cancelar-reserva-confirmar/cancelar-reserva-confirmar.component";
import { CancelarReservaExitoComponent } from "../../shared/components/modal/cancelar-reserva-exito/cancelar-reserva-exito.component";

export interface ClienteDashboard {
  nombre: string;
  email: string;
  telefono: string;
  reservas: number;
  totalGastado: number;
  ultimaReserva: string;
}

@Component({
  selector: 'app-dashboard',
  imports: [
    FormsModule,
    CardReservaComponent,
    ReservaDetailModalComponent,
    ClientesTablaComponent,
    DashboardReportComponent,
    ReservaModalComponent,
    BuscarReservaModalComponent,
    ReservaNoEncontradaModalComponent,
    CancelarReservaBuscarComponent,
    CancelarReservaConfirmarComponent,
    CancelarReservaExitoComponent
  ],
  templateUrl: './dashboard.component.html',
  styles: ``
})
export class DashboardComponent {

  private document = inject(DOCUMENT);
  private bookingService = inject(BookingService);
  private auth = inject(AuthService);

  user = this.auth.currentUser();

  reservasDetalle = computed<BookingDetail[]>(() => {
    const user = this.auth.currentUser();
    if (!user) return [];

    // admin ve TODO el historial adaptado
    if (user.role === 'admin') {
      return this.bookingService.bookingDetails();
    }

    // cliente solo ve sus reservas (bookingHistory ya filtra por userId)
    return this.bookingService.bookingHistory().map(res =>
      this.bookingService.toBookingDetail(res)
    );
  });

  userRole = computed<UserRole>(() => this.auth.currentUser()?.role ?? 'cliente');

  showReservaModal = false;
  showBuscarReservaModal = false;
  showReservaNoEncontradaModal = false;
  showCancelarBuscarModal = false;
  showConfirmarCancelarModal = false;
  showCancelacionExitosaModal = false;

  reservaParaCancelar = signal<BookingDetail | null>(null);

  // pestañas superiores
  mainTab = signal<'reservas' | 'perfil' | 'clientes' | 'reportes' | 'admin'>('reservas');
  subTab = signal<'habitaciones' | 'eventos'>('habitaciones');

  // filtro de estado
  statusFilter = signal<'todas' | 'confirmadas' | 'canceladas'>('todas');

  selectedDetail = signal<BookingDetail | null>(null);

  bookings = computed<BookingItem[]>(() =>
    this.reservasDetalle().map(detail => {
      if (detail.tipo === 'room') {
        return {
          id: detail.id,
          titulo: detail.habitacion ?? detail.titulo,
          tipo: 'room',
          estado: detail.estado,
          etiquetaTipo: 'Habitación',
          monto: detail.total,
          resumenLinea: `${detail.noches ?? 1} noches`,
          detalleCols: [
            { icon: 'ri-calendar-check-line', label: 'Check-in', value: detail.checkIn ?? '' },
            { icon: 'ri-calendar-close-line', label: 'Check-out', value: detail.checkOut ?? '' },
            { icon: 'ri-user-line', label: 'Huéspedes', value: String(detail.huespedes ?? '') },
            { icon: 'ri-time-line', label: 'Creada', value: detail.fechaCreacion }
          ],
          detail
        } as BookingItem;
      }

      // event
      return {
        id: detail.id,
        titulo: detail.titulo,
        tipo: 'event',
        estado: detail.estado,
        etiquetaTipo: 'Evento',
        monto: detail.total,
        resumenLinea: `${detail.duracionHoras ?? ''} horas`,
        detalleCols: [
          { icon: 'ri-calendar-event-line', label: 'Fecha', value: detail.fechaEvento ?? '' },
          { icon: 'ri-time-line', label: 'Hora', value: detail.horaEvento ?? '' },
          { icon: 'ri-group-line', label: 'Invitados', value: String(detail.invitados ?? '') },
          { icon: 'ri-time-line', label: 'Creada', value: detail.fechaCreacion }
        ],
        detail
      } as BookingItem;
    })
  );

  clientes = computed<ClienteDashboard[]>(() => {
    const map = new Map<string, ClienteDashboard>();

    this.reservasDetalle().forEach(r => {
      const key = r.clienteEmail || r.clienteTelefono || r.clienteNombre;
      if (!key) return;

      const existing = map.get(key);
      const fecha = r.fechaCreacion;

      if (!existing) {
        map.set(key, {
          nombre: r.clienteNombre,
          email: r.clienteEmail,
          telefono: r.clienteTelefono,
          reservas: 1,
          totalGastado: r.total,
          ultimaReserva: fecha
        });
      } else {
        existing.reservas += 1;
        existing.totalGastado += r.total;
        existing.ultimaReserva = fecha;
      }
    });

    return Array.from(map.values());
  });

  // filtros combinados
  filteredBookings = computed(() => {
    const tipo = this.subTab();
    const estado = this.statusFilter();

    return this.bookings().filter(b => {
      if (tipo === 'habitaciones' && b.tipo !== 'room') return false;
      if (tipo === 'eventos' && b.tipo !== 'event') return false;
      if (estado === 'confirmadas' && b.estado !== 'confirmada') return false;
      if (estado === 'canceladas' && b.estado !== 'cancelada') return false;
      return true;
    });
  });

  // helpers para navegación por rol
  showClientes = computed(() => this.userRole() === 'admin');
  showReportes = computed(() => this.userRole() !== 'cliente');
  showAdmin = computed(() => this.userRole() === 'admin');


  setStatusFilter(v: 'todas' | 'confirmadas' | 'canceladas') {
    this.statusFilter.set(v);
  }

  setSubTab(v: 'habitaciones' | 'eventos') {
    this.subTab.set(v);
  }

  cancelarReserva(b: BookingItem) {
    const detalle = b.detail;
    if (!detalle) return;
    this.reservaParaCancelar.set(detalle);
    this.showConfirmarCancelarModal = true;
  }

  verDetalle(reserva: BookingItem) {
    this.selectedDetail.set(reserva.detail);
    this.document.body.classList.add('modal-open');
  }

  cerrarDetalle() {
    this.selectedDetail.set(null);
    this.document.body.classList.remove('modal-open');
  }

  openReservaModal() {
    this.showReservaModal = true;
  }

  closeReservaModal() {
    this.showReservaModal = false;
  }

  openBuscarReservaModal() {
    this.showBuscarReservaModal = true;
  }

  closeBuscarReservaModal() {
    this.showBuscarReservaModal = false;
  }

  openCancelarBuscarModal() {
    this.showCancelarBuscarModal = true;
  }

  closeCancelarBuscarModal() {
    this.showCancelarBuscarModal = false;
  }

  onReservaEncontradaParaCancelar(detail: BookingDetail) {
    this.reservaParaCancelar.set(detail);
    this.showCancelarBuscarModal = false;
    this.showConfirmarCancelarModal = true;
  }

  closeConfirmarCancelarModal() {
    this.showConfirmarCancelarModal = false;
  }

  // se llamará cuando se confirme la cancelación
  onCancelacionExitosa() {
    this.showConfirmarCancelarModal = false;
    this.showCancelacionExitosaModal = true;
  }

  // cerrar todo y volver al dashboard limpio
  cerrarTodoYCargarDashboard() {
    this.showCancelarBuscarModal = false;
    this.showConfirmarCancelarModal = false;
    this.showCancelacionExitosaModal = false;
    this.reservaParaCancelar.set(null);
  }

  mostrarReservaNoEncontrada() {
    this.showReservaNoEncontradaModal = true;
  }

  cerrarReservaNoEncontrada() {
    this.showReservaNoEncontradaModal = false;
  }

}
