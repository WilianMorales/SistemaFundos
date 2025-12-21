import { signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';

export interface LoginForm {
  usuario: string;
  password: string;
}

export class LoginState {
  form = signal<LoginForm>({
    usuario: '',
    password: ''
  });

  errores = signal<Partial<Record<keyof LoginForm | 'general', string>>>({});
  cargando = signal(false);

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  private setError(campo: keyof LoginForm | 'general', mensaje: string) {
    this.errores.update(e => ({ ...e, [campo]: mensaje }));
  }

  private limpiarErrores() {
    this.errores.set({});
  }

  private validar(): boolean {
    const f = this.form();
    const errores: Partial<Record<keyof LoginForm | 'general', string>> = {};

    if (!f.usuario.trim()) errores.usuario = 'Ingresa tu usuario o email';
    if (!f.password.trim()) errores.password = 'Ingresa tu contraseña';

    if (Object.keys(errores).length > 0) {
      errores.general = 'Revisa los campos marcados en rojo.';
    }

    this.errores.set(errores);
    return Object.keys(errores).length === 0;
  }

  async login(): Promise<void> {
    this.limpiarErrores();

    if (!this.validar()) return;

    this.cargando.set(true);
    try {
      const f = this.form();
      await this.auth.login(f.usuario, f.password);
      await this.router.navigate(['/dashboard']);
    } catch (err: any) {
      console.error('Error login memoria', err);
      this.setError('general', err?.message || 'Credenciales inválidas');
    } finally {
      this.cargando.set(false);
    }
  }
}
