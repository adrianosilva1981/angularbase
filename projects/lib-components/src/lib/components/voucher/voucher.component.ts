import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../services/shared.service';
import { HyperToastsService } from 'lib-services';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'lib-components-voucher',
  templateUrl: './voucher.component.html',
  styleUrls: ['./voucher.component.less']
})
export class VoucherComponent implements OnInit {
  public voucher: any;

  constructor(
    private _sharedServices: SharedService,
    private _hyperToast: HyperToastsService,
    private _dialog: MatDialog

  ) { }

  ngOnInit() {
  }
  activateVoucher() {
    const obj = {
      voucher: this.voucher
    };
    this._sharedServices.postVoucher(obj).subscribe(
      response => {
        if (response.return) {
          this._hyperToast.addToast('success', 'Parabéns', response.msg);
          this._dialog.getDialogById('voucherModal').close();
        } else {
          this._hyperToast.addToast('warn', 'Atenção', response.msg);
        }
      }, err => {
        this._hyperToast.addToast('error', 'Error', err.msg);
      }
    );
  }
}
