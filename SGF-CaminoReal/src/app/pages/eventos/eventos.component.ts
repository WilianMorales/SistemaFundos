import { Component, computed, inject, signal } from '@angular/core';
import { HeroComponent } from "./components/hero/hero.component";
import { FormsModule } from '@angular/forms';
import { CardEventoComponent } from './components/card-evento/card-evento.component';
import { CardEspacioComponent } from './components/card-espacio/card-espacio.component';
import { ResumenEventoComponent } from './components/resumen/resumen-evento.component';
import { Router } from '@angular/router';
import { BookingSummary } from '../../shared/models/booking-summary.model';
import { BookingService, EventBooking } from '../../core/booking/booking.service';

interface TipoEvento {
  id: string;
  nombre: string;
  icon: string;
  descripcion: string;
  minCap: number;
  maxCap: number;
  precioPersona: number;
  servicios: string[];
}

interface EspacioEvento {
  nombre: string;
  imagen: string;
  capacidad: number;
  renta: number;
  estado: boolean;
  caracteristicas: string[];
}

@Component({
  selector: 'app-eventos',
  imports: [FormsModule, HeroComponent, CardEventoComponent, CardEspacioComponent, ResumenEventoComponent],
  templateUrl: './eventos.component.html',
  styles: ``
})
export class EventosComponent {
  private router = inject(Router);
  private bookingService = inject(BookingService);

  tiposEvento = signal<TipoEvento[]>([
    {
      id: 'boda',
      nombre: 'Boda',
      icon: 'ri-heart-line',
      descripcion: 'Celebra el día más especial de tu vida en nuestras elegantes instalaciones',
      minCap: 50,
      maxCap: 300,
      precioPersona: 85,
      servicios: [
        'Decoración incluida',
        'Coordinador de eventos',
        'Menú personalizado',
        'DJ o banda en vivo',
        'Fotografía profesional'
      ]
    },
    {
      id: 'corporativo',
      nombre: 'Evento Corporativo',
      icon: 'ri-briefcase-line',
      descripcion: 'Espacios profesionales para conferencias, seminarios y reuniones empresariales',
      minCap: 20,
      maxCap: 200,
      precioPersona: 45,
      servicios: [
        'Equipos audiovisuales',
        'WiFi de alta velocidad',
        'Coffee breaks',
        'Servicio de catering',
        'Soporte técnico'
      ]
    },
    {
      id: 'cumple',
      nombre: 'Cumpleaños',
      icon: 'ri-cake-3-line',
      descripcion: 'Celebraciones memorables para todas las edades',
      minCap: 20,
      maxCap: 150,
      precioPersona: 35,
      servicios: [
        'Decoración temática',
        'Animación infantil',
        'Pastel incluido',
        'Música y entretenimiento',
        'Área de juegos'
      ]
    },
    {
      id: 'graduacion',
      nombre: 'Graduación',
      icon: 'ri-graduation-cap-line',
      descripcion: 'Celebra tus logros académicos con estilo',
      minCap: 30,
      maxCap: 200,
      precioPersona: 40,
      servicios: [
        'Decoración académica',
        'Fotografía de grupo',
        'Buffet completo',
        'Música ambiental',
        'Área de fotos'
      ]
    },
    {
      id: 'aniversario',
      nombre: 'Aniversario',
      icon: 'ri-gift-line',
      descripcion: 'Celebra años de amor y compromiso',
      minCap: 30,
      maxCap: 150,
      precioPersona: 55,
      servicios: [
        'Decoración romántica',
        'Cena de gala',
        'Música en vivo',
        'Servicio de bar',
        'Coordinación completa'
      ]
    },
    {
      id: 'otro',
      nombre: 'Otro Evento',
      icon: 'ri-calendar-event-line',
      descripcion: 'Eventos personalizados según tus necesidades',
      minCap: 20,
      maxCap: 250,
      precioPersona: 50,
      servicios: [
        'Personalización total',
        'Asesoría profesional',
        'Catering flexible',
        'Decoración a medida',
        'Servicios adicionales'
      ]
    }
  ]);

