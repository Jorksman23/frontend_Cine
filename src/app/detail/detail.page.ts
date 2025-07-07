import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonChip, IonLabel, IonIcon, IonItem, IonList, IonCardContent, IonCardSubtitle, IonCardTitle, IonCardHeader, IonCard, IonButton, IonBackButton, IonButtons, IonInput } from '@ionic/angular/standalone';
import { MoviesService } from '../servicios/movies.service';
import { ActivatedRoute } from '@angular/router';
import { addOutline, sendOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
  standalone:true,
  imports: [IonInput, IonButtons, IonBackButton, IonButton, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonList, IonItem, IonIcon, IonLabel, IonChip, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class DetailPage implements OnInit {

 private serviceMovies = inject(MoviesService);
 private activatedRoute = inject(ActivatedRoute);
  idMovie !: string;
  detailsMovie !: any;
  //comments !: getComments;
  stateComment !: boolean;

  constructor() {
    this.idMovie = this.activatedRoute.snapshot.paramMap.get('id')?.toString()!;
    addIcons({addOutline,sendOutline,});
   }

  ngOnInit() {
    this.getMovieDetails(this.idMovie);
    this.getComments();
  }

  getComments() {
    this.serviceMovies.getComments(444).subscribe({
      next: (response) => {
        console.log('Comentarios obtenidos:', response);
      },
      error: (error:any) => {
        console.error('Error al obtener los comentarios:', error);
      }
    })
  }
  setstateComment(){
    this.stateComment = !this.stateComment;
    console.log(this.stateComment);
  }

  getMovieDetails(codeMovie:string) {
    this.serviceMovies.getMovieDetails(codeMovie).subscribe({
      next: (datos:any) => {
        this.detailsMovie = datos;
        console.log(datos);
      },
      error: (error:any) => {
        console.error(error);
      }
    })
  }

}
