export interface AuthResponse {
  message: string;
  data: {
    id_user: number;
    name_user: string;
    lastname: string;
    email: string;
    rol_name: string;
    token: string;
    expiration: string;
  };
}

export interface CurrentUser {
  id_user: number;
  name_user: string;
  lastname: string;
  email: string;
  rol_name: string;
  expiration: string;
}

export interface LoginRequest {
  email: string;
  password_user: string;
}

export interface RegisterRequest {
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