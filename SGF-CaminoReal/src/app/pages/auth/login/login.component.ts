import { Component, inject } from '@angular/core';
import { AuthShellComponent } from '../auth-shell.component';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/auth/auth.service';
import { LoginForm, LoginState } from './login.state';

@Component({
  selector: 'app-login',
  imports: [AuthShellComponent, RouterLink, FormsModule],
  templateUrl: './login.component.html',
  styles: ``
})
export class LoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  state = new LoginState(this.auth, this.router);

  onChange(campo: keyof LoginForm, value: any) {
    this.state.form.update(f => ({ ...f, [campo]: value }));
  }

  onSubmit(event: Event) {
    event.preventDefault();
    this.state.login();
  }
}
