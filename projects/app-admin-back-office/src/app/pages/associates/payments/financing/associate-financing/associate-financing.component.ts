import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { SharedService } from '@app-admin-back-office/services/shared.service';
import { HyperToastsService } from 'lib-services';

@Component({
  selector: 'app-admin-back-office-associate-financing',
  templateUrl: './associate-financing.component.html',
  styleUrls: ['./associate-financing.component.less']
})
export class AssociateFinancingComponent implements OnInit {

  public associates: any[] = [];
  public cols: any[] = [];

  constructor(
    private _sharedService: SharedService,
    private _hyperToastsService: HyperToastsService,
  ) {

  }

  ngOnInit() {
  }

  setAssociates(query: string = null) {
    this._sharedService.getAssociatesFinancing(query).subscribe(
      response => {
        if (response.return) {
          this.cols = [];
          this.associates = [];
          this.associates = response.data;
          Object.keys(this.associates[0]).forEach((col: string) => this.setCols(col));
        } else {
          this._hyperToastsService.addToast('warn', 'Atenção', response.msg);
        }
      },
      err => {
        this._hyperToastsService.addToast('error', 'Error', 'Aconteceu algum erro!');
        console.error(err);
      }
    );
  }

  setCols(col: string) {
    switch (col) {
      case 'username': this.cols.push({ field: col, header: 'Código' }); break;
      case 'name': this.cols.push({ field: col, header: 'Nome' }); break;
      case 'cpf_cnpj': this.cols.push({ field: col, header: 'CPF/CNPJ' }); break;
      case 'plots': this.cols.push({ field: col, header: 'Parcelas' }); break;
      case 'value_buy': this.cols.push({ field: col, header: 'Valor Total' }); break;
      case 'value_init': this.cols.push({ field: col, header: 'Valor de Entrada' }); break;
      case 'value_financed': this.cols.push({ field: col, header: 'Valor Financiado' }); break;
      case 'request_date': this.cols.push({ field: col, header: 'Data do Requerimento' }); break;
      // default: this.cols.push({ field: col, header: _.upperFirst(col).replace(new RegExp('_'), ' ') }); break;
    }
  }
}
