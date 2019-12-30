import { Component, OnInit } from '@angular/core';
import { HyperToastsService } from 'lib-services';
import { SharedService } from '@app-admin-back-office/services/shared.service';
import * as _ from 'lodash';

@Component({
    selector: 'app-admin-back-office-info-indicated',
    templateUrl: './info-indicated.component.html',
    styleUrls: ['./info-indicated.component.less']
})
export class InfoIndicatedComponent implements OnInit {

    public associates: any;
    public cols: any;
    public colsQuery: any;
    public rangeDates: Date[] = [new Date(Date.now() - (10 * 24 * 60 * 60 * 1000)), new Date()];



    constructor(
        private _sharedService: SharedService,
        private _hyperToastsService: HyperToastsService
    ) {
        this.checkDates();
    }

    ngOnInit() {
    }

    checkDates() {
        if (!this.rangeDates || !this.rangeDates[0] || !this.rangeDates[1]) {
            return;
        } else if (this.rangeDates[0] > this.rangeDates[1]) {
            const aux = this.rangeDates[0];
            this.rangeDates[0] = this.rangeDates[1];
            this.rangeDates[1] = aux;
        }
        const data = {
            startDate: this.rangeDates[0].toJSON().split('T')[0],
            endDate: this.rangeDates[1].toJSON().split('T')[0]
        };
        this.setAssociates(data);
    }

    setAssociates(data: { startDate: string, endDate: string } = null) {
        this.associates = [];
        this.cols = [];
        this.colsQuery = [];
        this._sharedService.getAssociatesIndicated(data).subscribe(
            response => {
                if (response.return) {
                    this.associates = response.data;
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
                this.colsQuery.push(col);
                break;
            case 'username':
                this.cols.push(
                    {
                        field: col,
                        header: 'Código'
                    }
                );
                this.colsQuery.push(col);
                break;
            case 'email':
                this.cols.push(
                    {
                        field: col,
                        header: 'Email'
                    }
                );
                this.colsQuery.push(col);
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
