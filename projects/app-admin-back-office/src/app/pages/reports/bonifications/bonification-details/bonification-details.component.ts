import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from '@app-admin-back-office/services/shared.service';
import { HyperToastsService } from 'lib-services';
import * as _ from 'lodash';


@Component({
  selector: 'app-admin-back-office-bonification-details',
  templateUrl: './bonification-details.component.html',
  styleUrls: ['./bonification-details.component.less']
})
export class BonificationDetailsComponent implements OnInit {

  extracts: any;
  cols: any;
  colsQuery: any;
  total: number;

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _sharedService: SharedService,
    private _hyperToastsService: HyperToastsService,
    private _router: Router,
  ) {
    this.setExtracts(this._activatedRoute.snapshot.params['associate']);
  }

  ngOnInit() {
  }

  setExtracts(associateId: number) {
    this.extracts = [];
    this.cols = [];
    this.colsQuery = [];
    this.total = 0;
    this._sharedService.getBonificationAssociate(associateId).subscribe(
      response => {
        this.extracts = response.data.list_extract;
        for (let index = 0; index < this.extracts.length; index++) {
          if (this.extracts[index].type_operation === 'C') {
            this.extracts[index].type_operation = 'Crédito';
            this.total += parseFloat(this.extracts[index].point);
          } else if (this.extracts[index].type_operation === 'D') {
            this.extracts[index].type_operation = 'Debito';
            this.total -= parseFloat(this.extracts[index].point);
          }
        }
        Object.keys(this.extracts[0]).forEach(col => {
          this.setCols(col);
        });
      },
      err => {
        console.log(err);
        this._hyperToastsService.addToast('error', 'Error', err.msg);
        this._router.navigate(['/reports/bonifications']);
      });
  }
  setCols(col: string) {
    switch (col) {
      case 'source_name':
        this.cols.push({
          field: col,
          header: 'Nome',
        });
        break;
      case 'source_username':
        this.cols.push({
          field: col,
          header: 'Código',
        });
        break;
      case 'point':
        this.cols.push({
          field: col,
          header: 'Bônus',
        });
        break;
      case 'description':
        this.cols.push({
          field: col,
          header: 'Descrição',
        });
        break;
      case 'type_operation':
        this.cols.push({
          field: col,
          header: 'Tipo',
        });
        break;
      case 'date_created':
        this.cols.push({
          field: col,
          header: 'Data',
        });
        break;

      case 'type':
      case 'bonus_type':
      case 'source_id':
      case 'history':
        break;
      default:
        this.cols.push({
          field: col,
          header: _.upperFirst(col).replace(new RegExp('_'), ' '),
        });
        break;
    }
  }

}
