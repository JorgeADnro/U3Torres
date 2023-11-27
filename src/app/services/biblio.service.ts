import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Libro } from '../models/libro';
import { Usuario } from '../models/usuario';
const requestOptions = {
    withCredentials: true,
  };

@Injectable({
  providedIn: 'root'
})
export class BiblioService {
  constructor(private http:HttpClient) {  }

  guardarLibro(libro: FormData): Observable<any> {
    return this.http.post('http://localhost:9000/api/lib', libro);
  }

  obtenerLibros(): Observable<any>{
    return this.http.get<any[]>('http://localhost:9000/api/libs',requestOptions);
  }

  obtenerLibro(id: string): Observable<any>{
    return this.http.get('http://localhost:9000/api/libs' + id);
  }

  agregarFavorito(libroId: number, libroTitl: String): Observable<any> {
    return this.http.post('http://localhost:9000/api/favoritos/agregar', { libroId, libroTitl }, requestOptions);
  }

}
