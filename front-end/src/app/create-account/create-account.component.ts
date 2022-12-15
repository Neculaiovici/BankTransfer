import { HttpResponseBase } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServicesService } from '../services.service';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.scss']
})
export class CreateAccountComponent implements OnInit {

  constructor(private fb: FormBuilder, private services: ServicesService) { }

  ngOnInit(): void {
  }

  account: FormGroup = this.fb.group({
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

  submit() {
    const email = this.account.value.email
    const fullName = this.account.value.fullName
    const exp = this.account.value.exp
    const balance = this.account.value.balance
    return this.services.createAccount(email, fullName, exp, balance).subscribe(
      this.handleError
    )
  }

  private handleError(error: HttpResponseBase | Error): void {
    console.log(error)
    if (error instanceof HttpResponseBase)
      if (error.status == 401)
        throw Error("Invalid email, amount combination")
    throw error
  }
} 