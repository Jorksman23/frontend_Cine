import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NoAuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('token');

    if (token) {
      // Si ya hay sesión activa, redirige al home
      this.router.navigate(['/tabs/home']);
      return false;
    }

    return true; // Puede acceder si no está logueado
  }
}
