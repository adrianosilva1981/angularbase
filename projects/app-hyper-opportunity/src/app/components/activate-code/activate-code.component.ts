import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { SharedService } from '@app-hyper-opportunity/services/shared.service';
import { HyperToastsService, HyperCookieService, BroadcastEventService } from 'lib-services';

const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PHONE_REGEX = /^\([0-9]{2}\) 9\d{4}-\d{4}|\((?:1[2-9]|[2-9]\d)\) [1-9]\d{3}-\d{4}$/;

@Component({
  selector: 'app-hyper-opportunity-activate-code',
  templateUrl: './activate-code.component.html',
  styleUrls: ['./activate-code.component.less']
})
export class ActivateCodeComponent implements OnInit {

  public viewForm = 'gift';
  public maskPhone;
  public maskGift = [/\d/, /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, /\d/];
  public registerForm = new FormGroup({
    name: new FormControl(
      { value: '', disabled: false }, Validators.compose([Validators.required, Validators.minLength(5)])
    ),
    email: new FormControl(
      { value: '', disabled: false }, Validators.compose([Validators.required, Validators.pattern(EMAIL_REGEX)])
    ),
    phone: new FormControl(
      { value: '', disabled: false }, Validators.compose([Validators.required, Validators.pattern(PHONE_REGEX)])
    ),
    password: new FormControl(
      { value: '', disabled: false }, Validators.compose([Validators.required, Validators.minLength(6)])
    ),
    conf_password: new FormControl(
      { value: '', disabled: false }, Validators.compose([Validators.required, Validators.minLength(6)])
    ),
    type: new FormControl(
      { value: 'register', disabled: false }
    ),
    giftcard: new FormControl(
      { value: '', disabled: false }, Validators.compose([Validators.required, Validators.minLength(12)])
    )
  });

  public loginForm = new FormGroup({
    email: new FormControl(
      { value: '', disabled: false }, Validators.compose([Validators.required, Validators.pattern(EMAIL_REGEX)])
    ),
    password: new FormControl(
      { value: '', disabled: false }, Validators.compose([Validators.required, Validators.minLength(6)])
    ),
    type: new FormControl(
      { value: 'login', disabled: false }
    ),
    giftcard: new FormControl(
      { value: '', disabled: false }, Validators.compose([Validators.required, Validators.minLength(12)])
    )
  });

  public giftForm = new FormGroup({
    giftcard: new FormControl(
      { value: '', disabled: false }, Validators.compose([Validators.required, Validators.minLength(12)])
    )
  });

  constructor(
    private _sharedService: SharedService,
    private _hyperToastsService: HyperToastsService,
    private _hyperCookieService: HyperCookieService,
    public _dialogRef: MatDialogRef<ActivateCodeComponent>,
  ) { }

  ngOnInit() {
    this.mountMaskPhone();
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

  submitRegisterForm() {
    if (this.registerForm.controls.password.value !== this.registerForm.controls.conf_password.value) {
      this.registerForm.controls.password.setErrors({ 'mismatch': true });
      this.registerForm.controls.conf_password.setErrors({ 'mismatch': true });
    }

    if (this.registerForm.valid) {
      this.eventForm(this.registerForm.value);
    }
  }

  submitLoginForm() {
    if (this.loginForm.valid) {
      this.eventForm(this.loginForm.value);
    }
  }

  submitGiftForm() {
    if (this.giftForm.valid) {
      const gift = this.giftForm.value.giftcard.replace(/\D/g, ''); //Remove todas as letras deixando somente numeros


      this._sharedService.checkCode(gift).subscribe(
        (response: any) => {
          if (response.return === true) {
            this.viewForm = 'register';
            this.registerForm.controls.giftcard.setValue(gift);
            this.loginForm.controls.giftcard.setValue(gift);
          } else {
            this.giftForm.controls.giftcard.setErrors({ 'invalidCode': true });
          }
        },
        err => { this._hyperToastsService.addToast('error', 'Erro', err); }
      );


    }
  }

  eventForm(evt) {
    this._sharedService.activateCode(evt).subscribe(
      (response: any) => {
        if (response.return === true) {
          this._hyperCookieService.setCookie_AUTH(response.data);
          BroadcastEventService.event('listenerLoginComponent').emit(response.data);
          this._dialogRef.close();
        } else {
          this._hyperToastsService.addToast('warn', 'Atenção', response.msg);
        }
      },
      err => { this._hyperToastsService.addToast('error', 'Erro', err); }
    );
  }

}
