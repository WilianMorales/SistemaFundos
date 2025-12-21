import { signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';

export interface RegistroForm {
  nombres: string;
  apellidos: string;
  email: string;
  usuario: string;
  password: string;
  confirmPassword: string;
  aceptaTerminos: boolean;
}

export class RegistroState {
  form = signal<RegistroForm>({
    nombres: '',
    apellidos: '',
    email: '',
    usuario: '',
    password: '',
    confirmPassword: '',
    aceptaTerminos: false
  });

  errores = signal<Partial<Record<keyof RegistroForm | 'general', string>>>({});
  cargando = signal(false);
  exito = signal(false);

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  private setError(campo: keyof RegistroForm | 'general', mensaje: string) {
    this.errores.update(e => ({ ...e, [campo]: mensaje }));
  }

  private limpiarErrores() {
    this.errores.set({});
  }

  private validarFormulario(): boolean {
    const f = this.form();
    const errores: Partial<Record<keyof RegistroForm | 'general', string>> = {};

    if (!f.nombres.trim()) errores.nombres = 'Nombres requeridos';
    if (!f.apellidos.trim()) errores.apellidos = 'Apellidos requeridos';

    if (!f.email.trim()) errores.email = 'Email requerido';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email))
      errores.email = 'Email no válido';

    if (!f.usuario.trim()) errores.usuario = 'Usuario requerido';

    if (!f.password) errores.password = 'Contraseña requerida';
    else if (f.password.length < 6)
      errores.password = 'La contraseña debe tener al menos 6 caracteres';

    if (!f.confirmPassword)
      errores.confirmPassword = 'Confirme la contraseña';
    else if (f.password !== f.confirmPassword)
      errores.confirmPassword = 'Las contraseñas no coinciden';

    if (!f.aceptaTerminos)
      errores.aceptaTerminos = 'Debes aceptar los términos';

    if (Object.keys(errores).length > 0) {
      errores.general = 'Revisa los campos marcados en rojo.';
    }

    this.errores.set(errores);
    return Object.keys(errores).length === 0;
  }

  formValido = computed(() => this.validarFormulario());

  async registrar(): Promise<void> {
    this.limpiarErrores();

    if (!this.validarFormulario()) {
      return;
    }

    this.cargando.set(true);
    try {
      const f = this.form();

      await this.auth.register({
        nombres: f.nombres,
        apellidos: f.apellidos,
        email: f.email,
        usuario: f.usuario,
        password: f.password,
        role: 'cliente'
      });

      this.exito.set(true);
      await this.router.navigate(['/dashboard']);
    } catch (err: any) {
      console.error('Error registro memoria', err);
      this.setError('general', err?.message || 'No se pudo registrar');
    } finally {
      this.cargando.set(false);
    }
  }
}
