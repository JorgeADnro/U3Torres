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

  bookChanged$: Observable<string> = this.bookSubject.asObservable();

  subscribeUserToBook(userId: string, userMail: string, bookId: string): Observable<any> {
    const url = `http://localhost:9000/api/libros/${bookId}/aggUsr?usuarioId=${userId}&usuarioCorreo=${userMail}`; // Reemplaza con el valor correcto del correo
    
    const existingSubscriptions = this.bookSubscriptions.get(bookId) || [];
    const updatedSubscriptions = [...existingSubscriptions, userMail];
    this.bookSubscriptions.set(bookId, updatedSubscriptions);
    return this.http.post(url, {});

    
  }

  // Método para notificar cambios en un libro
  notifyBookChanged(bookId: string, userMails: any[]) {
    this.bookSubject.next(bookId);
    
    // Notificar a usuarios específicos por correo electrónico
    userMails.forEach(user => {
      // Asegúrate de que user es un objeto antes de intentar acceder a sus propiedades
      if (user && user.usuarioCorreo) {
        console.log(`Notificar a ${user.usuarioCorreo} sobre el cambio en el libro ${bookId}`);
      }
    });
  }
  
  // Método para manejar la suscripción automática al agregar un favorito
  handleUserSubscriptionOnFavoriteAdd(userId: string,userMail: string, bookId: string) {
    this.subscribeUserToBook(userId,userMail, bookId);
  }

  obtenerUsuariosSuscritos(libroId: string): Observable<any[]> {
    const url = `http://localhost:9000/api/libros/${libroId}/usuariosSuscritos`;
    return this.http.get<any[]>(url);
  }
  
}
