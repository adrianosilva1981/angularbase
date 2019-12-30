import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';

import { BroadcastEventService, HyperToastsService } from 'lib-services';
import { SharedService } from '@app-account/services/shared.service';
import { Address } from '@app-account/models/address';
import { DontKnowMyCepComponent } from '@app-account/componentes/dont-know-my-cep/dont-know-my-cep.component';
import { Router } from '@angular/router';

const REGEX_ONLY_NYMBERS = /^[0-9]*$/;
const REGEX_CEP = /^\d{2}\.?\d{3}-?\d{3}$/;

@Component({
  selector: 'app-account-add-new-addresses',
  templateUrl: './add-new-addresses.component.html',
  styleUrls: ['./add-new-addresses.component.less']
})
export class AddNewAddressesComponent implements OnInit {

  public cepAddresEmpty = true;

  public registerForm = new FormGroup({
    nickname: new FormControl(
      { value: '', disabled: false }, Validators.compose([Validators.required])
    ),
    zipCode: new FormControl(
      { value: '', disabled: false }, Validators.compose([Validators.required, Validators.pattern(REGEX_CEP)])
    ),
    address: new FormControl(
      { value: '', disabled: true }
    ),
    neighborhood: new FormControl(
      { value: '', disabled: true }
    ),
    state: new FormControl(
      { value: '', disabled: true }
    ),
    city: new FormControl(
      { value: '', disabled: true }
    ),
    number: new FormControl(
      { value: '', disabled: false }, Validators.compose([Validators.required, Validators.pattern(REGEX_ONLY_NYMBERS)])
    ),
    complement: new FormControl(
      { value: '', disabled: false }
    )
  });

  constructor(
    private _sharedService: SharedService,
    public _dialog: MatDialog,
    private _messageService: HyperToastsService,
    private _router: Router
  ) { }

  ngOnInit() {
    BroadcastEventService.event('onBreadCrumb').emit(
      [
        { 'text': 'Minha Conta', 'router': '/home' },
        { 'text': 'Meus Endereços', 'router': '/my-addresses' },
        { 'text': 'Adicionar endereço', 'router': '' }
      ]
    );
  }

  submitAddressForm() {

    if (this.registerForm.valid) {
      const objToRegister = new Address;

      objToRegister.nickname = this.registerForm.controls.nickname.value;
      objToRegister.zipCode = this.registerForm.controls.zipCode.value;
      objToRegister.state = this.registerForm.controls.state.value;
      objToRegister.city = this.registerForm.controls.city.value;
      objToRegister.neighborhood = this.registerForm.controls.neighborhood.value;
      objToRegister.address = this.registerForm.controls.address.value;
      objToRegister.number = this.registerForm.controls.number.value;
      objToRegister.complement = this.registerForm.controls.complement.value;

      // this._sharedService.pushAddress(objToRegister).subscribe(
      //   (response: any) => {
      //     this._messageService.addToast('success', 'Sucesso!', 'Endereço cadastrado com sucesso.');
      //     this._router.navigate(['/my-addresses']);
      //   },
      //   err => { this._messageService.addToast('error', 'Erro!', err); }
      // );

    }
  }

  clearSearch() {
    this.registerForm.controls.address.reset();
    this.registerForm.controls.neighborhood.reset();
    this.registerForm.controls.city.reset();
    this.registerForm.controls.state.reset();
    this.cepAddresEmpty = true;
  }

  searchCEP() {
    let cep = this.registerForm.controls.zipCode.value;

    cep = cep.replace(/\D/g, ''); //Remove todas as letras deixando somente numeros

    this._sharedService.getAddresByCEP(cep).subscribe(
      (response: any) => {
        this.registerForm.controls.address.setValue(response.logradouro);
        this.registerForm.controls.neighborhood.setValue(response.bairro);
        this.registerForm.controls.city.setValue(response.localidade);
        this.registerForm.controls.state.setValue(response.uf);
        this.registerForm.controls.zipCode.setValue(response.cep);
        this.cepAddresEmpty = false;
      },
      error => {
        this.registerForm.controls.zipCode.setErrors({ 'cepNotFound': true });
      }
    );
  }

  dontKnowCEP() {
    this.clearSearch();
    const dialogRef = this._dialog.open(DontKnowMyCepComponent, {
      data: 'parameters',
      panelClass: 'globalModalHJ'
    });

    dialogRef.afterClosed().subscribe(cep => {
      if (cep) {
        this.registerForm.controls.zipCode.setValue(cep);
        this.searchCEP();
      }
    });
  }


}
