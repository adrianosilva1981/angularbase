import { Component, OnInit } from '@angular/core';
import { SharedService } from '@app-admin-youhubshop/services/shared.service';
import { HyperToastsService } from 'lib-services';
import * as _ from 'lodash';

@Component({
    selector: 'app-admin-youhubshop-commissions',
    templateUrl: './commissions.component.html',
    styleUrls: ['./commissions.component.less']
})
export class CommissionsComponent implements OnInit {

    dates: Date[] = [new Date(Date.now() - (10 * 24 * 60 * 60 * 1000)), new Date()];

    commissions: any;

    cols: any;


    constructor(
        private _sharedService: SharedService,
        private _hyperToastsService: HyperToastsService,
    ) {
        this.setCommissions();

    }

    ngOnInit() {
    }

    setCommissions() {
        if (!(this.dates[0] && this.dates[1])) {
            return;
        }
        this.commissions = [];
        this.cols = [];
        const data = {
            startDate: this.dates[0].toJSON().split('T')[0],
            endDate: this.dates[1].toJSON().split('T')[0],
        };
        this._sharedService.getCommissions(data).subscribe(
            response => {
                if (response.return) {
                    this.commissions = response.data;
                    Object.keys(this.commissions[0]).forEach(col => {
                        this.setCols(col);
                    });
                } else {
                    this._hyperToastsService.addToast('warn', 'Atenção', 'Não foi encontrado nem resultado nesse período');
                    console.log(response);
                }
            },
            err => {
                this._hyperToastsService.addToast('error', 'Error', 'Entre em contato com o Suporte!');
                console.error(err);
            }
        );
    }
    setCols(col: string) {
        switch (col) {
            case 'id':
                this.cols.push({
                    field: col,
                    header: 'Código da Loja',
                });
                break;
            case 'store':
                this.cols.push({
                    field: col,
                    header: 'Loja',
                });
                break;
            case 'businessman':
                this.cols.push({
                    field: col,
                    header: 'Empresário',
                });
                break;
            case 'business_amount':
                this.cols.push({
                    field: col,
                    header: 'Lucro Bruto',
                });
                break;
            case 'amount':
                this.cols.push({
                    field: col,
                    header: 'Total Pago',
                });
                break;
            case 'supplier_amount':
                this.cols.push({
                    field: col,
                    header: 'Fornecedor',
                });
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
