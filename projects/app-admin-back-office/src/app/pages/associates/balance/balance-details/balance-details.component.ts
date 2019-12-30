import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { SharedService } from '@app-admin-back-office/services/shared.service';
import { HyperToastsService } from 'lib-services';
import swal from 'sweetalert2';

@Component({
  selector: 'app-admin-back-office-balance-details',
  templateUrl: './balance-details.component.html',
  styleUrls: ['./balance-details.component.less']
})
export class BalanceDetailsComponent implements OnInit {

  public points: any;
  public cols: any;
  public associate: any;
  public credit: number;
  public debit: number;
  public balance: number;

  constructor(
    private _sharedService: SharedService,
    private _activatedRoute: ActivatedRoute,
    private _hyperToastsService: HyperToastsService,
    private _router: Router,
  ) {
    this.setAssociates(Number.parseInt(this._activatedRoute.snapshot.paramMap.get('associate').toString()));
  }

  ngOnInit() {
  }

  setAssociates(id) {
    this.points = [];
    this.cols = [];
    this.debit = 0;
    this.credit = 0;
    this.balance = 0;
    this._sharedService.getListBalanceDetail(id).subscribe(
      response => {
        if (response.return) {
          this.points = response.data.points;
          this.associate = response.data.reseller;
          Object.keys(this.points[0]).forEach(col => {
            this.setCols(col);
          });
        } else {
          this._hyperToastsService.addToast('warn', 'Warning', response.msg);
          this._router.navigate(['/associates/balance']);
        }
      },
      err => {
        this._hyperToastsService.addToast('error', 'Error', err.msg);
        this._router.navigate(['/associates/balance']);
      },
      () => {
        this.debit = this.points.map(x => parseFloat(x.value_debit)).reduce(((sum, value) => sum + value), 0);
        this.credit = this.points.map(x => parseFloat(x.value_credit)).reduce(((sum, value) => sum + value), 0);
        this.balance = this.credit - this.debit;
      });
  }

  showDialog(info) {
    swal({
      title: 'Informações extras',
      text: info,
      type: 'warning',
      showCancelButton: true,
      showConfirmButton: false,
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar'
    });
  }

  setCols(col: string) {
    switch (col) {
      case 'method':
        this.cols.push({
          field: col,
          header: 'Pagamento',
        });
        break;
      case 'value_credit':
        this.cols.push({
          field: col,
          header: 'Crédito',
        });
        break;
      case 'value_debit':
        this.cols.push({
          field: col,
          header: 'Débito',
        });
        break;
      case 'date_release':
        this.cols.push({
          field: col,
          header: 'Data de liberação',
        });
        break;
      case 'created':
        this.cols.push({
          field: col,
          header: 'Data',
        });
        break;
      case 'description':
        this.cols.push({
          field: col,
          header: 'Descrição',
        });
        break;
      case 'extra_info':
        break;
      default:
        this.cols.push({
          field: col,
          header: _.upperFirst(col).replace(new RegExp('_'), ' '),
        });
        break;
    }
  }

  navigate() {
    this._router.navigate(['/associates/balance']);
  }
}
