import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SharedService } from '@app-admin/services/shared.service';

@Injectable({
  providedIn: 'root'
})
export class AdmGuardGuard implements CanActivate {
  constructor(
    private _router: Router,
    private _sharedService: SharedService) {

  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const objUser = this._sharedService.getUserObject();

    if (objUser) {
      return true;
    } else {
      this._router.navigate(['/login']);
      return false;
    }
  }
}
