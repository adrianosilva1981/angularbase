import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { BroadcastEventService, HyperCookieService, HyperToastsService } from 'lib-services';
import { MatDialog } from '@angular/material';
import { SharedService } from '../../services/shared.service';
import { ActivatedRoute } from '@angular/router';


const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PHONE_REGEX = /^\([0-9]{2}\) 9\d{4}-\d{4}|\((?:1[2-9]|[2-9]\d)\) [1-9]\d{3}-\d{4}$/;

@Component({
  selector: 'lib-components-box-login-register',
  templateUrl: './box-login-register.component.html',
  styleUrls: ['./box-login-register.component.less']
})
export class BoxLoginRegisterComponent implements OnInit {

  @Output() onNext: EventEmitter<any> = new EventEmitter();
  public userData: any;
  public maskPhone;
  public maskCpf = [/[0-9]/, /[0-9]/, /[0-9]/, '.', /[0-9]/, /[0-9]/, /[0-9]/, '.', /[0-9]/, /[0-9]/, /[0-9]/, '-', /[0-9]/, /[0-9]/];

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
    socialSecurity: new FormControl(
      { value: '', disabled: false }, Validators.compose([Validators.required, Validators.minLength(11)])
    )
  });

  public hash = '';

  constructor(
    private _sharedService: SharedService,
    private _hyperToastsService: HyperToastsService,
    private _hyperCookieService: HyperCookieService,
    private _matDialog: MatDialog,
    private _activatedRoute: ActivatedRoute
  ) {
    this.userData = this._sharedService.getUserToken();

    BroadcastEventService.event('listenerLoginComponent').subscribe(
      response => {
        if (response.JWT) {
          this.userData = response;
        }
      }
    );

    this._activatedRoute.params.subscribe(
      params => {
        if (params.hash) {
          // para vincular usuario para aprovar Vouchers
          this.hash = params.hash;
        }
      }
    );
  }

  ngOnInit() {
    this.mountMaskPhone();
  }

  eventNext() {
    this.onNext.emit(true);
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

  openLogin() {
    BroadcastEventService.event('openLoginModal').emit(true);
  }

  submitRegisterForm() {

    if (this.registerForm.controls.password.value !== this.registerForm.controls.conf_password.value) {
      this.registerForm.controls.password.setErrors({ 'mismatch': true });
      this.registerForm.controls.conf_password.setErrors({ 'mismatch': true });
    }

    if (this.registerForm.valid) {
      this.registerCustomer(this.registerForm.value);
    }
  }

  registerCustomer(obj) {
    obj.hash = this.hash;
    this._sharedService.registerInHJ(obj).subscribe(
      (response: any) => {
        if (response.return === true) {
          this._hyperCookieService.setCookie_AUTH(response.data);

          setTimeout(() => {
            BroadcastEventService.event('listenerLoginComponent').emit(response.data);
            this._matDialog.getDialogById('loginAuthenticate').close(true);

          }, 500);
        } else {
          this._hyperToastsService.addToast('warn', 'Atenção', response.msg);
        }
      },
      err => { this._hyperToastsService.addToast('error', 'Erro', err); }
    );
  }
}
