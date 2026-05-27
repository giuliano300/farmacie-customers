import { Injectable } from '@angular/core';
import { API_URL } from '../../main';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FarmadatiUpdates } from '../interfaces/Farmadati-updates';
import { FarmadatiUpdatesWithCustomer } from '../interfaces/Farmadati-updates-with-customer';

@Injectable({
  providedIn: 'root'
})
export class FarmadatiUpdatesService {

    private apiUrl = API_URL + "farmadati-updates";
    
    constructor(private http: HttpClient) {}

    get(customerId: string):Observable<FarmadatiUpdatesWithCustomer[]>{
      return this.http.get<FarmadatiUpdatesWithCustomer[]>(`${this.apiUrl}?customerId=${customerId}`);
    }

    create(farmadatiUpdates: FarmadatiUpdates){
      return this.http.post(this.apiUrl, farmadatiUpdates);
    }

    delete(id: string):Observable<boolean>{
      return this.http.delete<boolean>(this.apiUrl + "/" + id);
    }

}
