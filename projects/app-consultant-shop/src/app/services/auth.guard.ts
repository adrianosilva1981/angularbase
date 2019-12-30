import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { HyperCookieService } from 'lib-services';
import { SharedService } from '@app-consultant-shop/services/shared.service';


@Injectable()
export class AuthGuard implements CanActivate {

    constructor(
        private _router: Router,
        private _hyperCookieService: HyperCookieService,
        private _sharedService: SharedService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
        try {
            const cookie = this._hyperCookieService.getCookie_AUTH();
            if (cookie) {
                if (cookie.JWT) {
                    return true;
                }
            }

            this._router.navigate([this._sharedService.getSubdomainOwnerStore() + '/login']);
            return false;
        } catch (error) {
            this._router.navigate([this._sharedService.getSubdomainOwnerStore() + '/login']);
            return false;
        }
    }
}
