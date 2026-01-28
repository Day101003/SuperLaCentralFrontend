import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthResponse, LoginRequest, RegisterRequest, CurrentUser } from '../models/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;
  
  // Estado del usuario actual
  private currentUserSubject = new BehaviorSubject<CurrentUser | null>(this.getUserFromStorage());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    // Verificar si el token ha expirado al cargar el servicio
    const user = this.getUserFromStorage();
    if (user && this.isTokenExpired(user.expiration)) {
      this.logout();
    }
  }

  /**
   * Iniciar sesión
   */
  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, credentials)
      .pipe(
        tap(response => {
          if (response.data && response.data.token) {
            this.saveUserData(response.data);
            this.currentUserSubject.next({
              id_user: response.data.id_user,
              name_user: response.data.name_user,
              lastname: response.data.lastname,
              email: response.data.email,
              rol_name: response.data.rol_name,
              expiration: response.data.expiration
            });
          }
        })
      );
  }

  /**
   * Registrar nuevo usuario
   */
  register(userData: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/register`, userData)
      .pipe(
        tap(response => {
          if (response.data && response.data.token) {
            this.saveUserData(response.data);
            this.currentUserSubject.next({
              id_user: response.data.id_user,
              name_user: response.data.name_user,
              lastname: response.data.lastname,
              email: response.data.email,
              rol_name: response.data.rol_name,
              expiration: response.data.expiration
            });
          }
        })
      );
  }

  /**
   * Cerrar sesión
   */
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  /**
   * Obtener el token actual
   */
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  /**
   * Verificar si el usuario está autenticado
   */
  isAuthenticated(): boolean {
    const token = this.getToken();
    const user = this.getUserFromStorage();
    
    if (!token || !user) {
      return false;
    }

    // Verificar si el token ha expirado
    if (this.isTokenExpired(user.expiration)) {
      this.logout();
      return false;
    }

    return true;
  }

  /**
   * Obtener el usuario actual
   */
  getCurrentUser(): CurrentUser | null {
    return this.currentUserSubject.value;
  }

  /**
   * Guardar datos del usuario en localStorage
   */
  private saveUserData(data: AuthResponse['data']): void {
    localStorage.setItem('token', data.token);
    const user: CurrentUser = {
      id_user: data.id_user,
      name_user: data.name_user,
      lastname: data.lastname,
      email: data.email,
      rol_name: data.rol_name,
      expiration: data.expiration
    };
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  /**
   * Obtener usuario del localStorage
   */
  private getUserFromStorage(): CurrentUser | null {
    const userJson = localStorage.getItem('currentUser');
    if (userJson) {
      try {
        return JSON.parse(userJson);
      } catch {
        return null;
      }
    }
    return null;
  }

  /**
   * Verificar si el token ha expirado
   */
  private isTokenExpired(expiration: string): boolean {
    const expirationDate = new Date(expiration);
    const now = new Date();
    return now >= expirationDate;
  }
}
