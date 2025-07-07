import { Component, OnInit, inject } from '@angular/core';
import { MoviesService } from '../servicios/movies.service';
import {
  IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle,
  IonContent, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle,
  IonCardSubtitle, IonCardContent, IonImg
} from '@ionic/angular/standalone';

import { RouterLink } from '@angular/router';
import { NgIf, NgFor } from '@angular/common';

@Component({
  selector: 'app-premiere',
  standalone: true,
  templateUrl: './premiere.page.html',
  styleUrls: ['./premiere.page.scss'],
  imports: [
    IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle,
    IonContent, IonGrid, IonRow, IonCol, IonCard, IonCardHeader,
    IonCardTitle, IonCardSubtitle, IonCardContent, IonImg,
    RouterLink, NgIf, NgFor
  ]
})
export class PremierePage implements OnInit {
  private moviesService = inject(MoviesService);
  estrenos: any[] = [];

  ngOnInit(): void {
    this.moviesService.peliculasEstreno().subscribe({
      next: (res: any) => {
        this.estrenos = res.results;
      },
      error: (err) => {
        console.error('Error cargando estrenos:', err);
      }
    });
  }
}
