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
  private url = 'https://localhost:7083/api/client'
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
  trensferMoney(transfer: Transfer):Observable<any>{
    const body  = JSON.stringify(transfer);
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
    // let formData = new FormData();
    // formData.append('fromEmail', transfer.FromEmail);
    // formData.append('toEmail', transfer.ToEmail);
    // formData.append('amount', transfer.Amount)

    return this.http.post(`${this.url}/transfer`, body, {headers: headers, observe: 'response'})
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
