import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { SharedService } from '@app-admin-back-office/services/shared.service';
import { HyperToastsService, ExcelService } from 'lib-services';
import { DataTable } from 'primeng/primeng';

@Component({
    selector: 'app-admin-back-office-balance',
    templateUrl: './balance.component.html',
    styleUrls: ['./balance.component.less']
})
export class BalanceComponent implements OnInit {

    public associates: any[] = [];
    public cols: any[] = [];
    public points: number;
    public points_release: number;

    constructor(
        private _sharedService: SharedService,
        private _hyperToastsService: HyperToastsService,
        private _router: Router,
        private _excelService: ExcelService
    ) {

    }

    ngOnInit() {
    }

    setAssociates(query: string) {
        this._sharedService.getListBalance(query).subscribe(
            response => {
                if (response.return) {
                    this.associates = [];
                    this.cols = [];
                    this.associates = response.data;
                    this.associates.forEach(associate => {
                        associate.points = parseFloat(associate.points);
                        associate.points_release = parseFloat(associate.points_release);
                    });
                    Object.keys(this.associates[0]).forEach(col => {
                        this.setCols(col);
                    });
                    this.sumCheck();
                } else {
                    this._hyperToastsService.addToast('warn', 'Warning', response.msg);
                }
            },
            err => {
                this._hyperToastsService.addToast('error', 'Error', err.msg);
            }
        );
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
            case 'points':
                this.cols.push({
                    field: col,
                    header: 'Saldo Atual',
                });
                break;
            case 'points_release':
                this.cols.push({
                    field: col,
                    header: 'Saldo Disponível',
                });
                break;
            case 'id':
            case 'id_grid':
            case 'celula':
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
        this._router.navigate(['/associates/balance/' + associate.id]);
    }

    sumCheck(dt: DataTable = null) {
        setTimeout(() => {
            const associates = dt ? (dt.filteredValue || dt.value) : this.associates;
            this.points = associates.map(associate => associate.points).reduce(((sum, value) => sum + value), 0);
            this.points_release = associates.map(associate => associate.points_release).reduce(((sum, value) => sum + value), 0);
        }, (dt ? dt.filterDelay : 0));
    }

    export(dt: DataTable) {
        const data: any[] = (dt.filteredValue || dt.value).
            map((associate: any) => (
                {
                    'Código': associate.username,
                    'Nome': associate.name,
                    'Email': associate.email,
                    'CNPJ/CPF': associate.cnpj_cpf,
                    'Saldo Atual': associate.points,
                    'Saldo Disponível': associate.points_release
                }
            ));
        if (!data.length) {
            return;
        }
        this._excelService.exportAsExcelFile(data, null, 'saldo_associados');
    }

}
