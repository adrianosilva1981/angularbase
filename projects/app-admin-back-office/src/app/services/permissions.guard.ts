import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { SharedService } from '@app-admin-back-office/services/shared.service';
import { Observable } from 'rxjs';
import { HyperToastsService } from 'lib-services';


@Injectable()
export class PermissionsGuard implements CanActivate {

    constructor(
        private _router: Router,
        private _hyperToastsService: HyperToastsService,
        private _sharedService: SharedService
    ) { }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> | boolean {
        const permissionsAllowed = route.data['permissions'] as Array<string>;
        const currentPermissions = this._sharedService.getUserPermissions() as Array<string>;
        // console.log(currentPermissions);

        if (permissionsAllowed.filter((n) => currentPermissions.includes(n)).length > 0) { // Array Intersect
            return true;
        }
        this._hyperToastsService.addToast('warn', 'Atenção', 'Sem permissão de acesso.');
        this._router.navigate(['/']);
        return false;
    }
}
