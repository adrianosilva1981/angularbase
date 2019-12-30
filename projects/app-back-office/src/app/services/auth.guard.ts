import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router/src/interfaces';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router/src/router_state';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { SharedService } from '@app-back-office/services/shared.service';
import { HyperToastsService } from 'lib-services';


@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private _sharedService: SharedService,
    private _hyperToastsService: HyperToastsService
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | boolean {

    // console.log(this._sharedService.getUserToken());

    if (this._sharedService.getUserToken()) {
      return true;
    }

    this._hyperToastsService.addToast('warn', 'Atenção', 'Você não tem acesso a esta área!');
    this._sharedService.deleteAllCookies();
    this.router.navigate(['office/login']);
    return false;
  }

  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | boolean {

    // console.log(this._sharedService.getUserToken());

    // console.log(state);
    if (this._sharedService.getUserToken()) {
      return true;
    }

    //if (state.url !== '/office/home') {
    this._hyperToastsService.addToast('warn', 'Atenção', 'Você não tem acesso a esta área!');
    //}
    this._sharedService.deleteAllCookies();
    this.router.navigate(['office/login']);
    return false;
  }

}
