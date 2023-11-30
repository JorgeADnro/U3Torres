import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ObserverServiceService {

  constructor(private http: HttpClient) { }

  private bookSubject = new Subject<string>();
  private bookSubscriptions = new Map<string, string[]>();
  private books: any[] = [];

  getBookObservable(): Observable<string> {
    return this.bookSubject.asObservable();
  }

  subscribeUserToBook(userId: string, userMail: string, bookId: string): Observable<any> {
    const url = `http://localhost:9000/api/libros/${bookId}/aggUsr?usuarioId=${userId}&usuarioCorreo=${userMail}`; // Reemplaza con el valor correcto del correo
    
    const existingSubscriptions = this.bookSubscriptions.get(bookId) || [];
    const updatedSubscriptions = [...existingSubscriptions, userMail];
    this.bookSubscriptions.set(bookId, updatedSubscriptions);
    return this.http.post(url, {});
  }

  eliminarUsr(userId: string, bookId: string): Observable<any> {
    const url = `http://localhost:9000/api/libros/${bookId}/eliminar-usr?usuarioId=${userId}`;
    return this.http.delete(url);
  }
  
  // Método para manejar la suscripción automática al agregar un favorito
  handleUserSubscriptionOnFavoriteAdd(userId: string,userMail: string, bookId: string) {
    this.subscribeUserToBook(userId,userMail, bookId);
  }

  handleUserUnSubscriptionOnFavoriteAdd(userId: string, bookId: string) {
    this.eliminarUsr(userId, bookId);
  }
  
}
