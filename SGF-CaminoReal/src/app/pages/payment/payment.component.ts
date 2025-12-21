import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HeroComponent } from "./components/hero/hero.component";
import { DecimalPipe } from '@angular/common';
import { PaymentSuccessData, PaymentSuccessModalComponent } from './components/payment-success-modal/payment-success-modal.component';
import { BookingService } from '../../core/booking/booking.service';

@Component({
  selector: 'app-payment',
  imports: [ReactiveFormsModule, HeroComponent, DecimalPipe, PaymentSuccessModalComponent],
  templateUrl: './payment.component.html',
})
export class PaymentComponent {
  private bookingService = inject(BookingService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  amount = 0;
  tax = 0;
  serviceFee = 0;
  subtotal = 0;

  booking = this.bookingService.currentBooking();

  showSuccess = signal(false);
  successData = signal<PaymentSuccessData | null>(null);

  constructor() {
    const booking = this.bookingService.currentBooking();
    if (!booking) {
      this.router.navigate(['/']);
      return;
    }

    if (booking.type === 'room') {
      this.amount = booking.precioxnoche * booking.noches;
    } else {
      this.amount = booking.rentaEspacio ?? 0;
    }

    this.tax = +(this.amount * 0.18).toFixed(2);
    this.serviceFee = +(this.amount * 0.10).toFixed(2);
    this.subtotal = +(this.amount - this.tax - this.serviceFee).toFixed(2);
  }

  paymentForm = this.fb.group({
    method: ['card', Validators.required],
    cardNumber: [''],      // sin required aquí
    cardName: [''],
    expiryDate: [''],
    cvv: [''],
    fullName: ['', [Validators.required]],
    dnipassport: ['', [Validators.required]],
    ruc: [''],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required]],
    address: [''],
    company: [''],
    specialRequests: [''],
    acceptTerms: [false, Validators.requiredTrue]
  });

  selectMethod(method: 'card' | 'qr' | 'paypal'): void {
    this.paymentForm.patchValue({ method });
  }

  onSubmit() {
    const method = this.paymentForm.get('method')?.value ?? 'card';
    if (method === 'card') {
      const cardNumber = (this.paymentForm.get('cardNumber')?.value || '').replace(/\s+/g, '');
      const cardName = this.paymentForm.get('cardName')?.value || '';
      const expiryDate = this.paymentForm.get('expiryDate')?.value || '';
      const cvv = this.paymentForm.get('cvv')?.value || '';

      const cardErrors =
        cardNumber.length !== 16 ||
        !/^\d{16}$/.test(cardNumber) ||
        !cardName.trim() ||
        !/^\d{2}\/\d{2}$/.test(expiryDate) ||
        !/^\d{3}$/.test(cvv);

      if (cardErrors) {
        this.paymentForm.markAllAsTouched();
        return;
      }
    }

    if (this.paymentForm.invalid) return;

    const booking = this.bookingService.currentBooking();
    if (!booking) return;

    const prefix = booking.type === 'room' ? 'RES-' : 'EVT-';
    const reservationCode = prefix + Date.now();

    this.bookingService.confirmPayment({
      method: (this.paymentForm.get('method')?.value ?? 'card') as string,
      amount: this.amount,
      currency: 'PEN',
      reservationCode,
      customerName: this.paymentForm.value.fullName ?? '',
      customerEmail: this.paymentForm.value.email ?? '',
      customerPhone: this.paymentForm.value.phone ?? ''
    });

    const base: PaymentSuccessData = {
      reservationCode,
      type: booking.type,
      total: this.amount
    };

    if (booking.type === 'room') {
      this.successData.set({
        ...base,
        habitacion: booking.habitacion,
        checkIn: booking.checkIn,
        checkOut: booking.checkOut
      });
    } else {
      this.successData.set({
        ...base,
        tipoEvento: booking.tipoEvento,
        espacio: booking.espacio,
        fecha: booking.fecha
      });
    }

    this.showSuccess.set(true);
  }

  handleSuccessClose(destino: 'dashboard' | 'home') {
    this.showSuccess.set(false);
    this.bookingService.clearCurrent();

    if (destino === 'dashboard') {
      this.router.navigate(['/dashboard']);
    } else {
      this.router.navigate(['/']);
    }
  }

  cancelarPago() {
    this.router.navigate(['/']);
  }

  onCardNumberInput(event: Event) {
    const input = event.target as HTMLInputElement;
    // quitar todo lo que no sea dígito
    let value = input.value.replace(/\D/g, '');
    // limitar a 16 dígitos
    value = value.slice(0, 16);

    // agrupar en bloques de 4
    const chunks = value.match(/.{1,4}/g) || [];
    const formatted = chunks.join(' ');

    this.paymentForm.get('cardNumber')?.setValue(formatted, { emitEvent: false });
  }

  onExpiryInput(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, ''); // solo dígitos

    // máximo 4 dígitos MMYY
    value = value.slice(0, 4);

    if (value.length >= 3) {
      // insertar slash después de los 2 primeros
      value = value.slice(0, 2) + '/' + value.slice(2);
    }

    this.paymentForm.get('expiryDate')?.setValue(value, { emitEvent: false });
  }

  onCvvInput(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');
    value = value.slice(0, 3);
    this.paymentForm.get('cvv')?.setValue(value, { emitEvent: false });
  }

}
