import { Injectable, signal, computed } from '@angular/core';
import { User, UserRole } from './user.model';
import { v4 as uuidv4 } from 'uuid';

const USERS_KEY = 'demo_users';
const CURRENT_USER_KEY = 'demo_current_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private users = signal<User[]>([]);
  private currentUserId = signal<string | null>(null);

  // Derivados
  isAuthenticated = computed(() => this.currentUserId() !== null);

  currentUser = computed<User | null>(() => {
    const id = this.currentUserId();
    if (!id) return null;
    return this.users().find(u => u.id === id) ?? null;
  });

  constructor() {
    // Hidratar desde localStorage (si existe)
    try {
      const rawUsers = localStorage.getItem(USERS_KEY);
      const rawCurrent = localStorage.getItem(CURRENT_USER_KEY);

      if (rawUsers) {
        const parsed = JSON.parse(rawUsers) as User[];
        this.users.set(parsed);
      }

      if (rawCurrent && rawCurrent !== '') {
        this.currentUserId.set(rawCurrent);
      }
    } catch (e) {
      console.error('Error leyendo auth de localStorage', e);
      this.users.set([]);
      this.currentUserId.set(null);
    }

    // SEED ADMIN: crear si no existe
    this.ensureAdminSeed();
  }

   private ensureAdminSeed() {
    const users = this.users();
    const exists = users.some(u => u.role === 'admin');

    if (exists) return;

    const adminUser: User = {
      id: uuidv4(),
      nombres: 'ADMIN',
      apellidos: 'CAMINO REAL',
      email: 'admin@caminoreal.com',
      usuario: 'admin',
      password: '123456',          // solo para demo
      createdAt: new Date().toISOString(),
      role: 'admin'
    };

    this.users.set([...users, adminUser]);
    this.persist();
  }

  private persist(): void {
    try {
      localStorage.setItem(USERS_KEY, JSON.stringify(this.users()));
      localStorage.setItem(CURRENT_USER_KEY, this.currentUserId() ?? '');
    } catch (e) {
      console.error('Error guardando auth en localStorage', e);
    }
  }

  // Registro en memoria
  async register(data: {
    nombres: string;
    apellidos: string;
    email: string;
    usuario: string;
    password: string;
    role?: UserRole;
  }): Promise<void> {
    const email = data.email.trim().toLowerCase();
    const usuario = data.usuario.trim().toLowerCase();

    // Validar email único
    const emailExists = this.users().some(
      u => u.email.toLowerCase() === email
    );
    if (emailExists) {
      throw new Error('El email ya está registrado');
    }

    // Validar usuario único
    const userExists = this.users().some(
      u => u.usuario.toLowerCase() === usuario
    );
    if (userExists) {
      throw new Error('El usuario ya está en uso');
    }

    const newUser: User = {
      id: uuidv4(),
      nombres: data.nombres.trim(),
      apellidos: data.apellidos.trim(),
      email,
      usuario,
      password: data.password,    // demo
      createdAt: new Date().toISOString(),
      role: data.role ?? 'cliente'
    };

    this.users.update(list => [...list, newUser]);
    this.currentUserId.set(newUser.id);
    this.persist();
  }

  // Login por email o usuario
  async login(emailOrUser: string, password: string): Promise<void> {
    const key = emailOrUser.trim().toLowerCase();
    const pass = password;

    const found = this.users().find(
      u =>
        (u.email.toLowerCase() === key || u.usuario.toLowerCase() === key) &&
        u.password === pass
    );

    if (!found) {
      throw new Error('Credenciales inválidas');
    }

    this.currentUserId.set(found.id);
    this.persist();
  }

  logout(): void {
    this.currentUserId.set(null);
    this.persist();
  }

  // Para debug, por si quieres ver usuarios en consola
  debugUsers(): User[] {
    return this.users();
  }
}
