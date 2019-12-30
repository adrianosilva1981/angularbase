import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { SharedService } from '@app-admin-back-office/services/shared.service';
import { HyperToastsService } from 'lib-services';

@Component({
  selector: 'app-admin-back-office-financing-plots',
  templateUrl: './financing-plots.component.html',
  styleUrls: ['./financing-plots.component.less']
})
export class FinancingPlotsComponent implements OnInit {

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
    this._sharedService.getFirstPlotsFinancing(query).subscribe(
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
      case 'username':
        this.cols.push({
          field: col,
          header: 'Código'
        });
        break;
      case 'name':
        this.cols.push({
          field: col,
          header: 'Nome'
        });
        break;
      case 'cpf_cnpj':
        this.cols.push({
          field: col,
          header: 'CPF/CNPJ'
        });
        break;
      case 'parcel':
        this.cols.push({
          field: col,
          header: 'Parcela'
        });
        break;
      case 'value':
        this.cols.push({
          field: col,
          header: 'Valor'
        });
        break;
      case 'date_payment':
        this.cols.push({
          field: col,
          header: 'Data de Pagamento'
        });
        break;

      default:
        this.cols.push({
          field: col,
          header: _.upperFirst(col).replace(new RegExp('_'), ' ')
        });
        break;
    }
  }

  dateFlag(date: string = null): any {
    return { color: (new Date(date) < new Date() ? 'red' : '') };
  }

}
