import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-auth-shell',
  imports: [],
  templateUrl: './auth-shell.component.html',
  styles: ``
})
export class AuthShellComponent {

  paymentMethods = signal([
    { name: 'BCP', icon: 'assets/payments/bcp-logo.webp', class: 'w-3 h-4' },
    { name: 'Interbank', icon: 'assets/payments/interbank.webp', class: 'w-3 h-4' },
    { name: 'Visa', icon: 'assets/payments/visa.webp', class: 'w-3 h-4' },
    { name: 'Yape', icon: 'assets/payments/yape.webp', class: 'w-5 h-6' },
    { name: 'Plin', icon: 'assets/payments/plin.webp', class: 'w-5 h-6' }
  ]);

}
