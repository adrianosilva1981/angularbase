import { Component, OnInit } from '@angular/core';
import { SharedService } from '@app-admin-back-office/services/shared.service';
import { HyperToastsService } from 'lib-services';
import * as _ from 'lodash';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-admin-back-office-list-reseller',
  templateUrl: './list-reseller.component.html',
  styleUrls: ['./list-reseller.component.less']
})
export class ListResellerComponent implements OnInit {

  associates: any;
  associatesForData: any;
  cols: any;
  colsQuery: any;
  flag = false;

  constructor(
    private _sharedService: SharedService,
    private _hyperToastsService: HyperToastsService,
    public dialogRef: MatDialogRef<ListResellerComponent>
  ) { }

  ngOnInit() {
  }

  setAssociates(query: string) {
    this.associates = [];
    this.cols = [];
    this.colsQuery = [];
    this._sharedService.getListBalance(query).subscribe(
      response => {
        // console.log(response);
        if (response.return) {
          // console.log(response.data);
          this.associates = response.data;
          Object.keys(this.associates[0]).forEach(col => {
            this.setCols(col);
          });
          this.flag = true;
        } else {
          this._hyperToastsService.addToast('warn', 'Warning', response.msg);
          this.flag = false;
        }
      },
      err => {
        this.flag = false;
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
      case 'email':
        this.cols.push({
          field: col,
          header: 'E-mail',
        });
        this.colsQuery.push(col);
        break;
      case 'cnpj_cpf':
      case 'points':
      case 'points_release':
      case 'id':
      case 'celula':
        break;
      default:
        this.cols.push({
          field: col,
          header: _.upperFirst(col).replace(new RegExp('_'), ' '),
        });
        break;
    }
  }


  selectAssociate(associate: any) {
    const reseller = {
      id: associate.id,
      name: associate.name,
      username: associate.username
    };
    this.dialogRef.close(reseller);
  }

}
