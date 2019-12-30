import { HyperToastsService } from 'lib-services';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';


import { SharedService } from '@app-admin-youhubshop/services/shared.service';
import { Observable } from 'rxjs';


@Injectable()
export class PermissionsGuard implements CanActivate {

    constructor(
        private _router: Router,
        private _sharedService: SharedService,
        private _hyperToastsService: HyperToastsService
    ) { }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> | boolean {
        const permissionsAllowed = route.data['permission'] as number;
        const currentPermissions = this._sharedService.getUserPermission() as number;
        if (permissionsAllowed <= currentPermissions) {
            return true;
        } else {
            if (currentPermissions) {
                this._router.navigate(['/']);
                this._hyperToastsService.addToast('error', 'Error', 'Sem Permissão para acessar essa página!');
            } else {
                this._router.navigate(['/login']);
            }
            return false;
        }
    }
}
