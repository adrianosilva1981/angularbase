import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { HyperToastsService, HyperCookieService } from 'lib-services';
import { SharedService } from '@app-admin-back-office/services/shared.service';
import { Router } from '@angular/router';
import { environment } from '@env/app-admin-back-office';

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

@Component({
  selector: 'app-admin-back-office-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit {

  public loginForm: FormGroup;

  constructor(
    private _hyperCookieService: HyperCookieService,
    private _hyperToastsService: HyperToastsService,
    private _router: Router,
    private _sharedService: SharedService,
  ) {

    this.loginForm = new FormGroup({
      emailFormControl: new FormControl('',
        [
          Validators.required,
          Validators.pattern(EMAIL_REGEX)
        ]
      ),
      passwordFormControl: new FormControl('',
        [
          Validators.required,
          Validators.minLength(6)
        ]
      )
    });
  }

  ngOnInit() {
  }

  login() {
    const objlogin = {
      email: this.loginForm.controls.emailFormControl.value,
      password: this.loginForm.controls.passwordFormControl.value
    };
    this._sharedService.login(objlogin).subscribe(
      response => {
        if (response.return) {
          const loginData = response.data;
          loginData.JWT = response.JWT;
          this._hyperCookieService.setCookie_GENERIC(loginData, environment.nameCookie);
          this._router.navigate(['/']);
        } else {
          this._hyperToastsService.addToast('warn', 'Atenção', response.msg);
        }
      },
      err => {
        console.log(err);
        this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro inesperado. Atualize a página e tente novamente');
        this._router.navigate(['/login']);
      }
    );
  }
}
