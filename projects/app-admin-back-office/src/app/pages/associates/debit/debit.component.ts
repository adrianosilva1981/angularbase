import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { SharedService } from '@app-admin-back-office/services/shared.service';
import { HyperToastsService } from 'lib-services';

@Component({
  selector: 'app-admin-back-office-debit',
  templateUrl: './debit.component.html',
  styleUrls: ['./debit.component.less']
})
export class DebitComponent implements OnInit {

  public associates: any;
  public associatesForData: any;
  public cols: any;

  constructor(
    private _sharedService: SharedService,
    private _hyperToastsService: HyperToastsService,
    private _router: Router,
  ) {

  }

  ngOnInit() {
  }

  setAssociates(query: string) {

    this._sharedService.getListAssociates(query).subscribe(
      response => {
        try {
          this.associates = [];
          this.cols = [];
          this.associates = response.data.filter(associate => associate.status !== 'E');
          Object.keys(this.associates[0]).forEach(col => {
            this.setCols(col);
          });
        } catch (TypeError) {
          this._hyperToastsService.addToast('warn', 'Warning', 'Não foi encontrado ninguém.\n');
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
        break;
      case 'name':
        this.cols.push({
          field: col,
          header: 'Nome',
        });
        break;
      case 'cnpj_cpf':
        this.cols.push({
          field: col,
          header: 'CNPJ/CPF',
        });
        break;
      case 'amount':
        this.cols.push({
          field: col,
          header: 'Saldo Atual',
        });
        break;
      case 'reason':
      case 'ativacao':
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
  selectAssociate(associate: any) {
    this._router.navigate(['/associates/debit/' + associate.id]);
  }

}
