import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SharedService } from '@app-consultant-adm/services/shared.service';
import { HyperToastsService } from 'lib-services';

@Injectable()
export class ConsultantGuard implements CanActivate {
    constructor(
        private _router: Router,
        private _sharedService: SharedService,
        private _toastHyper: HyperToastsService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {

        const objUser = this._sharedService.getUserObject();
        const consultant = objUser ? objUser.consultant : 'N';
        if (consultant !== 'N') {
            return true;
        } else {
            this._router.navigate(['/login']);
            this._toastHyper.addToast('warning', 'Atenção', 'Área destinada somente para associados ativos');

            return false;
        }
    }
}
