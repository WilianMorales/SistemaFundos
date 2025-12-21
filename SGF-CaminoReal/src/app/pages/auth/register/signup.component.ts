import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthShellComponent } from '../auth-shell.component';
import { RegistroForm, RegistroState } from './registro.state';
import { AuthService } from '../../../core/auth/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-signup',
  imports: [AuthShellComponent, RouterLink, FormsModule],
  templateUrl: './signup.component.html',
  styles: ``
})
export class SignupComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  state = new RegistroState(this.auth, this.router);

  onChange(campo: keyof RegistroForm, value: any) {
    this.state.form.update(f => ({ ...f, [campo]: value }));
  }

  onSubmit(event: Event) {
    event.preventDefault();
    this.state.registrar();
  }
}
