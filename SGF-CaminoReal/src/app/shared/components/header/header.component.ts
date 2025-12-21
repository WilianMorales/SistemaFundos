import { Component, computed, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';


@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.component.html',
  styles: ``
})
export class HeaderComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  // Signals derivados del AuthService
  isLoggedIn = computed(() => this.auth.isAuthenticated());
  userName = computed(() => {
    const user = this.auth.currentUser();
    if (!user) return '';
    return `${user.nombres} ${user.apellidos}`;
  });

  menuOpen = false;

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
