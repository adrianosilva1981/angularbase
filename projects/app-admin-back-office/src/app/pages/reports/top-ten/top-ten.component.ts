import { Component, OnInit } from '@angular/core';
import { SharedService } from '@app-admin-back-office/services/shared.service';
import { HyperToastsService } from 'lib-services';
import * as _ from 'lodash';
import { Router } from '@angular/router';


@Component({
    selector: 'app-admin-back-office-top-ten',
    templateUrl: './top-ten.component.html',
    styleUrls: ['./top-ten.component.less']
})
export class TopTenComponent implements OnInit {
    data: any;
    cols: any;
    balance: number;
    rescue: number;
    constructor(
        private _sharedService: SharedService,
        private _hyperToastsService: HyperToastsService,
        private _route: Router
    ) {
        this.setData();
    }

    ngOnInit() {
    }

    setData() {
        this.data = [];
        this.cols = [];
        this.balance = 0;
        this.rescue = 0;
        this._sharedService.getTopTen().subscribe(
            response => {
                if (response.return) {
                    this.data = response.data;
                    this.data.forEach(element => {
                        this.balance += parseFloat(element.amount_total);
                        element.amount_total = parseFloat(element.amount_total === null ? 0 : element.amount_total);
                        this.rescue += parseFloat(element.amount_to_receive === null ? 0 : element.amount_to_receive);
                        element.amount_to_receive = parseFloat(element.amount_to_receive);
                    });
                    Object.keys(this.data[0]).forEach(col => {
                        this.setCols(col);
                    });
                } else {
                    this._hyperToastsService.addToast('warn', 'Atenção', response.msg);
                    this._route.navigate(['/dash']);
                }
            },
            err => {
                this._hyperToastsService.addToast('error', 'Error', err.msg);
            });
    }

    setCols(column) {
        switch (column) {
            case 'name':
                this.cols.push({
                    field: column,
                    header: 'Nome',
                });
                break;
            case 'email':
                this.cols.push({
                    field: column,
                    header: 'Email',
                });
                break;
            case 'cellphone':
                this.cols.push({
                    field: column,
                    header: 'Celular',
                });
                break;
            case 'amount_to_receive':
                this.cols.push({
                    field: column,
                    header: 'Solicitação de Resgate',
                });
                break;
            case 'amount_total':
                this.cols.push({
                    field: column,
                    header: 'Saldo',
                });
                break;
            default:
                this.cols.push({
                    field: column,
                    header: _.upperFirst(column).replace(new RegExp('_'), ' '),
                });
                break;
        }
    }

}
