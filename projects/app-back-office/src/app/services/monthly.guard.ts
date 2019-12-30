import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { Router } from '@angular/router';
import { HyperToastsService } from 'lib-services';
import { SharedService } from '@app-back-office/services/shared.service';


@Injectable()
export class MonthlyGuard implements CanActivate {

  constructor(
    private _router: Router,
    private _hyperToastsService: HyperToastsService,
    private _sharedService: SharedService
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    return this._sharedService.checkreseller().map(
      (response: any) => {
        if (response.return) {
          if (!response.data.has_monthly) {
            this._hyperToastsService.addToast('warn', 'Atenção', 'Para acessar esta área você precisar pagar sua mensalidade');
            // this._router.navigate(['office/home']);
            return false;
          } else {
            return true;
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