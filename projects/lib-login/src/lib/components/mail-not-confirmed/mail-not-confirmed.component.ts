import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';

import { BroadcastEventService } from 'lib-services';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'lib-login-mail-not-confirmed',
  templateUrl: './mail-not-confirmed.component.html',
  styleUrls: ['./mail-not-confirmed.component.less']
})
export class MailNotConfirmedComponent implements OnInit {

  public errorMessage = '';
  public email = '';
  public emailValid: boolean;
  public showSuccess = false;
  public showErrors = false;
  public loading = false;

  @Input() paramData: any;
  @Output() eventBackStep = new EventEmitter<string>();

  constructor(
    private _loginService: LoginService,
  ) { }

  ngOnInit() {
    this.email = this.paramData.mail;
  }

  saveAndResend() {
    const obj = {
      id: this.paramData.id,
      mail: this.paramData.mail
    };
    this.loading = true;
    this._loginService.confirmEmail(obj).subscribe(
      (response: any) => {
        this.loading = false;
        if (response.return) {
          this.showSuccess = true;
          setTimeout(() => {
            BroadcastEventService.event('onModalLoginActions').emit({ action: 'close' });
          }, 3000);
        } else {
          this.errorMessage = '* ' + response.msg;
          this.showErrors = true;
        }
      },
      err => {
        this.loading = false;
        this.errorMessage = '* Ocorreu um erro. Atualize a página e tente novamente';
        this.showErrors = true;
      }
    );
  }
}
