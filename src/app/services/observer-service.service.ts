import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ObserverServiceService {

  constructor() { }

  private bookSubject = new Subject<string>();

  subscribeUserToBook(userId: string, bookId: string) {
    // Lógica para suscribir al usuario al libro
    console.log(`Usuario ${userId} suscrito al libro ${bookId}`);
  }

  // Método para notificar cambios en un libro
  notifyBookChanged(bookId: string) {
    this.bookSubject.next(bookId);
  }
}
