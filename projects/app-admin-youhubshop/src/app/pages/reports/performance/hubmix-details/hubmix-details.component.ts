import { HyperToastsService } from 'lib-services';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { SharedService } from '@app-admin-youhubshop/services/shared.service';
import * as _ from 'lodash';

@Component({
    selector: 'app-admin-youhubshop-hubmix-details',
    templateUrl: './hubmix-details.component.html',
    styleUrls: ['./hubmix-details.component.less']
})
export class HubmixDetailsComponent implements OnInit {

    details: any;
    cols: any;
    startDate: Date;
    endDate: Date;
    total: number;
    typeClient: any[] = [
        {
            label: 'Todos',
            value: '',
        },
        {
            label: 'HubMix',
            value: 'HubMix',
        },
        {
            label: 'Associado',
            value: 'Associado',
        },
        {
            label: 'Prime',
            value: 'Prime',
        },
    ];

    constructor(
        private _activatedRoute: ActivatedRoute,
        private _sharedService: SharedService,
        private _router: Router,
        private _hyperToastsService: HyperToastsService,
    ) {
        this.setDetails();
    }

    ngOnInit() {

    }

    setDetails() {
        this.details = [];
        this.cols = [];
        this.total = 0;
        this.startDate = new Date(this._activatedRoute.snapshot.queryParams.startDate + ' 00:00:00');
        this.endDate = new Date(this._activatedRoute.snapshot.queryParams.endDate + ' 23:59:59');
        const data = {
            startDate: this._activatedRoute.snapshot.queryParams.startDate,
            endDate: this._activatedRoute.snapshot.queryParams.endDate
        };
        this._sharedService.getHubmixDetails(data).subscribe(
            response => {
                if (response.return) {
                    this.details = response.data;
                    this.details.forEach(detail => {
                        this.total += parseFloat(detail.points);
                    });
                    this.total = Math.trunc(this.total);
                    Object.keys(this.details[0]).forEach((col: string) => {
                        this.setCols(col);
                    });
                } else {
                    this._hyperToastsService.addToast('warn', 'Atenção', 'Não foi encontrando nem um ponto nesse tempo!');
                    this._router.navigate(['reports/performance']);
                }
            },
            err => {
                this._hyperToastsService.addToast('error', 'Error', 'Aconteceu algum error entre em contato com o Suporte');
                console.log(err);
                this._router.navigate(['reports/performance']);
            }
        );
    }

    setCols(col: string) {
        switch (col) {
            case 'name':
                this.cols.push({
                    field: col,
                    header: 'Nome',
                });
                break;
            case 'points':
                this.cols.push({
                    field: col,
                    header: 'Pontos',
                });
                break;
            case 'date_creation':
                this.cols.push({
                    field: col,
                    header: 'Data',
                });
                break;
            case 'type_client':
                this.cols.push({
                    field: col,
                    header: 'Tipo do Cliente',
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

    sumPoints(dt, value, col) {
        this.total = 0;
        this.details.forEach(detail => {
            if (detail[col.field] === value) {
                this.total += parseFloat(detail.points);
            } else if (value === '') {
                this.total += parseFloat(detail.points);
            }
        });
        this.total = Math.trunc(this.total);
        dt.filter(value, col.field, col.filterMatchMode);
    }

}
