import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SharedService } from '@app-account/services/shared.service';

@Injectable()
export class AccountGuard implements CanActivate {
    constructor(
        private _router: Router,
        private _sharedService: SharedService,
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {

        const objUser = this._sharedService.getUserObject();

        if (objUser) {
            if (objUser.JWT) {
                return true;
            }
        }
        this._router.navigate(['/login']);
        return false;
    }
}
