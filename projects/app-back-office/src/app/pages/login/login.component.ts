import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { HyperToastsService } from 'lib-services';
import { SharedService } from '@app-back-office/services/shared.service';

@Component({
  selector: 'app-back-office-login-container',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginContainerComponent implements OnInit {

  public varPreRegister = false;
  public varForgotPassword = false;
  public varResetPassword = false;
  public varNewCounterSign = false;

  public userNameReseller: string;
  public idParent;
  public idParentName;
  public idHost;


  constructor(
    private _route: ActivatedRoute,
    private _sharedService: SharedService,
    private _hyperToastsService: HyperToastsService,
    private _router: Router
  ) {

    if (this._route.snapshot.url[0].path === 'preregister') {
      this.varPreRegister = true;
    }

    if (this._route.snapshot.url[0].path === 'forgotpassword') {
      this.varForgotPassword = true;
    }

    if (this._route.snapshot.url[0].path === 'resetpassword') {
      this.varResetPassword = true;
    }

    if (this._route.snapshot.url[0].path === 'newcountersign') {
      this.varNewCounterSign = true;
    }

    this._route.parent.queryParams.subscribe(queryparams => {
      this.userNameReseller = queryparams['reseller'] || '';
      this.idHost = queryparams['host'] || '';
      if (this.userNameReseller !== '') {
        this._sharedService.validadeReseller(this.userNameReseller, 'office').subscribe(response2 => {
          if (response2.return) {
            this.idParent = response2.data.id; // Reseller válido
            this.idParentName = response2.data.apelido ? response2.data.apelido : response2.data.name;
          } else {
            this.idParent = '';
            this.idParentName = '';
            this.userNameReseller = '';
            this._hyperToastsService.addToast('warn', 'Atenção', response2.msg);
            this._router.navigate(['office/preregister']); // Reseller inválido
          }
        },
          err => {
            this.idParent = '';
            this.idParentName = '';
            this.userNameReseller = '';
            this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro inesperado. Atualize a página e tente novamente');
          }
        );
      } else {
        this.idParent = '';
        this.idParentName = '';
        this.userNameReseller = '';
      }
    });

  }

  ngOnInit() {
  }

  checkPreRegister(event) {
    if (event === true) {
      this._router.navigate(['office/preregister']);
    }
  }

  checkForgotPassword(event) {
    if (event === true) {
      this._router.navigate(['office/forgotpassword']);
    }
  }


}
