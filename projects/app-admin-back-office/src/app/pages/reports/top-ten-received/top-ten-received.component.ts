import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HyperToastsService } from 'lib-services';
import { SharedService } from '@app-admin-back-office/services/shared.service';
import * as _ from 'lodash';


@Component({
    selector: 'app-admin-back-office-top-ten-received',
    templateUrl: './top-ten-received.component.html',
    styleUrls: ['./top-ten-received.component.less']
})
export class TopTenReceivedComponent implements OnInit {

    associates: any;
    cols: any;
    total: number;



    constructor(
        private _sharedService: SharedService,
        private _hyperToastsService: HyperToastsService,
        private _router: Router,
    ) {

        this.setAssociates();

    }

    ngOnInit() {
    }

    setAssociates() {
        this.associates = [];
        this.cols = [];
        this.total = 0;
        this._sharedService.getTopTenReceived().subscribe(
            response => {
                if (response.return) {
                    this.associates = response.data;
                    this.associates.forEach(associate => {
                        this.total += parseFloat(associate.sum);
                        associate.sum = parseFloat(associate.sum); // banco retorna como string e para fazer ordenado ele leva em consideração o ponto não representando correta a ordenação
                    });
                    Object.keys(this.associates[0]).forEach(col => {
                        this.setCols(col);
                    });
                } else {
                    this._hyperToastsService.addToast('warn', 'Error', response.msg);
                }
            },
            err => {
                this._hyperToastsService.addToast('error', 'Error', err.msg);
            }
        );
    }

    setCols(col: string) {
        switch (col) {
            case 'name':
                this.cols.push(
                    {
                        field: col,
                        header: 'Nome'
                    }
                );
                break;
            case 'sum':
                this.cols.push(
                    {
                        field: col,
                        header: 'Valor Recebido'
                    }
                );
                break;
            case 'username':
                this.cols.push(
                    {
                        field: col,
                        header: 'Código'
                    }
                );
                break;
            case 'id_reseller':
                break;
            default:
                this.cols.push(
                    {
                        field: col,
                        header: _.upperFirst(col).replace(new RegExp('_'), ' ')
                    }
                );
                break;
        }
    }

}
