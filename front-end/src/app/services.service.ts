import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Account } from './models/account.interface';

@Injectable({
  providedIn: 'root'
})
export class ServicesService {
 //url api
  private url = 'https://localhost:7083/api/client'
  constructor(private http: HttpClient) { }

  //get accounts
  getAccount(): Observable<Account>{
    return this.http.get<Account>(`${this.url}/robert@gmail.com`)
  }
  //transfer money
  //error
}
