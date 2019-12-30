import { Component, OnInit, OnChanges } from '@angular/core';
import { BroadcastEventService, HyperToastsService } from 'lib-services';
import { SharedService } from '@app-back-office/services/shared.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-back-office-vouchers',
  templateUrl: './vouchers.component.html',
  styleUrls: ['./vouchers.component.less']
})
export class VouchersComponent implements OnInit {

  public vouchers: any = {};
  public voucherOk = false;
  public cont = 0;
  public type: String = "";
  public title: String = "";

  public status: any = {
    A: 'Ativo',
    I: 'Inativo',
    U: 'Utilizado'
  };

  constructor(
    private _sharedService: SharedService,
    private _hyperToastsService: HyperToastsService,
    private _routerActivated: ActivatedRoute,
    private _router: Router
  ) {
    BroadcastEventService.event('changeLink').emit('voucher');
    this.getInfo();
  }

  getInfo() {
    this.type = this._routerActivated.snapshot.paramMap.get("type");

    if (this.type === "" || this.type === "prime") {
      this.title = "Prime";
      this._sharedService.getVouchersPrime().subscribe(
        response => {
          if (response.return) {
            this.voucherOk = true;
            this.vouchers = response.data;
            let idx = 0;
            this.vouchers.forEach(element => {
              this.vouchers[idx].cont = idx + 1;
              this.vouchers[idx].expiration_date = new Date(element.expiration_date.replace(' ', 'T')).toLocaleDateString();
              if (this.vouchers[idx].activation_date) {
                this.vouchers[idx].activation_date = new Date(element.activation_date.replace(' ', 'T')).toLocaleDateString();
              } else {
                this.vouchers[idx].activation_date = '-';
              }
              if (!this.vouchers[idx].mail) {
                this.vouchers[idx].mail = '-';
              }
              idx++;
            });
          } else {
            this.voucherOk = false;
            // this._hyperToastsService.addToast('warn', 'Atenção', response.msg);
          }
        },
        err => {
          this.voucherOk = false;
          this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro inesperado. Atualize a página e tente novamente');
        }
      );
    } else if (this.type === "smart") {
      this.title = "Smart";
      this._sharedService.getVouchersSmart().subscribe(
        response => {
          if (response.return) {
            this.voucherOk = true;
            this.vouchers = response.data;
            let idx = 0;
            this.vouchers.forEach(element => {
              this.vouchers[idx].cont = idx + 1;
              this.vouchers[idx].expiration_date = new Date(element.expiration_date.replace(' ', 'T')).toLocaleDateString();
              if (this.vouchers[idx].activation_date) {
                this.vouchers[idx].activation_date = new Date(element.activation_date.replace(' ', 'T')).toLocaleDateString();
              } else {
                this.vouchers[idx].activation_date = '-';
              }
              if (!this.vouchers[idx].mail) {
                this.vouchers[idx].mail = '-';
              }
              idx++;
            });
          } else {
            this.voucherOk = false;
            // this._hyperToastsService.addToast('warn', 'Atenção', response.msg);
          }
        },
        err => {
          this.voucherOk = false;
          this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro inesperado. Atualize a página e tente novamente');
        }
      );
    } else {
      this.voucherOk = false;
      this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro inesperado. Atualize a página e tente novamente');
    }
  }

  ngOnInit() {
    this._router.events.subscribe(
      evt => {
        if (evt instanceof NavigationEnd) {
          this.getInfo();
        }

      }
    );
  }
}
