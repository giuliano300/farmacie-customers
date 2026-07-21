import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root' // Questo rende il servizio disponibile in tutta l'applicazione
})
export class SessionService {
  private userKey = 'user';
  userSubject = new BehaviorSubject<any | null>(this.readUser());
  adminSubject = new BehaviorSubject<any | null>(null);

  constructor() { }

  // Salva i dati dell'utente nella sessione
  saveUser(user: any): void {
    sessionStorage.setItem(this.userKey, JSON.stringify(user));
    this.userSubject.next(user);
  }

  // Recupera i dati dell'utente dalla sessione
  getUser(): any {
    return this.userSubject.value ?? this.readUser();
  }

  // Rimuove i dati dell'utente dalla sessione
  clearUser(): void {
    sessionStorage.removeItem(this.userKey);
    this.userSubject.next(null);
  }

  // Controlla se un utente è loggato
  isLoggedIn(): boolean {
    return this.getUser() !== null;
  }

  private readUser(): any {
    const user = sessionStorage.getItem(this.userKey);
    return user ? JSON.parse(user) : null;
  }
}
