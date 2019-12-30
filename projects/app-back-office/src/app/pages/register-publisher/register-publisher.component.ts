import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SharedService } from '@app-back-office/services/shared.service';
import { HyperToastsService } from 'lib-services';

@Component({
  selector: 'app-back-office-register-publisher',
  templateUrl: './register-publisher.component.html',
  styleUrls: ['./register-publisher.component.less']
})
export class RegisterPublisherComponent implements OnInit {

  public CEPMASK = [/\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/];

  public CEP_REGEX: RegExp = /^[0-9]{5}-[0-9]{3}$/;

  public socialSelect = '';
  public quantitySelect = 0;
  public showError = false;

  public networks = [
    { label: 'Selecionar', value: null },
    { label: 'Facebook', value: 'facebook' },
    { label: 'Instagram', value: 'instagram' },
  ];

  public listSocialNetUser = [];

  public registerForm: FormGroup;

  constructor(
    private _sharedService: SharedService,
    private _hyperToastsService: HyperToastsService
  ) { }

  ngOnInit() {
    this.registerForm = new FormGroup({
      idResseller: new FormControl(
        { value: '', disabled: false }, Validators.required
      ),
      socialNet: new FormControl(
        { value: '', disabled: false }, Validators.required
      ),
      gender: new FormControl(
        { value: '', disabled: false }, Validators.required
      ),
      cep: new FormControl(
        { value: '', disabled: false }, Validators.pattern(this.CEP_REGEX)
      ),
      state: new FormControl(
        { value: '', disabled: false }, Validators.required
      ),
      city: new FormControl(
        { value: '', disabled: false }, Validators.required
      ),
      urlPerfil: new FormControl(
        { value: '', disabled: false }, Validators.required
      )
    });

    this._sharedService.getUserSocial(this._sharedService.getCookieReseller().id).subscribe(
      (response: any) => {
        if (response.return) {
          this.registerForm.setValue(response.data);
          response.data.socialNet.forEach(element => {
            this.socialSelect = element.socialNet;
            this.quantitySelect = element.quantity;
            this.addSocialNet();
          });
        }
      },
      error => { this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro inesperado. Atualize a página e tente novamente'); }
    );
  }

  getCEP() {
    if (this.registerForm.controls.cep.value !== '' && this.registerForm.controls.cep.valid) {
      this._sharedService.getCEP(this.registerForm.controls.cep.value).subscribe(
        (response: any) => {
          if (response.return) {
            this.registerForm.controls.state.setValue(response.data.uf);
            this.registerForm.controls.city.setValue(response.data.localidade);
          }
        }
      );
    }
  }

  addSocialNet() {
    const aux = this.listSocialNetUser.filter(x => x.socialNet === this.socialSelect);
    if (this.socialSelect != null && parseInt(this.quantitySelect.toString(), 10) > -1) {
      if (!aux.length) {
        this.listSocialNetUser.push({
          socialNet: this.socialSelect,
          quantity: this.quantitySelect
        });
      }
      this.showError = false;
    } else {
      this.showError = true;
    }
  }

  revomeSocialNet(index) {
    this.listSocialNetUser.splice(index, 1);
  }

  onSubmit() {
    this.registerForm.controls.socialNet.setValue(this.listSocialNetUser);
    this.registerForm.controls.idResseller.setValue(this._sharedService.getCookieReseller().id);
    if (this.registerForm.valid) {
      this._sharedService.addUserAds(this.registerForm.value).subscribe(
        (response: any) => {
          if (response.return) {
            this._hyperToastsService.addToast('success', 'Sucesso', response.msg);
          } else {
            this._hyperToastsService.addToast('warn', 'Atenção', response.msg);
          }
        },
        error => { this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro inesperado. Atualize a página e tente novamente'); }
      );
    }
  }
}
