export interface User {
  id_user: number;
  name_user: string;
  lastname: string;
  email: string;
  phone: string;
  address: string;
  identity_card: string;
  image: string;
  is_active: boolean;
  date_time: string;
  rol_name: string;
  id_rol?: number;
}

export interface CreateUser {
  name_user: string;
  lastname: string;
  email: string;
  phone: string;
  address: string;
  identity_card: string;
  password_user: string;
  image?: string;
  id_rol: number;
  is_active: boolean;
}

export interface UpdateUser {
  name_user: string;
  lastname: string;
  email: string;
  phone: string;
  address: string;
  identity_card: string;
  password_user?: string;
  image?: string | null;
  id_rol: number;
  is_active: number; // Backend espera 0 o 1
}

export interface LoginCredentials {
  email: string;
  password_user: string;
}