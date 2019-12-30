import { DataTable } from 'primeng/primeng';
import { Component, OnInit } from '@angular/core';
import { SharedService } from '@app-admin-back-office/services/shared.service';
import * as _ from 'lodash';
import { HyperToastsService } from 'lib-services';
import { MatDialog } from '@angular/material';
import { DialogImageComponent } from '@app-admin-back-office/components/dialog-image/dialog-image.component';



@Component({
  selector: 'app-admin-back-office-discharge',
  templateUrl: './discharge.component.html',
  styleUrls: ['./discharge.component.less']
})
export class DischargeComponent implements OnInit {

  associates = [];
  cols = [];
  total = 0;
  startDate = new Date(Date.now() - (1000 * 60 * 60 * 24 * 10)); //data do dia a 10 dias atrás em relação ao dia atual
  dates = [this.startDate, new Date()];

  constructor(
    private _sharedService: SharedService,
    private _dialog: MatDialog,
    private _hyperToastsService: HyperToastsService
  ) {
    this.setAssociates();
  }

  ngOnInit() {

  }

  setAssociates() {
    try {
      this.total = 0;
      this.associates = [];
      this.cols = [];
      const data = {
        dateFrom: this.dates[0].toISOString().split('T')[0],
        dateTo: this.dates[1].toISOString().split('T')[0],
      };
      this._sharedService.getListDischargeAssociatesByDate(data).subscribe(
        response => {
          try {
            this.associates = response.data;
            this.total = response.data.map(x => parseFloat(x.value_receiver)).reduce(((sum, value) => sum + value), 0);
            Object.keys(this.associates[0]).forEach((col: string) => {
              this.setCols(col);
            });
          } catch (TypeError) {
            this._hyperToastsService.addToast('warn', 'Warning', 'Não Existem associados nesse período.');
          }
        },
        err => {
          this._hyperToastsService.addToast('error', 'Error', err.msg);
        });
    } catch (TypeError) {
      return;
    }
  }
  setCols(element) {
    switch (element) {
      case 'username':
        this.cols.push({
          field: element,
          header: 'Código',
        });
        break;
      case 'name':
        this.cols.push({
          field: element,
          header: 'Nome',
        });
        break;
      case 'method':
        this.cols.push({
          field: element,
          header: 'Método',
        });
        break;
      case 'value_receiver':
        this.cols.push({
          field: element,
          header: 'Resgatado',
        });
        break;
      case 'stage':
        this.cols.push({
          field: element,
          header: 'Etapa',
        });
        break;
      // fazer nada com esse campos
      case 'id':
      case 'value':
        break;
      case 'url':
        break;
      default:
        this.cols.push({
          field: element,
          header: _.upperFirst(element).replace(new RegExp('_'), ' '),
        });
        break;
    }
  }

  showDialog(user) {
    const dialogRef = this._dialog.open(DialogImageComponent, {
      data: { user: user, type: 'image' },
      panelClass: 'globalModalHJ'
    });
    dialogRef.afterClosed().subscribe(result => { });
  }

  sumTotal(dt: DataTable) {
    setTimeout(() => {
      if (dt.filteredValue) {
        this.total = dt.filteredValue.map(x => parseFloat(x.value_receiver)).reduce(((sum, value) => sum + value), 0);
      } else {
        this.total = dt.value.map(x => parseFloat(x.value_receiver)).reduce(((sum, value) => sum + value), 0);
      }
    }, dt.filterDelay);
  }

}
