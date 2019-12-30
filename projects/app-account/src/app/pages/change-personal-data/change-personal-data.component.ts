import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SharedService } from '@app-account/services/shared.service';
import { HyperToastsService, BroadcastEventService } from 'lib-services';

const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PHONE_REGEX = /^(?:(?:\+|00)?(55)\s?)?(?:\(?([1-9][0-9])\)?\s?)?(?:((?:9\d|[2-9])\d{3})\-?(\d{4}))$/;
const REGEX_ONLY_NYMBERS = /^[0-9]*$/;

@Component({
  selector: 'app-account-change-personal-data',
  templateUrl: './change-personal-data.component.html',
  styleUrls: ['./change-personal-data.component.less']
})
export class ChangePersonalDataComponent implements OnInit {

  public loading = false;
  public maskPhone;
  public registerForm;
  constructor(
    private _sharedService: SharedService,
    private _messageService: HyperToastsService,
  ) { }

  ngOnInit() {

    this.mountMaskPhone();
    this.getUserData();

    BroadcastEventService.event('onBreadCrumb').emit(
      [
        { 'text': 'Minha Conta', 'router': '/home' },
        { 'text': 'Meus Dados', 'router': '/personal-data' },
        { 'text': 'Editar meus dados', 'router': '' }
      ]
    );

  }

  mountRegisterForm(obj) {
    this.registerForm = new FormGroup({
      name: new FormControl(
        { value: obj.name, disabled: false }, Validators.compose([Validators.required])
      ),
      mail: new FormControl(
        { value: obj.mail, disabled: true }, Validators.compose([Validators.required, Validators.pattern(EMAIL_REGEX)])
      ),
      username: new FormControl(
        { value: obj.username, disabled: false }, Validators.compose([Validators.required])
      ),
      language: new FormControl(
        { value: obj.language, disabled: false }, Validators.compose([Validators.required])
      ),
      gender: new FormControl(
        { value: obj.gender, disabled: false }, Validators.compose([Validators.required])
      ),
      socialSecurity: new FormControl(
        { value: obj.socialSecurity, disabled: false }, Validators.compose([Validators.required])
      ),
      phoneNumber: new FormControl(
        { value: obj.phoneNumber, disabled: false }, Validators.compose([Validators.required, Validators.pattern(PHONE_REGEX)])
      ),
      birthDate: new FormControl(
        { value: obj.birthDate, disabled: false }, Validators.compose([Validators.required])
      ),
      professionalTitle: new FormControl(
        { value: obj.professionalTitle, disabled: false }, Validators.compose([Validators.required])
      ),
      password: new FormControl(
        { value: '************', disabled: false }, Validators.compose([Validators.required, Validators.minLength(6)])
      ),
      conf_password: new FormControl(
        { value: '************', disabled: false }, Validators.compose([Validators.required, Validators.minLength(6)])
      ),
      aboutYou: new FormControl(
        { value: obj.aboutYou, disabled: false }, Validators.compose([Validators.required])
      )
    });
  }

  getUserData() {
    this.loading = true;
    this._sharedService.getUserProfile().subscribe(
      (response: any) => {
        if (response.return === true) {
          this.loading = false;
          this.mountRegisterForm(response.data);
        } else {
          this.loading = false;
          this._messageService.addToast('warn', 'Atenção!', response.msg);
        }
      },
      err => {
        this.loading = false;
        this._messageService.addToast('error', 'Erro!', err);
      });
  }

  mountMaskPhone() {
    this.maskPhone = function (rawValue) {
      const numbers = rawValue.match(/\d/g);
      let numberLength = 0;
      if (numbers) {
        numberLength = numbers.join('').length;
      }

      if (numberLength > 10) {
        return ['(', /[1-9]/, /[1-9]/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
      } else {
        return ['(', /[1-9]/, /[1-9]/, ')', ' ', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
      }
    };
  }

  checkUserName(evt) {
    this._sharedService.checkUsernameExists(evt).subscribe(
      (response: any) => {
        if (response.return === true) {
          if (response.exists === 'Y') {
            this.registerForm.controls.username.setErrors({ 'usernameExists': true });
          }
        } else {
          this._messageService.addToast('warn', 'Atenção!', response.msg);
        }
      },
      err => { this._messageService.addToast('error', 'Erro!', err); }
    );
  }

  submitChange() {
    // if (this.registerForm.controls.password.value !== this.registerForm.controls.conf_password.value) {
    //   this.registerForm.controls.password.setErrors({ 'mismatch': true });
    //   this.registerForm.controls.conf_password.setErrors({ 'mismatch': true });
    // }

    if (this.registerForm.valid) {
      this._sharedService.updatePersonalData(this.registerForm.value).subscribe(
        (response: any) => {
          if (response.return === true) {
            this._messageService.addToast('success', 'Sucesso!', response.msg);
          } else {
            this._messageService.addToast('warn', 'Atenção!', response.msg);
          }
        },
        err => { this._messageService.addToast('error', 'Erro!', err); }
      );
    }
  }

}
