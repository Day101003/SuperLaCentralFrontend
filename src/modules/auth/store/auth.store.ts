import { Injectable, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { LoginRequest, RegisterRequest, CurrentUser } from '../models/auth';

interface AuthState {
  currentUser: CurrentUser | null;
  loading: boolean;
  error: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class AuthStore {
  private authService = inject(AuthService);
  private router = inject(Router);

  // Estado reactivo con señales
  private state = signal<AuthState>({
    currentUser: null,
    loading: false,
    error: null
  });

  // Selectores computados
  currentUser = computed(() => this.state().currentUser);
  loading = computed(() => this.state().loading);
  error = computed(() => this.state().error);
  isAuthenticated = computed(() => !!this.state().currentUser);

  constructor() {
    // Suscribirse a los cambios del usuario en el servicio
    this.authService.currentUser$.subscribe(user => {
      this.state.update(state => ({
        ...state,
        currentUser: user
      }));
    });
  }

  /**
   * Iniciar sesión
   */
  login(credentials: LoginRequest): void {
    this.state.update(state => ({
      ...state,
      loading: true,
      error: null
    }));

    this.authService.login(credentials).subscribe({
      next: (response) => {
        console.log('Login exitoso:', response);
        this.state.update(state => ({
          ...state,
          loading: false,
          error: null
        }));
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        console.error('Error en login:', error);
        const errorMessage = error.error?.message || 'Error al iniciar sesión';
        this.state.update(state => ({
          ...state,
          loading: false,
          error: errorMessage
        }));
      }
    });
  }

  /**
   * Registrar nuevo usuario
   */
  register(userData: RegisterRequest): void {
    this.state.update(state => ({
      ...state,
      loading: true,
      error: null
    }));

    this.authService.register(userData).subscribe({
      next: (response) => {
        console.log('Registro exitoso:', response);
        this.state.update(state => ({
          ...state,
          loading: false,
          error: null
        }));
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        console.error('Error en registro:', error);
        const errorMessage = error.error?.message || 'Error al registrar usuario';
        this.state.update(state => ({
          ...state,
          loading: false,
          error: errorMessage
        }));
      }
    });
  }

  /**
   * Cerrar sesión
   */
  logout(): void {
    this.authService.logout();
    this.state.update(state => ({
      ...state,
      currentUser: null,
      error: null
    }));
    this.router.navigate(['/login']);
  }

  /**
   * Limpiar errores
   */
  clearError(): void {
    this.state.update(state => ({
      ...state,
      error: null
    }));
  }

  /**
   * Verificar autenticación
   */
  checkAuth(): boolean {
    return this.authService.isAuthenticated();
  }

  /**
   * Obtener token
   */
  getToken(): string | null {
    return this.authService.getToken();
  }
}
