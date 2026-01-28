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
}

export interface LoginCredentials {
  email: string;
  password_user: string;
}