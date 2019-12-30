import { Location } from '@angular/common';
import { HyperToastsService } from 'lib-services';
import { Component, OnInit } from '@angular/core';
import { SharedService } from '@app-admin-back-office/services/shared.service';
import { ActivatedRoute, Router } from '@angular/router';
import swal from 'sweetalert2';

@Component({
  selector: 'app-admin-back-office-connection-by-financing',
  templateUrl: './connection-by-financing.component.html',
  styleUrls: ['./connection-by-financing.component.less']
})
export class ConnectionByFinancingComponent implements OnInit {

  public associate: any;
  public financing: any;
  // public cols: any[] = [];

  constructor(
    private _sharedService: SharedService,
    private _activatedRoute: ActivatedRoute,
    private _hyperToastsService: HyperToastsService,
    private _location: Location,
    private _router: Router
  ) {
    this.setData(this._activatedRoute.snapshot.params.username);
  }

  ngOnInit() {
  }

  setData(username: string) {
    this._sharedService.getInfoFinancingAssociate(username).subscribe(
      response => {
        if (response.return) {
          // this.cols = [];
          this.associate = JSON.parse(response.data.reseller);
          this.financing = JSON.parse(response.data.financing);
          // tslint:disable-next-line:no-unused-expression
          // this.financing.plots_obj && Object.keys(this.financing.plots_obj[0]).forEach((col: string) => { this.setCols(col); });
        } else {
          this._hyperToastsService.addToast('warn', 'Atenção', response.msg);
          this._location.back();
        }
      },
      err => {
        this._hyperToastsService.addToast('error', 'Error', err.msg);
        console.error(err);
      }
    );
  }
  // setCols(col: string) {
  //   switch (col) {
  //     case 'plot': this.cols.push({ field: col, header: 'Parcela' }); break;
  //     case 'paymentDate': this.cols.push({ field: col, header: 'Data de Pagamento' }); break;
  //     case 'value': this.cols.push({ field: col, header: 'Valor' }); break;
  //   }
  // }

  back() {
    this._location.back();
  }

  toActivateAlert() {
    swal({
      title: 'Financiamento?',
      text: 'Tem certeza que deseja ativar o Associado ' + this.associate.name +
        '\ncom o valor de financiamento de R$' + this.financing.value_financed +
        '\ne valor de entrada R$' + this.financing.value_init + '?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'green',
      cancelButtonColor: 'red',
    }).then((result) => {
      if (result.value) {
        this.toActivate();
      }
    });
  }

  toActivate() {
    const data = {
      id_reseller: this.associate.id,
      id_financing: this.financing.id,
      value_init: this.financing.value_init
    };
    this._sharedService.setFinancingAssociate(data).subscribe(
      response => {
        if (response.return) {
          this._hyperToastsService.addToast('success', 'Sucesso', response.msg);
        } else {
          this._hyperToastsService.addToast('warn', 'Atenção', response.msg);
        }
        this._location.back();
      },
      err => {
        this._hyperToastsService.addToast('error', 'Error', err.msg);
        console.error(err);
        this._location.back();
      }
    );

  }

}
