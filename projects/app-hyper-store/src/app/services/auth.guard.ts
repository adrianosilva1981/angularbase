import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { HyperCookieService } from 'lib-services';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(
        private _router: Router,
        private _hyperCookieService: HyperCookieService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
        try {
            const cookie = this._hyperCookieService.getCookie_AUTH();
            if (window.location.pathname.includes('/supplier')) {
                if (Object(cookie).smartGuide == 'N' || cookie == undefined) {
                    this._router.navigate(['/supplier/login']);
                    return false;
                }
                return true;
            }
            if (cookie) {
                if (cookie.JWT) {
                    return true;
                }
            }

            this._router.navigate(['/login']);
            return false;
        } catch (error) {
            this._router.navigate(['/login']);
            return false;
        }
    }
}
