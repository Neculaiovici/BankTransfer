import { Component, OnInit } from '@angular/core';
import { ServicesService } from '../services.service';
import { Account } from '../models/account.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpResponseBase } from '@angular/common/http';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss']
})
export class AccountsComponent implements OnInit {

  public account:any = []

  //transfer form
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

  //create form
  accounts: FormGroup = this.fb.group({
    'email': ['', Validators.compose([
      Validators.minLength(5),
      Validators.maxLength(20),
      Validators.email,
      Validators.required
    ])],
    'fullName': 
    ['', Validators.compose([
      Validators.minLength(5),
      Validators.maxLength(20),
      Validators.email,
      Validators.required
    ])],
    'exp':
    ['', Validators.compose([
      Validators.minLength(1),
      Validators.maxLength(10),
      Validators.required
    ])],
    'balance':
    ['', Validators.compose([
      Validators.minLength(1),
      Validators.maxLength(10),
      Validators.required
    ])]
  })

  constructor(private fb: FormBuilder,private services: ServicesService) { }

  ngOnInit(): void {
    this.GetAllAccounts()
    console.log(this.account)
  }

  //get all accounts
  GetAllAccounts(){
    this.services.getAccount().subscribe((data:Account) => {
      this.account = data,
      localStorage.setItem('accounts', JSON.stringify(data))
    })
  }

  //transfer
  submit(){
    const fromEmail = this.transferFC.value.fromEmail
    const toEmail = this.transferFC.value.toEmail
    const amount = this.transferFC.value.amount
    return this.services.trensferMoney(fromEmail, toEmail, amount).subscribe( () => {
      this.GetAllAccounts(), //view refresh
      this.handleError
    })
  }

  // create account
  create() {
    const email = this.accounts.value.email
    const fullName = this.accounts.value.fullName
    const exp = this.accounts.value.exp
    const balance = Number(this.accounts.value.balance)

    return this.services.createAccount(email, fullName, exp, balance).subscribe( () => {
      this.GetAllAccounts(), //view refresh
      this.handleError
    })
  }

  //error handler
  private handleError(error: HttpResponseBase | Error): void {
    console.log(error)
    if (error instanceof HttpResponseBase)
      if (error.status == 401)
        throw Error("Invalid email, amount combination")
    throw error
  }
}
