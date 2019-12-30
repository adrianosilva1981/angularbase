import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { SharedService } from '@app-hyper-store/services/shared.service';
import { HyperToastsService } from 'lib-services';


const REGEX_ONLY_NYMBERS = /^[0-9]*$/;
const REGEX_CEP = /^\d{2}\.?\d{3}-?\d{3}$/;

@Component({
  selector: 'app-hyper-store-address-form',
  templateUrl: './address-form.component.html',
  styleUrls: ['./address-form.component.less']
})
export class AddressFormComponent implements OnInit {

  @Output() newAddressEvent: EventEmitter<any> = new EventEmitter();
  public cepAddresEmpty = true;
  public cepAdd;

  public registerForm = new FormGroup({
    zipcode: new FormControl(
      { value: '', disabled: false }, Validators.compose([Validators.required, Validators.pattern(REGEX_CEP)])
    ),
    street: new FormControl(
      { value: '', disabled: false }
    ),
    neighborhood: new FormControl(
      { value: '', disabled: false }
    ),
    country: new FormControl(
      { value: 'Brasil', disabled: false }
    ),
    state: new FormControl(
      { value: '', disabled: false }
    ),
    city: new FormControl(
      { value: '', disabled: false, }
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
    private _hyperToastsService: HyperToastsService
  ) { }

  ngOnInit() { }

  submitAddressForm() {
    if (this.registerForm.valid) {
      this._sharedService.addDeliveryAddress(this.registerForm.value).subscribe(
        (response: any) => {
          if (response.return) {
            const newAddres: any = response.data;
            this.newAddressEvent.emit(newAddres);
          } else {
            this._hyperToastsService.addToast('warn', 'Atenção', response.msg);
          }
        },
        err => { this._hyperToastsService.addToast('error', 'Erro', err); }
      );
    }
  }

  clearSearch() {
    this.registerForm.controls.street.reset();
    this.registerForm.controls.neighborhood.reset();
    this.registerForm.controls.city.reset();
    this.registerForm.controls.state.reset();
    this.cepAddresEmpty = true;
  }

  searchCEP() {
    let cep = this.registerForm.controls.zipcode.value;

    cep = cep.replace(/\D/g, ''); //Remove todas as letras deixando somente numeros

    this._sharedService.getAddresByCEP(cep).subscribe(
      (response: any) => {
        this.cepAdd = response;
        this.registerForm.controls.street.setValue(response.logradouro);
        this.registerForm.controls.neighborhood.setValue(response.bairro);
        this.registerForm.controls.city.setValue(response.localidade);
        this.registerForm.controls.state.setValue(response.uf);
        this.registerForm.controls.zipcode.setValue(response.cep);
        this.cepAddresEmpty = false;
      },
      error => {
        this.registerForm.controls.zipcode.setErrors({ 'cepNotFound': true });
      }
    );
  }

  onSearchCep(cep) {
    if (cep) {
      this.registerForm.controls.zipcode.setValue(cep);
      this.searchCEP();
    }
  }

}
