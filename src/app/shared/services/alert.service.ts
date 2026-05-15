import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  success(title: string, text?: string) {
    return Swal.fire({
      icon: 'success',
      title,
      text,
      confirmButtonColor: '#1e1b4b'
    });
  }

  error(title: string, text?: string) {
    return Swal.fire({
      icon: 'error',
      title,
      text,
      confirmButtonColor: '#dc2626'
    });
  }

  warning(title: string, text?: string) {
    return Swal.fire({
      icon: 'warning',
      title,
      text,
      confirmButtonColor: '#f59e0b'
    });
  }

  confirm(title: string, text?: string) {
    return Swal.fire({
      icon: 'question',
      title,
      text,
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#1e1b4b'
    });
  }

  loading(title: string = 'Procesando...') {
    return Swal.fire({
      title,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
  }

  close() {
    Swal.close();
  }
}