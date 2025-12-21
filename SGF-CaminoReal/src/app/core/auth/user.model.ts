export type UserRole = 'admin' | 'cliente';

export interface User {
  id: string;
  nombres: string;
  apellidos: string;
  email: string;
  usuario: string;
  password: string;
  createdAt: string;
  role: UserRole;
}
