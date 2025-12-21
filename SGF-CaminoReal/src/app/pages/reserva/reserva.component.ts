import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CardHabitacionComponent } from "./components/card-habitacion/card-habitacion.component";
import { HeroComponent } from "./components/hero/hero.component";
import { ResumenComponent } from "./components/resumen/resumen.component";
import { Router, ActivatedRoute } from '@angular/router';
import { BookingService, RoomBooking } from '../../core/booking/booking.service';

interface Habitacion {
  nombre: string;
  imagen: string;
  precio: number;
  capacidad: number;
  estado?: boolean;
  caracteristicas: string[];
}

@Component({
  selector: 'app-reserva',
  imports: [CardHabitacionComponent, HeroComponent, FormsModule, ResumenComponent],
  templateUrl: './reserva.component.html',
  styles: ``
})
export class ReservaComponent {

  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private bookingService = inject(BookingService);

  habitaciones = signal<Habitacion[]>([
    {
      nombre: 'Habitación Estándar',
      imagen: 'assets/images/habitaciones/h-estandar-1.webp',
      precio: 50,
      capacidad: 2,
      estado: true,
      caracteristicas: ['Cama 2 Plazas', 'WiFi', 'TV Cable', 'Baño/Ducha', 'Aire acondicionado']
    },
    {
      nombre: 'Habitación Estandar Doble',
      imagen: 'assets/images/habitaciones/h-estandar-doble-1.jpg',
      precio: 70,
      capacidad: 4,
      estado: true,
      caracteristicas: ['2 Camas Dobles', 'WiFi', 'TV Cable', 'Baño privado', 'Ducha Fría/Caliente', 'Aire acondicionado']
    },
    {
      nombre: 'Habitación Familiar',
      imagen: 'assets/images/habitaciones/h-familiar-1.jpeg',
      precio: 140,
      capacidad: 4,
      estado: true,
      caracteristicas: ['2 Camas Dobles', 'Cuna Disponible', 'Cocina pequeña', 'Baño amplio', 'Roperos', 'WiFi', 'TV Cable', 'Aire acondicionado']
    },
    {
      nombre: 'Habitación Matrimonial',
      imagen: 'assets/images/habitaciones/h-matrimonial.jpg',
      precio: 90,
      capacidad: 2,
      estado: true,
      caracteristicas: ['1 Cama King', 'Baño amplio', 'Ducha/Regadera', 'Minibar', 'WiFi', 'TV Cable', 'Aire acondicionado']
    },
    {
      nombre: 'Habitación Suite',
      imagen: 'assets/images/habitaciones/h-suite-1.jpg',
      precio: 70,
      capacidad: 2,
      estado: true,
      caracteristicas: ['Cama Queen 2 Plz', 'Ropero personal', 'Baño privado', 'WiFi', 'TV Cable', 'Aire acondicionado']
    },
    {
      nombre: 'Habitación Suite Deluxe',
      imagen: 'assets/images/habitaciones/h-suite-2.jpg',
      precio: 80,
      capacidad: 3,
      estado: true,
      caracteristicas: ['Cama Queen 2 Plz', 'Ropero personal', 'Baño privado', 'Ducha/Regadera', 'WiFi', 'TV Cable', 'Aire acondicionado']
    },
    {
      nombre: 'Habitación Triple',
      imagen: 'assets/images/habitaciones/h-triple-1.jpg',
      precio: 160,
      capacidad: 6,
      estado: true,
      caracteristicas: ['3 Camas de 1 Plz 1/2', 'Baño/Ducha', 'WiFi', 'TV Cable', 'Aire acondicionado']
    },
    {
      nombre: 'Habitación Triple Superior',
      imagen: 'assets/images/habitaciones/h-triple-2.jpg',
      precio: 180,
      capacidad: 6,
      estado: true,
      caracteristicas: ['3 Camas Queen de 2 Plz', 'Ropero grande', 'Baño/Ducha', 'WiFi', 'TV Cable', 'Aire acondicionado']
    },
  ]);

  // Signals para las fechas
  today = new Date().toISOString().split('T')[0];
  checkIn = signal<string>('');
  checkOut = signal<string>('');

  // estado de búsqueda y huéspedes
  huespedes = signal<number>(1);
  hasSearched = signal(false);

  selectedRoom = signal<Habitacion | null>(null);

  constructor() {
    // leer ?habitacion=... de la URL
    const nombreHabitacion = this.route.snapshot.queryParamMap.get('habitacion');

    if (nombreHabitacion) {
      const hab = this.habitaciones().find(h => h.nombre === nombreHabitacion);
      if (hab) {
        this.selectedRoom.set(hab);
        this.hasSearched.set(true);  // para que se muestre la sección de habitaciones
      }
    }
  }

  private rangesOverlap(startA: string, endA: string, startB: string, endB: string): boolean {
    const aStart = new Date(startA).getTime();
    const aEnd = new Date(endA).getTime();
    const bStart = new Date(startB).getTime();
    const bEnd = new Date(endB).getTime();

    return aStart < bEnd && bStart < aEnd;
  }

  // Computed signal para calcular noches automáticamente
  noches = computed(() => {
    if (!this.checkIn() || !this.checkOut()) return 0;
    const inicio = new Date(this.checkIn());
    const fin = new Date(this.checkOut());
    const diff = fin.getTime() - inicio.getTime();
    return Math.max(Math.ceil(diff / (1000 * 60 * 60 * 24)), 0); // noches >= 0
  });

  filteredRooms = computed(() => {
    const g = this.huespedes();
    return this.habitaciones().filter(h => h.capacidad >= g);
  });

  roomReservations = computed(() =>
    this.bookingService.allBookings().filter(res => res.booking.type === 'room')
  );

  isRoomReserved(habitacion: Habitacion): boolean {
    const checkIn = this.checkIn();
    const checkOut = this.checkOut();
    if (!checkIn || !checkOut) return false;

    return this.roomReservations().some(res => {
      const b = res.booking;
      if (b.type !== 'room') return false;
      if (b.habitacion !== habitacion.nombre) return false;

      return this.rangesOverlap(b.checkIn, b.checkOut, checkIn, checkOut);
    });
  }

  onBuscar() {
    if (!this.checkIn() || !this.checkOut()) {
      window.alert('Seleccione fechas de entrada y salida.');
      return;
    }
    if (this.noches() <= 0) {
      window.alert('La fecha de salida debe ser mayor que la de entrada.');
      return;
    }
    this.hasSearched.set(true);
    this.selectedRoom.set(null);
  }

  seleccionarHabitacion(habitacion: Habitacion) {
    if (habitacion.capacidad < this.huespedes()) {
      window.alert('La habitación no tiene la capacidad máxima para los huéspedes solicitados.');
      return;
    }
    if (!habitacion.estado) {
      window.alert('La habitación no está disponible en este momento.');
      return;
    }
    this.selectedRoom.set(habitacion);
  }

  cancelarReserva() {
    this.selectedRoom.set(null);
  }

  irAPago(eventData: { total: number }) {
    const room = this.selectedRoom();
    if (!room) return;

    const booking: RoomBooking = {
      type: 'room',
      habitacion: room.nombre,
      checkIn: this.checkIn(),
      checkOut: this.checkOut(),
      huespedes: this.huespedes(),
      noches: this.noches(),
      precioxnoche: room.precio
    };

    console.log('GUARDANDO BOOKING EN MEMORIA', booking);
    this.bookingService.setBooking(booking);
    this.router.navigate(['/pagar-reserva']);
  }
}
