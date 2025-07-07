import { Component, OnInit } from '@angular/core';
import { MoviesService } from '../servicios/movies.service';
import { 
  
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonList, 
  IonItem, 
  IonThumbnail, 
  IonLabel, 
  IonImg, 
  IonSpinner, IonInfiniteScroll, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonInfiniteScrollContent, IonGrid, IonCol, IonRow } from '@ionic/angular/standalone';
import { NgIf, NgFor } from '@angular/common';
@Component({
  selector: 'app-cartelera',
   imports: [IonRow, IonCol, IonGrid, IonInfiniteScrollContent, IonCardContent, IonCardTitle, IonCardHeader, IonCard, IonInfiniteScroll, 
    
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonThumbnail,
    IonLabel,
    IonImg,
    IonSpinner,
    NgIf,
    NgFor
  ],
  templateUrl: './cartelera.page.html',
  styleUrls: ['./cartelera.page.scss'],
})
export class CarteleraPage implements OnInit {

  peliculas: any[] = [];
  pagina = 1;
  cargando = false;
  hasMore = true;

  constructor(private moviesService: MoviesService) {}

  ngOnInit() {
    this.cargarPeliculas();
  }

  cargarPeliculas(event?: any) {
    if (!this.hasMore) {
      if (event) event.target.disabled = true;
      return;
    }

    this.cargando = true;
    this.moviesService.peliculasCartelera(this.pagina).subscribe({
      next: (data: any) => {
        console.log(data)
        if (data.results.length === 0) {
          this.hasMore = false;
          if (event) event.target.disabled = true;
        } else {
          this.peliculas = [...this.peliculas, ...data.results];
          this.pagina++;
          if (event) event.target.complete();
        }
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar las películas', err);
        if (event) event.target.complete();
        this.cargando = false;
      }
    });
  }
}
