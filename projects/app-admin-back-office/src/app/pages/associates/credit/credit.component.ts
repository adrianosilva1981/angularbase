import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HyperToastsService } from 'lib-services';
import { SharedService } from '@app-admin-back-office/services/shared.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-admin-back-office-credit',
  templateUrl: './credit.component.html',
  styleUrls: ['./credit.component.less']
})
export class CreditComponent implements OnInit {

  public associates: any;
  public associatesForData: any;
  public cols: any;

  constructor(
    private _sharedService: SharedService,
    private _hyperToastsService: HyperToastsService,
    private _router: Router,
  ) {
    const cookie = this._sharedService.getUserObject();
    // if (!(cookie.id === 1 || cookie.id === 8 || cookie.id === 3)) {
    //   this._hyperToastsService.addToast('error', 'Atenção', 'Você não tem permissão para acessar essa página!');
    //   this._router.navigate(['/']);
    // }
  }

  ngOnInit() {
  }

  setAssociates(query: string) {
    this.associates = [];
    this.cols = [];
    this._sharedService.getListAssociates(query).subscribe(
      response => {
        try {
          // console.log(response.data);
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
      case 'stage':
      case 'ativacao':
      case 'status':
      case 'parent':
      case 'grid_info':
      case 'id':
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
    this._router.navigate(['/associates/credit/' + associate.id]);
  }

}
