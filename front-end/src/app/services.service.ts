import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { Account } from './models/account.interface';


@Injectable({
  providedIn: 'root'
})
export class ServicesService {
 //url api
  private url = 'http://localhost:4200/api/client';

  constructor(private http: HttpClient) { }

  //get accounts
  getAccount(): Observable<Account>{
    return this.http.get<Account>(`${this.url}/getAll`)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }

  //create account
  createAccount(email:string, fullName:string, exp:string, balance:number):Observable<any>{
    const body = {email: email, fullName: fullName, exp: exp, balance: balance}
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
    return this.http.post(`${this.url}/`, body, {headers: headers, observe: 'response', reportProgress: true})
      .pipe(catchError(this.handleError));
  }

  //transfer money
  trensferMoney(fromEmail:string, toEmail:string, amount:string):Observable<any>{
    const body = {fromEmail: fromEmail, toEmail: toEmail, amount: amount}
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
    return this.http.post(`${this.url}/transfer`, body, {headers: headers, observe: 'response', reportProgress: true})
      .pipe(catchError(this.handleError));
  }

  //error
  handleError(error: any){
    let errorMessage = '';
    if(error.error instanceof ErrorEvent){
      errorMessage = error.error.message
    } else{
      errorMessage = `Error cod: ${error.status}\nMessage: ${error.message}`
    }
    window.alert(errorMessage)
    return throwError(errorMessage)
  }
}
