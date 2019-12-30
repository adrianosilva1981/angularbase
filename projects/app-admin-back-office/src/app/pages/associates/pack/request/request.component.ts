import { Component, OnInit } from '@angular/core';
import { SharedService } from '@app-admin-back-office/services/shared.service';
import { HyperToastsService } from 'lib-services';
import { Router } from '@angular/router';
import * as _ from 'lodash';


@Component({
  selector: 'app-admin-back-office-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.less']
})
export class RequestComponent implements OnInit {

  associates: any;
  associatesForData: any;
  cols: any;
  colsQuery: any;
  flag = true;

  constructor(
    private _sharedService: SharedService,
    private _hyperToastsService: HyperToastsService,
    private _router: Router,
  ) {

  }

  ngOnInit() {
  }

  setAssociates(query: string) {
    this.associates = [];
    this.cols = [];
    this.colsQuery = [];
    this._sharedService.getListAssociates(query).subscribe(
      response => {
        try {
          this.associates = response.data;
          this.associates.forEach(element => {
            element.amount=parseFloat(element.amount);
          });
          Object.keys(this.associates[0]).forEach(col => {
            this.setCols(col);
          });
          this.flag = true;
        } catch (TypeError) {
          this._hyperToastsService.addToast('warn', 'Warning', 'Não foi encontrado ninguém.\n');
          this.flag = false;
        }
      },
      err => {
        this._hyperToastsService.addToast('error', 'Error', err.msg);
      });
  }

  setCols(col: string) {
    switch (col) {
      case 'username':
        this.cols.push({
          field: col,
          header: 'Código',
        });
        this.colsQuery.push(col);
        break;
      case 'name':
        this.cols.push({
          field: col,
          header: 'Nome',
        });
        this.colsQuery.push(col);
        break;
      case 'cnpj_cpf':
        this.cols.push({
          field: col,
          header: 'CNPJ/CPF',
        });
        this.colsQuery.push(col);
        break;
      case 'amount':
        this.cols.push({
          field: col,
          header: 'Saldo Atual',
        });
        break;
      case 'reason':
      case 'stage':
      case 'status':
      case 'id':
      case 'parent':
      case 'grid_info':
      case 'email':
        break;

      default:
        this.cols.push({
          field: col,
          header: _.upperFirst(col).replace(new RegExp('_'), ' '),
        });
        break;
    }
  }

  // search(query: string) {
  //   this.setAssociates(query);
  // }

  selectAssociate(associate: any) {
    this._router.navigate(['/associates/pack/request/' + associate.id]);
  }

}
