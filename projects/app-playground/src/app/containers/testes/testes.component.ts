import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-playground-testes',
  templateUrl: './testes.component.html',
  styleUrls: ['./testes.component.less']
})
export class TestesComponent implements OnInit {

  public cardForm: any;

  constructor() { }

  ngOnInit() {
    this.mountCardForm();
  }

  mountCardForm() {
    this.cardForm = new FormGroup({
      question: new FormControl(
        { value: '', disabled: false }, Validators.compose([Validators.required])
      )
    });
  }


  submitCard() {
    console.log(this.cardForm.value);
  }

}
