import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonIcon, IonText, IonCard, IonCardContent, IonItem, IonButton, IonInput, IonButtons } from '@ionic/angular/standalone';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../servicios/auth.service';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { IUserLogin } from '../interface/IUsers';
import { MoviesService } from '../servicios/movies.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonButtons, IonInput, IonButton, IonItem, IonCardContent, IonCard, IonText, IonIcon, IonContent, RouterModule, CommonModule, FormsModule]
})
export class LoginPage implements OnInit {
  showPassword: boolean = false;
  private authService = inject(AuthService);
  private router = inject(Router);
  private loadingController = inject(LoadingController);
  private alertController = inject(AlertController);
  private toastController = inject(ToastController);
  private moviesService = inject(MoviesService);
  loading: any;

  constructor() { }

  ngOnInit() {
    this.getPeliculas();
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  async showLoading() {
    this.loading = await this.loadingController.create({
      message: 'Iniciando sesión...',
      spinner: 'crescent',
    });
    this.loading.present();
  }

  async presentAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Mensaje',
      message: message,
      buttons: ['OK'],
    });
    await alert.present();
  }

  async presentToast(message: string = 'Bienvenid@s, a Movies App', color: string = 'primary') {
    const toast = await this.toastController.create({
      message,
      duration: 1500,
      position: 'bottom',
      color
    });
    await toast.present();
  }

  getPeliculas() {
    this.moviesService.peliculasCartelera().subscribe(
      (data) => {
        console.log('Películas cargadas:', data);
      },
      (error) => {
        console.error('Error al obtener las películas:', error);
      }
    );
  }

 async login(emailInput: IonInput, passwordInput: IonInput) {
  const email = (await emailInput.getInputElement()).value.trim().toLowerCase();
  const password = (await passwordInput.getInputElement()).value.trim();

  if (!email || !password) {
    await this.presentAlert('Por favor ingresa tu correo y contraseña.');
    return;
  }

  this.showLoading();
  this.authService.login(email, password).subscribe({
    next: (response: IUserLogin) => {
      console.log('Login exitoso:', response);
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', response.dataUser.user);
      localStorage.setItem('userType', response.dataUser.typeusers_id.toString());

      this.router.navigate(['/tabs/home']);
      this.loading.dismiss();
      this.presentToast();
    },
    error: (error) => {
      this.loading.dismiss();
      this.presentAlert(error.error.message);
      console.error('Error en el login:', error);
    }
  });
}

  async signInWithGoogle() {
    const loading = await this.loadingController.create({
      message: 'Conectando con Google...',
      spinner: 'crescent',
    });
    await loading.present();
    try {
      await this.simulateAPICall();
      await loading.dismiss();
      await this.presentToast('¡Conectado con Google!', 'success');
      this.router.navigate(['/tabs/home']);
    } catch (error) {
      await loading.dismiss();
      await this.presentAlert('No se pudo conectar con Google. Inténtalo de nuevo.');
    }
  }

  async forgotPassword() {
    const alert = await this.alertController.create({
      header: 'Recuperar Contraseña',
      inputs: [
        {
          name: 'email',
          type: 'email',
          placeholder: 'Ingresa tu email'
        }
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Enviar',
          handler: async (data) => {
            if (data.email && this.isValidEmail(data.email)) {
              await this.presentToast('Email de recuperación enviado', 'success');
            } else {
              await this.presentAlert('Por favor ingresa un email válido');
            }
          }
        }
      ]
    });
    await alert.present();
  }

  goToSignUp() {
    this.router.navigate(['/register']);
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private async simulateAPICall(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(), 2000);
    });
  }

  async logoutConfirm() {
    const alert = await this.alertController.create({
      header: 'Cerrar sesión',
      message: '¿Estás seguro de que deseas cerrar sesión?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Cerrar sesión',
          handler: () => {
            localStorage.clear();
            this.router.navigate(['/login']);
          }
        }
      ]
    });
    await alert.present();
  }
}
