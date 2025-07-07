// ✅ home.page.ts mejorado con scroll infinito en todos los filtros y sin errores de cambio
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar,
  IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent,
  IonGrid, IonRow, IonCol, IonInfiniteScroll, IonInfiniteScrollContent,
  IonButtons, IonButton, IonIcon, IonPopover, IonList, IonItem, IonLabel, IonText,
  IonSelect, IonSelectOption, AlertController
} from '@ionic/angular/standalone';

import { NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MoviesService } from '../servicios/movies.service';
import { addIcons } from 'ionicons';
import {
  homeOutline, playCircle, radio, search,
  personCircleOutline, logOutOutline, personOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar,
    IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent,
    IonGrid, IonRow, IonCol, IonInfiniteScroll, IonInfiniteScrollContent,
    IonButtons, IonButton, IonIcon, IonPopover, IonList, IonItem, IonLabel, IonText,
    IonSelect, IonSelectOption, RouterLink, NgIf, NgFor, FormsModule
  ]
})
export class HomePage implements OnInit {
  private moviesService = inject(MoviesService);
  private router = inject(Router);
  private alertController = inject(AlertController);

  username: string = '';
  terminoActual: string = '';
  paginaBusqueda: number = 1;
  buscando: boolean = false;
  searchResults: any[] = [];
  totalPages: number = Infinity;

  tipoBusqueda: string = 'pelicula';
  generoSeleccionado: string = '';
  listaGeneros: any[] = [];

  ultimoTipoBusqueda: string = '';
  ultimoGenero: string = '';
  ultimoTermino: string = '';

  constructor() {
    addIcons({
      homeOutline,
      playCircle,
      radio,
      search,
      personCircleOutline,
      logOutOutline,
      personOutline
    });
  }

  ngOnInit(): void {
    this.moviesService.getGenres().subscribe((res: any) => {
      this.listaGeneros = res.genres;
    });
  }

  ionViewWillEnter(): void {
    this.username = localStorage.getItem('user') || '';
  }

  async logout() {
    const alert = await this.alertController.create({
      header: 'Cerrar sesión',
      message: '¿Estás seguro de que deseas cerrar sesión?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Cerrar sesión',
          handler: () => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            this.router.navigate(['/login']);
          }
        }
      ]
    });
    await alert.present();
  }

  searchMovies(nombre: any, event?: any) {
    const nuevoTermino = nombre?.value?.trim() || this.terminoActual;
    const tipoCambiado = this.tipoBusqueda !== this.ultimoTipoBusqueda;
    const generoCambiado = this.generoSeleccionado !== this.ultimoGenero;
    const terminoCambiado = nuevoTermino !== this.ultimoTermino;

    const nuevaBusqueda = tipoCambiado || generoCambiado || terminoCambiado;

    if (nuevaBusqueda) {
      this.terminoActual = nuevoTermino;
      this.paginaBusqueda = 1;
      this.searchResults = [];
      this.totalPages = Infinity;

      this.ultimoTipoBusqueda = this.tipoBusqueda;
      this.ultimoGenero = this.generoSeleccionado;
      this.ultimoTermino = nuevoTermino;

      const scroll = document.querySelector('ion-infinite-scroll');
      if (scroll) (scroll as any).disabled = false;
    }

    if (this.tipoBusqueda === 'genero' && !this.generoSeleccionado) return;
    if ((this.tipoBusqueda === 'pelicula' || this.tipoBusqueda === 'actor') && !this.terminoActual) {
      this.searchResults = [];
      if (event?.target) event.target.complete();
      return;
    }

    if (this.paginaBusqueda > this.totalPages) {
      if (event?.target) event.target.disabled = true;
      return;
    }

    this.buscando = true;

    let busqueda$;
    if (this.tipoBusqueda === 'pelicula') {
      busqueda$ = this.moviesService.searchMovies(this.terminoActual, this.paginaBusqueda);
    } else if (this.tipoBusqueda === 'actor') {
      busqueda$ = this.moviesService.searchActors(this.terminoActual, this.paginaBusqueda);
    } else {
      busqueda$ = this.moviesService.searchByGenre(this.generoSeleccionado, this.paginaBusqueda);
    }

    busqueda$.subscribe({
      next: (datos: any) => {
        this.totalPages = datos.total_pages || this.totalPages;

        let resultados = this.tipoBusqueda === 'actor'
          ? datos.results.flatMap((actor: any) => actor.known_for || [])
          : datos.results;

        resultados = resultados.filter((item: any) =>
          !this.searchResults.some((r: any) => r.id === item.id)
        );

        if (resultados.length > 0) {
          this.searchResults = [...this.searchResults, ...resultados];
          this.paginaBusqueda++;
        } else if (event?.target) {
          event.target.disabled = true;
        }

        if (event?.target) event.target.complete();
        this.buscando = false;
      },
      error: err => {
        console.error('Error en la búsqueda', err);
        if (event?.target) event.target.complete();
        this.buscando = false;
      }
    });
  }
}
