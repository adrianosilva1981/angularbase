import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';

import { BroadcastEventService, HyperToastsService } from 'lib-services';
import { SharedService } from '@app-account/services/shared.service';
import { Router } from '@angular/router';

const REGEX_ONLY_NYMBERS = /^[0-9]*$/;

@Component({
  selector: 'app-account-add-new-credit-card',
  templateUrl: './add-new-credit-card.component.html',
  styleUrls: ['./add-new-credit-card.component.less']
})
export class AddNewCreditCardComponent implements OnInit {

  private currentYear = (new Date()).getFullYear();
  public listYears: any = [];
  public maskCardNumber = [/\d/, /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, /\d/];
  public months: any = [
    { name: 'Janeiro', value: 1 },
    { name: 'Fevereiro', value: 2 },
    { name: 'Março', value: 3 },
    { name: 'Abril', value: 4 },
    { name: 'Maio', value: 5 },
    { name: 'Junho', value: 6 },
    { name: 'Julho', value: 7 },
    { name: 'Agosto', value: 8 },
    { name: 'Setembro', value: 9 },
    { name: 'Outubro', value: 10 },
    { name: 'Novembro', value: 11 },
    { name: 'Dezembro', value: 12 }
  ];
  public registerForm = new FormGroup({
    name: new FormControl(
      { value: '', disabled: false }, Validators.compose([Validators.required])
    ),
    number_card: new FormControl(
      { value: '', disabled: false }, Validators.compose([Validators.required])
    ),
    month_card: new FormControl(
      { value: '', disabled: false }, Validators.compose([Validators.required])
    ),
    year_card: new FormControl(
      { value: '', disabled: false }, Validators.compose([Validators.required])
    ),
    csv_card: new FormControl(
      { value: '', disabled: false }, Validators.compose([Validators.required, Validators.pattern(REGEX_ONLY_NYMBERS)])
    )
  });

  constructor(
    private _sharedService: SharedService,
    public _dialog: MatDialog,
    private _messageService: HyperToastsService,
    private _router: Router
  ) { }

  ngOnInit() {
    this.mountListYear();
    BroadcastEventService.event('onBreadCrumb').emit(
      [
        { 'text': 'Minha Conta', 'router': '/home' },
        { 'text': 'Formas de Pagamento', 'router': '/my-credit-cards' },
        { 'text': 'Adicionar Cartão de crédito', 'router': '' }
      ]
    );
  }

  mountListYear() {
    for (let i = 0; i < 10; i++) {
      this.listYears[i] = this.currentYear + i;
    }
  }

  submitAddressForm() {
    if (this.registerForm.controls.number_card.value.indexOf('_') !== -1) {
      this.registerForm.controls.number_card.setErrors({ 'notValid': true });
    }

    if (this.registerForm.controls.name.value.indexOf(' ') === -1) {
      this.registerForm.controls.name.setErrors({ 'nameComplete': true });
    }

    if (this.registerForm.controls.csv_card.value.length < 3) {
      this.registerForm.controls.csv_card.setErrors({ 'min': true });
    }

    if (this.registerForm.valid) {
      this._sharedService.addCreditCard(this.registerForm.value).subscribe(
        (response: any) => {
          if (response.return === true) {
            // this.newCreditCardEvent.emit(this.registerForm.value);
            this._messageService.addToast('success', 'Sucesso!', 'Cartão cadastrado com sucesso.');
            this._router.navigate(['/my-credit-cards']);
          } else {
            this._messageService.addToast('warning', 'Atenção!', response.msg);
          }
        },
        err => { this._messageService.addToast('error', 'Erro!', err); }
      );
    }
  }

}
