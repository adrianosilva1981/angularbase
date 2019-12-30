import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { BroadcastEventService, HyperCookieService, HyperToastsService } from 'lib-services';
import { SharedService } from '@app-hyper-store/services/shared.service';
import { VoucherComponent } from 'lib-components';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material';
import { RegisterComponent } from '@app-hyper-store/pages/supplier/register/register.component';


const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PHONE_REGEX = /^\([0-9]{2}\) 9\d{4}-\d{4}|\((?:1[2-9]|[2-9]\d)\) [1-9]\d{3}-\d{4}$/;

@Component({
  selector: 'app-hyper-store-box-login-register',
  templateUrl: './box-login-register.component.html',
  styleUrls: ['./box-login-register.component.less']
})
export class BoxLoginRegisterComponent implements OnInit {

  @Output() onNext: EventEmitter<any> = new EventEmitter();
  @Input() prime = false;
  @Input() pack = false;
  public userData: any;
  public maskPhone;
  public maskCpf = [/[0-9]/, /[0-9]/, /[0-9]/, '.', /[0-9]/, /[0-9]/, /[0-9]/, '.', /[0-9]/, /[0-9]/, /[0-9]/, '-', /[0-9]/, /[0-9]/];
  private subscription_dialog = new Subscription;

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

  constructor(
    private _sharedService: SharedService,
    private _hyperToastsService: HyperToastsService,
    private _hyperCookieService: HyperCookieService,
    public _dialog: MatDialog

  ) {
    this.userData = this._sharedService.getUserData();

    BroadcastEventService.event('listenerLoginComponent').subscribe(
      response => {
        if (response.JWT) {
          this.userData = response;
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
    this._sharedService.registerInHJ(obj).subscribe(
      (response: any) => {
        if (response.return === true) {
          this._hyperCookieService.setCookie_AUTH(response.data);

          setTimeout(() => {
            BroadcastEventService.event('listenerLoginComponent').emit(response.data);
          }, 500);
        } else {
          this._hyperToastsService.addToast('warn', 'Atenção', response.msg);
        }
      },
      err => { this._hyperToastsService.addToast('error', 'Erro', err); }
    );
  }

  openModalVoucher() {
    const dialogRef = this._dialog.open(
      VoucherComponent,
      {
        id: 'voucherModal',
        data: {

        },
        panelClass: 'globalModalHJ'
      });
    this.subscription_dialog = dialogRef.afterClosed().subscribe(
      result => {
        this.subscription_dialog.unsubscribe();

      });
  }

  openModalVoucherPack() {
    const dialogRef = this._dialog.open(
      RegisterComponent,
      {
        id: 'voucherModal',
        data: {

        },
        panelClass: 'globalModalHJ'
      });
    this.subscription_dialog = dialogRef.afterClosed().subscribe(
      result => {
        this.subscription_dialog.unsubscribe();

      });
  }
}
