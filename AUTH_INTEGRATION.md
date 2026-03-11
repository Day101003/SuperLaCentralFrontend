# Integración API Backend .NET

## Configuración Realizada

### 1. Variables de Entorno
- **environment.ts**: Configurado con `apiUrl: 'http://localhost:5000/api'`
- Ajusta el puerto según tu backend .NET

### 2. Servicio de Autenticación
Ubicación: `src/modules/auth/service/auth.service.ts`

Métodos disponibles:
- `login(credentials)`: Iniciar sesión
- `register(userData)`: Registrar usuario
- `logout()`: Cerrar sesión
- `isAuthenticated()`: Verificar autenticación
- `getCurrentUser()`: Obtener usuario actual
- `getToken()`: Obtener token JWT

### 3. Modelos
Ubicación: `src/modules/auth/models/auth.ts`

Interfaces:
- `LoginRequest`: { email, password }
- `RegisterRequest`: { name_user, lastname, email, password, rol_id }
- `AuthResponse`: Respuesta del backend
- `CurrentUser`: Usuario actual en la app

### 4. Interceptor JWT
Ubicación: `src/core/interceptors/auth.interceptor.ts`
- Agrega automáticamente el token JWT a todas las peticiones HTTP

### 5. Guard de Autenticación
Ubicación: `src/core/guards/auth.guard.ts`
- Protege rutas que requieren autenticación
- Redirige a login si no está autenticado

### 6. Componentes
- **LoginComponent**: `src/modules/auth/pages/login/`
- **RegisterComponent**: `src/modules/auth/pages/register/`

## Uso

### Ejemplo de Login
\`\`\`typescript
import { AuthService } from './modules/auth/service/auth.service';

constructor(private authService: AuthService) {}

login() {
  const credentials = {
    email: 'usuario@ejemplo.com',
    password: 'password123'
  };

  this.authService.login(credentials).subscribe({
    next: (response) => {
      console.log('Login exitoso:', response);
      // Redirigir al dashboard
    },
    error: (error) => {
      console.error('Error:', error);
    }
  });
}
\`\`\`

### Ejemplo de Registro
\`\`\`typescript
register() {
  const userData = {
    name_user: 'Juan',
    lastname: 'Pérez',
    email: 'juan@ejemplo.com',
    password: 'password123',
    rol_id: 2
  };

  this.authService.register(userData).subscribe({
    next: (response) => {
      console.log('Registro exitoso:', response);
      // Redirigir al dashboard
    },
    error: (error) => {
      console.error('Error:', error);
    }
  });
}
\`\`\`

### Proteger Rutas
\`\`\`typescript
import { authGuard } from './core/guards/auth.guard';

const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard] // Solo accesible si está autenticado
  }
];
\`\`\`

### Obtener Usuario Actual
\`\`\`typescript
// Método 1: Suscribirse al Observable
this.authService.currentUser$.subscribe(user => {
  console.log('Usuario actual:', user);
});

// Método 2: Obtener valor actual
const user = this.authService.getCurrentUser();
\`\`\`

## Endpoints del Backend

Asegúrate que tu backend .NET tenga estos endpoints:

- **POST** `/api/auth/login`
  - Body: { email, password }
  - Response: { message, data: { id_user, name_user, lastname, email, rol_name, token, expiration } }

- **POST** `/api/auth/register`
  - Body: { name_user, lastname, email, password, rol_id }
  - Response: { message, data: { id_user, name_user, lastname, email, rol_name, token, expiration } }

## Configuración del Backend

Tu backend está correctamente configurado con:
- ✅ CORS para localhost:4200
- ✅ JWT Authentication
- ✅ AuthService y UserService

## Próximos Pasos

1. **Ajustar el puerto del API** en `environment.ts` si es necesario
2. **Configurar las rutas** en `app.routes.ts` para incluir las rutas de auth
3. **Ajustar el rol_id** por defecto en el RegisterComponent según tu base de datos
4. **Probar el login y registro** desde la aplicación Angular

## Rutas Configuradas

- `/auth/login` - Página de login
- `/auth/register` - Página de registro

## Notas Importantes

- El token se guarda en localStorage
- El token expira según la configuración de tu backend
- El interceptor agrega automáticamente el header `Authorization: Bearer {token}`
- El servicio verifica automáticamente si el token ha expirado
