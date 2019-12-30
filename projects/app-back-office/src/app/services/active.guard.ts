import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { Router } from '@angular/router';
import { HyperToastsService } from 'lib-services';
import { SharedService } from '@app-back-office/services/shared.service';


@Injectable()
export class ActiveGuard implements CanActivate {

  constructor(
    private _router: Router,
    private _hyperToastsService: HyperToastsService,
    private _sharedService: SharedService
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    return this._sharedService.checkreseller().map(
      (response: any) => {
        if (response.return) {
          const userObj = response.data;
           // console.log(userObj);
          if (userObj.status === 'A') {

            //if (userObj.status_active) {
              return true;
           // } else {
           //   this._hyperToastsService.addToast('warn', 'Atenção', 'Para ter acesso a esta área faça sua ativação mensal!');
           //   return false;
           // }

          } else if (userObj.status === 'AA') {
            this._router.navigate(['office/access']); // redirect to planos
            this._hyperToastsService.addToast('warn', 'Atenção', 'Você não tem acesso a esta área! Selecione uma forma de pagamento!');
            return false;
          } else if (userObj.status === 'AP') {
            this._router.navigate(['office/checkout/success/'], {
              queryParams: {
                method: userObj.method,
              }
            });
            this._hyperToastsService.addToast('warn', 'Atenção', 'Você não tem acesso a esta área! Aguardando compensação do pagamento!');
            return false;
          }

        } else {
          this._hyperToastsService.addToast('warn', 'Atenção', 'Você não tem acesso a esta área!');
          this._sharedService.deleteAllCookies();
          this._router.navigate(['office/login']);
          return false;
        }
      },
      err => {
        this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro inesperado. Atualize a página e tente novamente');
        this._sharedService.deleteAllCookies();
        this._router.navigate(['office/login']);
        return false;
      }
    );
  }

}