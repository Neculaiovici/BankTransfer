import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { Account } from './models/account.interface';
import { Transfer } from './models/transfer.interface';

@Injectable({
  providedIn: 'root'
})
export class ServicesService {
 //url api
  private url = 'http://localhost:4200/api/client'
  constructor(private http: HttpClient) { }

  //get accounts
  getAccount(): Observable<Account>{
    return this.http.get<Account>(`${this.url}/robert@gmail.com`)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }


  //transfer money
  // terbuia sa faca legatura intre conturi dupa care sa faca modificarile pe amount !!!!!!!!!!!
  trensferMoney(fromEmail:string, toEmail:string, amount:string):Observable<any>{
    const body = {fromEmail: 'robert@gmail.com', toEmail: 'n@gmail.com', amount: 2}
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
    return this.http.post(`${this.url}/transfer`, body, {headers: headers, observe: 'response', reportProgress: true})
      .pipe(catchError(this.handleError));
  }
  // trensferMoney(fromEmail:string, toEmail:string, amount:string):Observable<any>{
  //   const body = {fromEmail: fromEmail, toEmail: toEmail, amount: amount}
  //   const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
  //   return this.http.post(`${this.url}/transfer`, body, {headers: headers, observe: 'response', reportProgress: true})
  //     .pipe(catchError(this.handleError));
  // }


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
