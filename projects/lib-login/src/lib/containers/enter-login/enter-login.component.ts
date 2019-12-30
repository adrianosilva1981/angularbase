import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { LoginService } from './../../services/login.service';


const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

@Component({
  selector: 'lib-login-enter-login',
  templateUrl: './enter-login.component.html',
  styleUrls: ['./enter-login.component.less']
})
export class LoginComponent implements OnInit {

  public stepVisible = 'step1';
  public templateStep2: string;
  public errorMessage = '';
  public paramData: any = {};
  public loading = false;
  public loginForm = new FormGroup({
    email: new FormControl(
      { value: '', disabled: false }, Validators.compose([Validators.required, Validators.pattern(EMAIL_REGEX)])
    )
  });

  constructor(
    private _loginService: LoginService
  ) { }

  ngOnInit() { }

  selectTemplate(objResponseData) {
    let template: string;

    if (objResponseData.isRegistered) {
      if (objResponseData.mailConfirm) {
        template = 'enter-password';
      } else {
        template = 'mail-not-confirmed';
      }
    } else {
      template = 'not-registered';
    }

    return template;
  }

  showStep(val) {
    this.templateStep2 = '';
    this.stepVisible = val;
  }

  submitLoginForm() {
    if (this.loginForm.valid) {
      const email = this.loginForm.get('email').value;
      this.loading = true;

      this._loginService.verifyEmail(email).subscribe(
        (response: any) => {
          this.errorMessage = (Array.isArray(response.msg) ? response.msg[0] : response.msg);
          this.loading = false;

          if (response.return) {
            this.showStep('step2');
            this.templateStep2 = this.selectTemplate(response.data);
            this.paramData = response.data;
            this.paramData.mail = email;
          } else {
            this.loginForm.controls.email.setErrors({ 'responseErrors': true });
          }
        },
        err => {
          this.errorMessage = '* Ocorreu um erro. Atualize a página e tente novamente';
          this.loginForm.controls.email.setErrors({ 'responseErrors': true });
          this.loading = false;
        }
      );
    }
  }


}