  espacios = signal<EspacioEvento[]>([
    {
      nombre: 'Salón Gran Ballroom',
      imagen: 'assets/images/eventos/evento-local.webp',
      capacidad: 300,
      renta: 2500,
      estado: true,
      caracteristicas: [
        'Capacidad 300 personas',
        'Escenario profesional',
        'Pista de baile',
        'Sistema de sonido premium',
        'Iluminación LED',
        'Aire acondicionado'
      ]
    },
    {
      nombre: 'Terraza Jardín',
      imagen: 'assets/images/eventos/evento-jardin.jpg',
      capacidad: 150,
      renta: 1800,
      estado: true,
      caracteristicas: [
        'Capacidad 150 personas',
        'Área al aire libre',
        'Vista panorámica',
        'Jardines decorativos',
        'Iluminación ambiental',
        'Toldo retráctil'
      ]
    },
    {
      nombre: 'Salon Campestre',
      imagen: 'assets/images/eventos/evento-salon.jpg',
      capacidad: 200,
      renta: 3000,
      estado: true,
      caracteristicas: [
        'Capacidad 200 personas',
        'Área al aire libre',
        'Vista panorámica',
        'Escenario integrado',
        'Iluminación ambiental',
        'Toldo retráctil'
      ]
    },
    {
      nombre: 'Espacio con Piscina',
      imagen: 'assets/images/eventos/evento-piscina.webp',
      capacidad: 60,
      renta: 1200,
      estado: true,
      caracteristicas: [
        'Capacidad 60 personas',
        'Área al aire libre',
        'Piscina privada',
        'Mesas y sillas incluidas',
        'Iluminación ambiental',
        'Toldo retráctil'
      ]
    }
  ]);

  today = new Date().toISOString().split('T')[0];

  selectedTipoId = signal<string | null>(null);
  selectedEspacio = signal<EspacioEvento | null>(null);

  fechaEvento = signal<string>('');
  horaInicio = signal<string>('');
  invitados = signal<number>(50);
  duracion = signal<number>(6);

  hasSearched = signal(false);

  selectedTipo = computed(() =>
    this.tiposEvento().find(t => t.id === this.selectedTipoId()) ?? null
  );

  serviciosIncluidos = computed(() => this.selectedTipo()?.servicios ?? []);

  espaciosFiltrados = computed(() => {
    const inv = this.invitados();
    return this.espacios().filter(e => e.capacidad >= inv);
  });

  eventReservations = computed(() =>
    this.bookingService.allBookings().filter(res => res.booking.type === 'event')
  );

  isEspacioReservado(esp: EspacioEvento): boolean {
    const fecha = this.fechaEvento();
    if (!fecha) return false;

    return this.eventReservations().some(res => {
      const b = res.booking;
      if (b.type !== 'event') return false;
      if (b.espacio !== esp.nombre) return false;

      // si la fecha de la reserva coincide con la fecha buscada, está reservado
      return b.fecha === fecha;
    });
  }

  seleccionarTipo(id: string) {
    this.selectedTipoId.set(id);
    this.hasSearched.set(false);
    this.selectedEspacio.set(null);
  }

  buscarEspacios() {
    if (!this.selectedTipo()) {
      window.alert('Seleccione primero un tipo de evento.');
      return;
    }
    if (!this.fechaEvento() || !this.horaInicio()) {
      window.alert('Seleccione fecha y hora del evento.');
      return;
    }
    if (this.invitados() < 20) {
      window.alert('El número mínimo de invitados es 20.');
      return;
    }
    this.hasSearched.set(true);
    this.selectedEspacio.set(null);
  }

  seleccionarEspacioCard(esp: EspacioEvento) {
    if (!esp.estado) {
      window.alert('Este espacio ya está reservado.');
      return;
    }
    this.selectedEspacio.set(esp);
  }

  cancelarReservaEvento() {
    this.selectedEspacio.set(null);
  }

  irAPago(resumen: BookingSummary) {
    const booking: EventBooking = {
      type: 'event',
      tipoEvento: resumen.tipoEvento!,
      espacio: resumen.espacio!,
      fecha: resumen.fecha!,
      hora: resumen.hora!,
      duracion: resumen.duracion!,
      invitados: resumen.invitados!,
      rentaEspacio: resumen.rentaEspacio!
    };

    this.bookingService.setBooking(booking);

    this.router.navigate(['/pagar-reserva']);
  }

}
