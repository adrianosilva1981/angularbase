import { Component, OnInit } from '@angular/core';
import { SharedService } from '@app-admin-back-office/services/shared.service';
import { HyperToastsService } from 'lib-services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-back-office-manual-payment',
  templateUrl: './manual-payment.component.html',
  styleUrls: ['./manual-payment.component.less']
})
export class ManualPaymentComponent implements OnInit {

  users: any[];
  cols = [];

  constructor(
    private _sharedService: SharedService,
    private _hyperToastsService: HyperToastsService,
    private _router: Router) {

    this._sharedService.getManuallyActivatedAssociates().subscribe(
      response => {
        if (response.return) {
          this.users = response.data;
          Object.keys(this.users[0]).forEach(element => {
            this.setCols(element);
          });
        } else {
          this._hyperToastsService.addToast('warn', 'Atenção', response.msg);
        }
      },
      err => {
        this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro inesperado. Atualize a página e tente novamente');
        this._router.navigate(['/login']);
      }
    );
  }

  ngOnInit() {
  }

  setCols(col: string) {
    switch (col) {
      case 'cnpj_cpf':
        this.cols.push({
          field: col,
          header: 'CNPJ/CPF',
        });
        break;
      case 'name':
        this.cols.push({
          field: col,
          header: 'Nome',
        });
        break;
      case 'username':
        this.cols.push({
          field: col,
          header: 'Username',
        });
        break;
      case 'email':
        this.cols.push({
          field: col,
          header: 'E-mail',
        });
        break;
      // case 'id':
      //   break;
      // case 'id_reseller':
      //   break;
      default:
        break;
    }
  }

}
