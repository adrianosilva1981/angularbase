
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';

import { BroadcastEventService, HyperCookieService } from 'lib-services';

import { LoginService } from '../../services/login.service';
import { ModalContainerComponent } from '../modal-container/modal-container.component';


@Component({
  selector: 'lib-login-enter-password',
  templateUrl: './enter-password.component.html',
  styleUrls: ['./enter-password.component.less']
})
export class EnterPasswordComponent implements OnInit {
  @Input() paramData: any;
  @Output() eventBackStep = new EventEmitter<string>();

  public errorMessage = '';
  public loginForm = new FormGroup({
    email: new FormControl(
      { value: '', disabled: false }
    ),
    password: new FormControl(
      { value: '', disabled: false }, Validators.compose([Validators.required, Validators.minLength(6)])
    )
  });

  constructor(
    private _loginService: LoginService,
    private _hyperCookieService: HyperCookieService,
    public _matDialog: MatDialog
  ) { }

  ngOnInit() {
    this.loginForm.get('email').setValue(this.paramData.mail);
  }

  backStep() {
    this.eventBackStep.emit('step1');
  }

  submitLoginForm() {
    if (this.loginForm.valid) {
      this._loginService.login(this.loginForm.value).subscribe(
        (response: any) => {
          this.errorMessage = (Array.isArray(response.msg) ? response.msg[0] : response.msg);

          if (response.return) {
            //Cria o cookie d hyper
            this._hyperCookieService.setCookie_AUTH(response.data);

            //Cria o cookie da youhub
            if (response.data_extra) {
              const aux = response.data_extra;
              aux.JWT = response.JWT;
              this._hyperCookieService.setCookie_GENERIC(aux, 'backoffice');
            }

            BroadcastEventService.event('onModalLoginActions').emit({ action: 'login-success' });
            BroadcastEventService.event('listenerLoginComponent').emit(response.data);

          } else {
            this.loginForm.controls.password.setErrors({ 'responseErrors': true });
          }
        },
        err => {
          this.errorMessage = '* Ocorreu um erro. Atualize a página e tente novamente';
          this.loginForm.controls.password.setErrors({ 'responseErrors': true });
        }
      );
    }
  }

  forgotPassord() {
    this._matDialog.closeAll();
    const dialogRefLogin = this._matDialog.open(ModalContainerComponent, {
      width: '445px',
      minHeight: '475px',
      panelClass: 'globalModalHJ',
      data: { component: 'forgot-password', emailRecovery: this.loginForm.get('email').value }
    });
  }
}
