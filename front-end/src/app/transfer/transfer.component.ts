import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Transfer } from '../models/transfer.interface';
import { ServicesService } from '../services.service';

@Component({
  selector: 'app-transfer',
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.scss']
})
export class TransferComponent implements OnInit {

  form: FormGroup = this.fb.group({
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
  transfer: Transfer | any;
  TransferMoney(){
    this.services.trensferMoney(this.transfer).subscribe( data => {console.log(data)}
    )
  }

}
