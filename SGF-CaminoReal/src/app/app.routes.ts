import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { authGuard } from './core/auth/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/index/index.component')
            .then(m => m.IndexComponent)
      },
      {
        path: 'dashboard',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./pages/dashboard/dashboard.component')
            .then(m => m.DashboardComponent)
      },
      {
        path: 'reserva-habitacion',
        loadComponent: () =>
          import('./pages/reserva/reserva.component')
            .then(m => m.ReservaComponent)
      },
      {
        path: 'reserva-evento',
        loadComponent: () =>
          import('./pages/eventos/eventos.component')
            .then(m => m.EventosComponent)
      },
      {
        path: 'pagar-reserva',
        loadComponent: () =>
          import('./pages/payment/payment.component')
            .then(m => m.PaymentComponent)
      },
      {
        path: 'modificar-reserva/:id',
        loadComponent: () =>
          import('./pages/modificar-reservas/modificar-reservas.component')
            .then(m => m.ModificarReservasComponent)
      }
    ]
  },
  { path: 'registrar',
      loadComponent: () =>
        import('./pages/auth/register/signup.component')
          .then(m => m.SignupComponent)
  },
  { path: 'login',
    loadComponent: () =>
      import('./pages/auth/login/login.component')
        .then(m => m.LoginComponent)
  },
  { path: '', redirectTo: '', pathMatch: 'full' },
  { path: '**', redirectTo: '' }
];
