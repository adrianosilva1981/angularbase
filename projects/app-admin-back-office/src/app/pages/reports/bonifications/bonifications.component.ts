import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from '@app-admin-back-office/services/shared.service';
import { HyperToastsService } from 'lib-services';
import * as _ from 'lodash';

@Component({
  selector: 'app-admin-back-office-bonifications',
  templateUrl: './bonifications.component.html',
  styleUrls: ['./bonifications.component.less']
})
export class BonificationsComponent implements OnInit {

  associates = [];
  cols = [];
  colsQuery = [];
  total = 0;
  toPay = 0;
  paid = 0;
  total_generated = 0;
  startDate = new Date(Date.now() - (1000 * 60 * 60 * 24 * 10)); //data do dia a 10 dias atrás em relação ao dia atual
  dates = [this.startDate, new Date()];

  constructor(
    private _sharedService: SharedService,
    private _hyperToastsService: HyperToastsService,
    private _router: Router,
  ) {
    this.setAssociates();
  }

  ngOnInit() {

  }

  setAssociates() {
    try {
      this.total = 0;
      this.toPay = 0;
      this.paid = 0;
      this.total_generated = 0;
      this.associates = [];
      this.colsQuery = [];
      this.cols = [];
      const data = {
        dateFrom: this.dates[0].toISOString().split('T')[0],
        dateTo: this.dates[1].toISOString().split('T')[0],
      };
      this._sharedService.getListBonificationsAssociatesByDate(data).subscribe(
        response => {
          try {
            this.associates = response.data;
            this.total_generated = this.associates[0].total_generated;
            this.associates.forEach((associate: any) => {
              this.toPay += parseFloat(associate.to_pay);
              this.paid += parseFloat(associate.paid);
              this.total += parseFloat(associate.value_credit);
              associate.value_credit=parseFloat(associate.value_credit);
              
            });
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
  setCols(element: string) {
    switch (element) {
      case 'username':
        this.cols.push({
          field: element,
          header: 'Código',
        });
        this.colsQuery.push(element);
        break;
      case 'name':
        this.cols.push({
          field: element,
          header: 'Nome',
        });
        this.colsQuery.push(element);
        break;
      case 'value_credit':
        this.cols.push({
          field: element,
          header: 'Bonificação',
        });
        break;
      case 'type':
        this.cols.push({
          field: element,
          header: 'Tipo',
        });
        break;
      // fazer nada com esse campos
      case 'to_pay':
        break;
      case 'paid':
        break;
      case 'total_generated':
        break;
      case 'id':
        break;
      default:
        this.cols.push({
          field: element,
          header: _.upperFirst(element).replace(new RegExp('_'), ' '),
        });
        break;
    }
  }

  details(associate) {
    this._router.navigate(['/reports/bonifications/' + associate.id]);
  }

}
