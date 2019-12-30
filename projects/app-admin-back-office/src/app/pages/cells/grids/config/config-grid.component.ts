
import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { SharedService } from '@app-admin-back-office/services/shared.service';
import { HyperToastsService } from 'lib-services';
import { MatDialog } from '@angular/material';
import { ListGridsComponent } from '@app-admin-back-office/components/Modals/list-grids/list-grids.component';

@Component({
  selector: 'app-admin-back-office-config-grid',
  templateUrl: './config-grid.component.html',
  styleUrls: ['./config-grid.component.less']
})
export class ConfigGridComponent implements OnInit {

  associates: any;
  associatesForData: any;
  cols: any;
  colsQuery: any;
  flag = false;
  query: string;

  constructor(
    private _sharedService: SharedService,
    private _hyperToastsService: HyperToastsService,
    public _dialog: MatDialog
  ) {

  }

  ngOnInit() {
  }

  setAssociates(query: string) {
    this.query = query;
    this.associates = [];
    this.cols = [];
    this.colsQuery = [];
    this._sharedService.getListBalance(query).subscribe(
      response => {
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
      case 'id_grid':
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
    const dialogRef = this._dialog.open(ListGridsComponent, {
      data: {
        id: associate.id,
        cell: associate.celula,
        id_grid: associate.id_grid // o nome da tela seguinte deve estar como cell
      },
    });
    dialogRef.afterClosed().subscribe(
      result => {
        if (result) {
          // console.log(result);
          this.setAssociates(this.query);
        }
      });
  }

}
