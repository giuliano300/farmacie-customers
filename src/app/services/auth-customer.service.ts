import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { SessionService } from './session.service';
import { administrator } from '../interfaces/administrator';
import { CustomersService } from './customers.service';
import { customers } from '../interfaces/customer';

@Injectable({
  providedIn: 'root',
})
export class AuthCustomerService {
  private customerSubject: BehaviorSubject<customers | null> = new BehaviorSubject<customers | null>(null);
  public customer$: Observable<customers | null> = this.customerSubject.asObservable(); // Observable che i componenti possono sottoscrivere

  constructor(private router: Router, private sessionService: SessionService, private customerService: CustomersService) {
    // Recupera l'utente dal sessionStorage se presente
    const storedCustomer = this.sessionService.getUser();
    if (storedCustomer) this.customerSubject.next(storedCustomer);
  }

  login(customer: customers): void {
    this.sessionService.saveUser(customer); 
    this.customerSubject.next(customer); // Notifica ai sottoscrittori che customer è loggato
  }

  logout(): void {
    this.sessionService.clearUser();
    this.customerSubject.next(null);
  }
}
