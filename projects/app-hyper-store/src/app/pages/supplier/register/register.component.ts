import { Component, OnInit } from '@angular/core';
import { SharedService } from '@app-hyper-store/services/shared.service';
import { HyperToastsService, HyperCookieService } from 'lib-services';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-hyper-store-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.less']
})
export class RegisterComponent implements OnInit {
  public voucher: String;
  constructor(
    private _sharedService: SharedService,
    private _hyperToast: HyperToastsService,
    private _hyperCookieService: HyperCookieService,
    private _router: Router,
    public _dialog: MatDialog

  ) { }

  ngOnInit() {
  }

  activateVoucher() {
    this._sharedService.validvoucherpack({ voucher: this.voucher.replace(/-/g, '') }).subscribe(
      response => {
        if (response.return) {
          // this._hyperCookieService.deleteCookie_AUTH();
          this._dialog.closeAll();
          this._hyperCookieService.setCookie_AUTH(response.data);
          this._router.navigate(['/supplier/dash']);
        } else {
          this._hyperToast.addToast('warn', 'atenção', response.msg);
        }
      }
    );
  }
}
