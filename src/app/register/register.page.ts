import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonItem,
  IonIcon,
  IonText,
  IonInput,
  IonButton,
  IonCard,
  IonCardContent
} from '@ionic/angular/standalone';

import { Router } from '@angular/router';
import { AuthService } from '../servicios/auth.service';

import {
  AlertController,
  LoadingController,
  ToastController
} from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [
    IonText,
    IonIcon,
    IonItem,
    IonInput,
    IonButton,
    IonContent,
    IonCard,
    IonCardContent,
    CommonModule,
    FormsModule
  ]
})
export class RegisterPage implements OnInit {

  // Variables del formulario
  username: string = '';
  email: string = '';
  password: string = '';
  showPassword: boolean = false;

  // Servicios inyectados
  private authService = inject(AuthService);
  private router = inject(Router);
  private loadingController = inject(LoadingController);
  private alertController = inject(AlertController);
  private toastController = inject(ToastController);

  constructor() {}

  ngOnInit() {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

 async register(user: any, email: any, password: any) {
  console.log(user, email, password);

  if (!user || !email || !password) {
    await this.showAlert('Error', 'Por favor completa todos los campos');
    return;
  }

  const loading = await this.loadingController.create({
    message: 'Registrando...',
    spinner: 'crescent'
  });

  await loading.present();

  this.authService.register(user, email, password).subscribe({
    next: async (response: any) => {
      await loading.dismiss();

      // ✅ GUARDAR token y usuario
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', response.users.user);

      await this.showToast('¡Registro exitoso!', 'success');
      this.router.navigate(['/tabs/home']);
    },
    error: async (error) => {
      await loading.dismiss();
      await this.showAlert('Error', error?.error?.message || 'No se pudo registrar');
    }
  });
}




  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  private async showToast(message: string, color: string = 'primary') {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color,
      position: 'bottom'
    });
    await toast.present();
  }

}
