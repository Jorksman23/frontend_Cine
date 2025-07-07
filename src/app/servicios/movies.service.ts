import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MoviesService {
  private http = inject(HttpClient);

  constructor() { }

    // API Key de TMDB
  private apiKey = '43bb95cae941badc90476b9f10f04134';
  private baseUrl = 'https://api.themoviedb.org/3/movie/upcoming';
// Lista los géneros disponibles
getGenres() {
  return this.http.get(`https://api.themoviedb.org/3/genre/movie/list?api_key=${this.apiKey}&language=es-ES`);
}

// Busca películas por un género específico (ID)
searchByGenre(genreId: string, page: number = 1) {
  return this.http.get(`https://api.themoviedb.org/3/discover/movie?api_key=${this.apiKey}&with_genres=${genreId}&language=es-ES&page=${page}`);
}

searchActors(nombre: string, page: number = 1) {
  return this.http.get(`https://api.themoviedb.org/3/search/person?api_key=${this.apiKey}&query=${nombre}&language=en-US&page=${page}&include_adult=false`);
}

   getPeliculasPorUrl(url: string) {
    return this.http.get<any>(url);
  }
peliculasEstreno(pagina: number = 1) {
  return this.http.get(`https://api.themoviedb.org/3/movie/now_playing?api_key=43bb95cae941badc90476b9f10f04134&language=en-US&page=${pagina}`);
}
  // Método para obtener las películas de la cartelera
 peliculasCartelera(pagina: number = 1) {
  return this.http.get(`${this.baseUrl}?api_key=${this.apiKey}&language=en-US&page=${pagina}`);
}

searchMovies(nombre: string, page: number = 1) {
  return this.http.get(`https://api.themoviedb.org/3/search/movie?api_key=${this.apiKey}&query=${nombre}&language=en-US&page=${page}&include_adult=false`);
}


  getMovieDetails(codeMovie:string) {
    return this.http.get(`https://api.themoviedb.org/3/movie/${codeMovie}?api_key=43bb95cae941badc90476b9f10f04134&language=en-US` );
  }

  saveComments(user_id:number, movie_id:number, comment:string) {
    const token=localStorage.getItem('token');
    const headers={'Authorization':`Bearer ${token}`};
    return this.http.get('http://localhost:3000/api/comment'+movie_id,{headers:headers});
    }
  getComments(movie_id:number) {
    const token=localStorage.getItem('token');
    const headers={'Authorization':`Bearer ${token}`};
    return this.http.get(`http://localhost:3000/api/comment/${movie_id}`, {headers:headers});
  }
}
