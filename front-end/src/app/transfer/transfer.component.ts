import { HttpResponseBase } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { switchMap } from 'rxjs';
import { Accounts } from '../accounts';
import { Account } from '../models/account.interface';
import { ServicesService } from '../services.service';

@Component({
  selector: 'app-transfer',
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.scss']
})
export class TransferComponent implements OnInit {
  
  transferFC: FormGroup = this.fb.group({
    'fromEmail': ['', Validators.compose([
      Validators.minLength(5),
      Validators.maxLength(20),
      Validators.email,
      Validators.required
    ])],
    'toEmail': 
    ['', Validators.compose([
      Validators.minLength(5),
      Validators.maxLength(20),
      Validators.email,
      Validators.required
    ])],
    'amount':
    ['', Validators.compose([
      Validators.minLength(1),
      Validators.maxLength(10),
      Validators.required
    ])]
  })

  constructor(private fb: FormBuilder,private services: ServicesService) { }

  ngOnInit(): void {
    
  }

  //refreshList
  refreshAccountList(){
    
  }

  submit(){
    const fromEmail = this.transferFC.value.fromEmail
    const toEmail = this.transferFC.value.toEmail
    const amount = this.transferFC.value.amount
    return this.services.getAccount().subscribe((data: Account) => {
      if(data.email = fromEmail){
        this.services.trensferMoney(fromEmail, toEmail, amount).subscribe(this.handleError)
      }else{
        console.log("bad!!!!")
      }
    })
    
    // this.services.trensferMoney(fromEmail, toEmail, amount).subscribe(
    //   this.handleError
    // )
  }

  private handleError(error: HttpResponseBase | Error): void {
    console.log(error)
    if (error instanceof HttpResponseBase)
      if (error.status == 401)
        throw Error("Invalid email, amount combination")
    throw error
  }
}
