import { Component, OnInit } from '@angular/core';
import { SharedService } from '@app-back-office/services/shared.service';
import { HyperToastsService } from 'lib-services';

@Component({
  selector: 'app-back-office-galaxia-login',
  templateUrl: './galaxia-login.component.html',
  styleUrls: ['./galaxia-login.component.less']
})
export class GalaxiaLoginComponent implements OnInit {
  public objUser: any = {};
  public objSend: any = {
    acao: 'login_tk',
    email: '',
    tk_login: '',
    ID: 19,
    tk: '409aa84672eee745dbe1e39fb78d2cc5'
  };

  constructor(
    private _sharedService: SharedService,
    private _hyperToastsService: HyperToastsService
  ) {
    this.objUser = this._sharedService.getCookieReseller();
  }

  ngOnInit() {
    this.objSend.email = this.objUser.email;
  }

  getTKLogin(form) {
    this._sharedService.galaxiaLogin({ email: this.objSend.email }).subscribe(
      response => {
        if (response.return) {
          this.objSend.tk_login = response.data;
          setTimeout(() => {
            form.submit();
          }, 500);
        } else {
          this._hyperToastsService.addToast('warn', 'Atenção', response.msg);
        }
      },
      err => {
        this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro inesperado. Atualize a página e tente novamente');
      }
    );
  }

}
