import { Component, computed, Input, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { BookingDetail } from '../../../../shared/models/booking-detail.model';

type ReportView = 'reservas' | 'eventos' | 'ingresos' | 'mensual';

@Component({
  selector: 'app-dashboard-report',
  imports: [DecimalPipe],
  templateUrl: './dashboard-report.component.html',
  styles: ``
})
export class DashboardReportComponent {
  @Input() bookings: BookingDetail[] = [];

  activeView = signal<ReportView>('reservas');

  reportTotals = computed(() => {
    const items = this.bookings;
    const confirmadas = items.filter(b => b.estado === 'confirmada');
    const habitaciones = confirmadas.filter(b => b.tipo === 'room');
    const eventos = confirmadas.filter(b => b.tipo === 'event');

    const ingresosTotal = confirmadas.reduce((s, b) => s + b.total, 0);
    const ingresosHabitaciones = habitaciones.reduce((s, b) => s + b.total, 0);
    const ingresosEventos = eventos.reduce((s, b) => s + b.total, 0);

    return {
      ingresosTotal,
      ingresosHabitaciones,
      ingresosEventos,
      reservasHabitaciones: habitaciones.length,
      reservasEventos: eventos.length
    };
  });

  reportEstado = computed(() => {
    const items = this.bookings;
    const total = items.length || 1;

    const confirmadas = items.filter(b => b.estado === 'confirmada').length;
    const canceladas = items.filter(b => b.estado === 'cancelada').length;
    const pendientes = 0;

    return {
      confirmadas,
      canceladas,
      pendientes,
      pConfirmadas: Math.round(confirmadas * 100 / total),
      pCanceladas: Math.round(canceladas * 100 / total),
      pPendientes: Math.round(pendientes * 100 / total),
      total
    };
  });

  monthlyReport = computed(() => {
    const items = this.bookings;
    const total = items.length;
    const confirmadas = items.filter(b => b.estado === 'confirmada').length;
    const canceladas = items.filter(b => b.estado === 'cancelada').length;
    const ingresos = items.reduce((s, b) => s + b.total, 0);

    return { total, confirmadas, canceladas, ingresos };
  });

  setView(view: ReportView) {
    this.activeView.set(view);
  }

  downloadMonthlyExcel() {
    const items = this.bookings; // BookingDetail[]

    if (!items.length) return;

    const rows = items.map(b => ({
      id: b.id,
      tipo: b.tipoTexto,
      titulo: b.titulo,
      habitacion_espacio: b.habitacion ?? b.espacio ?? '',
      checkIn: b.checkIn ?? b.fechaEvento ?? '',
      checkOut: b.checkOut ?? '',
      hora: b.horaEvento ?? '',
      noches: b.noches ?? '',
      huespedes: b.huespedes ?? '',
      invitados: b.invitados ?? '',
      total: b.total,
      estado: b.estado,
      clienteNombre: b.clienteNombre,
      clienteEmail: b.clienteEmail,
      clienteTelefono: b.clienteTelefono,
      fechaCreacion: b.fechaCreacion,
      fechaPago: b.fechaPago ?? ''
    }));

    const separator = ';';
    const header = Object.keys(rows[0]);

    const bom = '\uFEFF';

    const csvBody  = [
      header.join(separator),
      ...rows.map(row =>
        header
          .map(fieldName => {
            const value = (row as any)[fieldName] ?? '';
            const str = String(value).replace(/"/g, '""');
            return `"${str}"`;
          })
          .join(separator)
      )
    ].join('\r\n');

    const csv = bom + csvBody;

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'reporte_reservas_camino_real.csv';
    link.click();
    window.URL.revokeObjectURL(url);
    link.remove();
  }
}
