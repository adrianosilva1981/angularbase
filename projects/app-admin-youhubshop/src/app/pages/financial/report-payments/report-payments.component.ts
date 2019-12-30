import { Component, OnInit } from '@angular/core';
import { SharedService } from '@app-admin-youhubshop/services/shared.service';
import { HyperToastsService } from 'lib-services';
import * as _ from 'lodash';
import { ImagesComponent } from '@app-admin-youhubshop/components/Modals/images/images.component';
import { MatDialogConfig, MatDialog } from '@angular/material';

@Component({
  selector: 'app-admin-youhubshop-report-payments',
  templateUrl: './report-payments.component.html',
  styleUrls: ['./report-payments.component.less']
})
export class ReportPaymentsComponent implements OnInit {

  public payments: any[] = [];
  public cols: any[] = [];


  constructor(
    private _sharedService: SharedService,
    private _HyperToastsService: HyperToastsService,
    public dialog: MatDialog
  ) {

    this.setPayments();

  }

  ngOnInit() {
  }

  setPayments() {
    this.payments = [];
    this._sharedService.getReportPayments().subscribe(
      response => {
        if (response.return) {
          this.payments = response.data;
          this.payments.forEach(payment => {
            payment.images = JSON.parse(payment.images);
            payment.images.forEach(image => {
              image.source = 'http://' + image.source;
            });
          });
          Object.keys(this.payments[0]).forEach((col: string) => {
            this.setCols(col);
          });

        } else {
          this._HyperToastsService.addToast('warn', 'Atenção', response.msg);
          console.log(response);
        }
      },
      err => {
        this._HyperToastsService.addToast('warn', 'Atenção', 'Atenção ocorreu algum problema, entre em contato com o Suporte!');
        console.error(err);
      }
    );
  }
  setCols(col: string) {
    switch (col) {
      case 'id':
        this.cols.push({
          field: col,
          header: 'Código Fornecedor'
        });
        break;
      case 'fantasyname':
        this.cols.push({
          field: col,
          header: 'Fornecedor'
        });
        break;
      case 'value':
        this.cols.push({
          field: col,
          header: 'Pago'
        });
        break;
      case 'dateMoviment':
        this.cols.push({
          field: col,
          header: 'Data de Pagamento'
        });
        break;
      case 'images':
        break;
      default:
        this.cols.push({
          field: col,
          header: _.upperFirst(col).replace(new RegExp('_'), ' ')
        });
        break;
    }
  }

  showDialog(images) {
    this.dialog.open(ImagesComponent, { data: images });
  }
}
