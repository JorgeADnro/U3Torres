import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EMPTY, Observable, mergeMap, tap } from 'rxjs';
import { ObserverServiceService } from './observer-service.service'
import { Libro } from '../models/libro';
import { Usuario } from '../models/usuario';
import { UserService } from './user.service';
import { AuthService } from './auth.service';

const requestOptions = {
  withCredentials: true,
};

@Injectable({
  providedIn: 'root'
})
export class BiblioService {
  constructor(private http: HttpClient, private observerService: ObserverServiceService, private userService: UserService, private _authService: AuthService) { }

  guardarLibro(libro: FormData): Observable<any> {
    return this.http.post('http://localhost:9000/api/lib', libro);
  }

  obtenerLibros(): Observable<any> {
    return this.http.get<any[]>('http://localhost:9000/api/libs', requestOptions);
  }

  obtenerLibro(id: string): Observable<any> {
    return this.http.get('http://localhost:9000/api/libs' + id);
  }

  agregarFavorito(libroId: string, libroTitl: string): Observable<any> {
    const favoritoData = { libroId, libroTitl };

    // Obtén el ID del usuario actual desde el servicio de autenticación
    const usuarioId = this._authService.getUserId();
    const userMail = this._authService.getUserMail();
    console.log(userMail)

    if (!usuarioId || !userMail) {
      // Manejar el caso en el que usuarioId o userMail es null
      console.warn('El usuario no tiene un ID o correo válido.');
      // También podrías decidir no continuar y devolver un Observable vacío o manejarlo de otra manera según tus necesidades.
      return EMPTY;
    }

    // Llama al servicio de usuario para suscribir automáticamente al usuario al libro
    this.userService.subscribeUserToBookOnFavoriteAdd(usuarioId, userMail, libroId);

    return this.http.post('http://localhost:9000/api/favoritos/agregar', favoritoData, requestOptions).pipe(
      tap(() => {
        // Llama al servicio de Observer para suscribir automáticamente al usuario al libro
        this.observerService.handleUserSubscriptionOnFavoriteAdd(usuarioId, userMail, libroId);
      })
    );
  }

  verFavoritos(): Observable<{ libroId: string, libroTitl: string }[]> {
    return this.http.get<{ libroId: string, libroTitl: string }[]>('http://localhost:9000/api/favoritos/verFav');
  }

  eliminarFavorito(libroId: string): Observable<any> {
    const usuarioId = this._authService.getUserId();

    if (!usuarioId) {
      console.warn('El usuario no tiene un ID válido.');
      return EMPTY;
    }

    // Llama al servicio de Observer para desvincular automáticamente al usuario del libro
    this.observerService.handleUserUnSubscriptionOnFavoriteAdd(usuarioId, libroId);

    const url = `http://localhost:9000/api/favoritos/eliminar/${libroId}`;
    const url2 = `http://localhost:9000/api/libros/${libroId}/eliminar-usr?usuarioId=${usuarioId}`;

    // Realiza ambas solicitudes DELETE de manera concurrente
    return this.http.delete(url).pipe(
      mergeMap(() => this.http.delete(url2))
    );
  }

  getColonia(): Observable<any>{
    return this.http.get<any[]>('http://localhost:9000/api/libs/col',requestOptions);
  }
}

