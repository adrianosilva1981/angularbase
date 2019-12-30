import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SharedService } from '@app-admin-back-office/services/shared.service';

@Injectable({
    providedIn: 'root'
})
export class AuthenticateGuard implements CanActivate {
    constructor(
        private _router: Router,
        private _sharedService: SharedService,
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
        // return true;
        const objUser = this._sharedService.getUserObject();

        if (objUser) {
            return true;
        } else {
            this._router.navigate(['/login']);
            return false;
        }
    }
}
