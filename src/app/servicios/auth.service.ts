import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IUserLogin, IUserRegister } from '../interface/IUsers';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
 private http = inject(HttpClient);

  constructor() { }

 login(email: string, password: string) {
  console.log('Enviando login con:', { email, password });
  return this.http.post<IUserLogin>('http://localhost:3000/api/login', { email, password });
}

  register(user:string,email: string, password: string) {
    console.log('aqui es el servicio'+user,email,password)
    return this.http.post('http://localhost:3000/api/register', {user, email, password });
  }
}


