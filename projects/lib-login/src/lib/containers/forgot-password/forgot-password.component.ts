import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { BroadcastEventService } from 'lib-services';

import { LoginService } from './../../services/login.service';

const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

@Component({
  selector: 'lib-login-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.less']
})
export class ForgotPasswordComponent implements OnInit {

  @Input() emailRecovery: any;

  public errorMessage = '';
  public successMessage = '';
  public showSuccess = false;
  public loading = false;
  public forgotForm = new FormGroup({
    email: new FormControl(
      { value: '', disabled: false }, Validators.compose([Validators.required, Validators.pattern(EMAIL_REGEX)])
    )
  });

  constructor(
    private _loginService: LoginService
  ) { }

  ngOnInit() {
    this.forgotForm.get('email').setValue(this.emailRecovery);
  }

  backToLogin() {
    BroadcastEventService.event('onModalLoginActions').emit({ action: 'close' });
  }

  submitForgotForm() {
    if (this.forgotForm.valid) {
      this.loading = true;
      this._loginService.sendEmailRecovey(this.forgotForm.value)
        .subscribe(
          (response: any) => {
            this.errorMessage = (Array.isArray(response.msg) ? response.msg[0] : response.msg);
            this.loading = false;
            if (response.return === true) {
              this.successMessage = response.msg;
              this.showSuccess = true;
              setTimeout(() => {
                BroadcastEventService.event('onModalLoginActions').emit({ action: 'close' });
              }, 3000);
            } else {
              this.forgotForm.controls.email.setErrors({ 'responseErrors': true });
              this.showSuccess = false;
            }
          },
          err => {
            this.loading = false;
            this.errorMessage = '* Ocorreu um erro. Atualize a página e tente novamente';
            this.forgotForm.controls.email.setErrors({ 'responseErrors': true });
            this.showSuccess = false;
          }
        );
    }

  }

}
