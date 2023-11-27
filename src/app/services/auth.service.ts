import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../models/usuario';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Libro } from '../models/libro';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private router: Router) {  }

  registrarUsuario(usuario: Usuario): Observable<any> {
    return this.http.post('http://localhost:9000/api/signup', usuario);
  }

  loguearUsuario(usuario: Usuario): Observable<any> {
    return this.http.post('http://localhost:9000/api/signin', usuario);
  }

  obtenerUsuario(): Observable<Usuario> {
    return this.http.get<Usuario>('http://localhost:9000/api/info');
  }

  verFavoritos(): Observable<Usuario> {
    return this.http.get<Usuario>('http://localhost:9000/api/favoritos/verFav');
  }

  loggedIn() {
    return !!localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/']);
    Swal.fire({
      title: "Adiós!",
      text: "Ha salido de su cuenta correctamente",
      icon: "success"
    });
  }

  getToken() {
    return localStorage.getItem('token');
  }

}
