import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  templateUrl: './footer.component.html',
  styles: ``
})
export class FooterComponent {

  paymentMethods = signal([
    { name: 'BCP', icon: 'assets/payments/bcp-logo.webp', class: 'w-3 h-4' },
    { name: 'Interbank', icon: 'assets/payments/interbank.webp', class: 'w-3 h-4' },
    { name: 'Visa', icon: 'assets/payments/visa.webp', class: 'w-3 h-4' },
    { name: 'Yape', icon: 'assets/payments/yape.webp', class: 'w-5 h-6' },
    { name: 'Plin', icon: 'assets/payments/plin.webp', class: 'w-5 h-6' }
  ]);

  socialLinks = signal([
    {
      platform: 'Facebook',
      url: '#',
      icon: 'assets/icons/facebook.svg',
      class: 'hover:bg-blue-600'
    },
    {
      platform: 'Instagram',
      url: '#',
      icon: 'assets/icons/instagram.svg',
      class: 'hover:bg-gradient-to-br hover:from-yellow-400 hover:via-pink-500 hover:to-purple-600'
    },
    {
      platform: 'TikTok',
      url: '#',
      icon: 'assets/icons/tiktok.svg',
      class: 'hover:bg-gradient-to-br hover:from-cyan-400 hover:to-pink-500'
    },
    {
      platform: 'WhatsApp',
      url: '#',
      icon: 'assets/icons/whatsapp.svg',
      class: 'hover:bg-green-500'
    }
  ]);


}
