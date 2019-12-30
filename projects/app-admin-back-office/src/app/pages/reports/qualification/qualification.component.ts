import { Component, OnInit } from '@angular/core';
import { SharedService } from '@app-admin-back-office/services/shared.service';
import { HyperToastsService, ExcelService } from 'lib-services';
import * as _ from 'lodash';
import { DataTable } from 'primeng/primeng';

@Component({
    selector: 'app-admin-back-office-qualification',
    templateUrl: './qualification.component.html',
    styleUrls: ['./qualification.component.less']
})
export class QualificationComponent implements OnInit {
    public associates: any[] = [];
    public cols: any[] = [];
    public status: any[] = [];


    constructor(
        private _sharedService: SharedService,
        private _hyperToastsService: HyperToastsService,
        private _excelService: ExcelService
    ) {
        this.setAssociates();
        this.setStatus();
    }

    ngOnInit() { }

    setStatus() {
        this.status = this._sharedService.listEnumStatus() as Array<any>;
    }

    setAssociates() {
        this._sharedService.getQualification().subscribe(
            response => {
                if (response.return) {
                    this.associates = response.data;
                    Object.keys(this.associates[0]).forEach((col: string) => {
                        this.setCols(col);
                    });
                } else {
                    this._hyperToastsService.addToast('warn', 'Atenção', response.msg);
                }
            },
            err => {
                this._hyperToastsService.addToast('error', 'Atenção', err.msg);
                console.error(err);
            }
        );
    }
    setCols(col: string): any {
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
            case 'cellphone':
                this.cols.push({
                    field: col,
                    header: 'Celular'
                });
                break;
            case 'cpf_cnpj':
                this.cols.push({
                    field: col,
                    header: 'CPF/CNPJ'
                });
                break;
            case 'graduation':
                this.cols.push({
                    field: col,
                    header: 'Graduação'
                });
                break;
            case 'city':
                this.cols.push({
                    field: col,
                    header: 'Cidade'
                });
                break;
            case 'state':
                this.cols.push({
                    field: col,
                    header: 'Estado'
                });
                break;
            case 'country':
                this.cols.push({
                    field: col,
                    header: 'País'
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

    export(dt: DataTable) {
        const data: any[] = (dt.filteredValue || dt.value)
            .map((associate: any) => (
                {
                    'Código': associate.username,
                    'Nome': associate.name,
                    'Email': associate.email,
                    'Celular': associate.cellphone,
                    'CNPJ/CPF': associate.cnpj_cpf,
                    'Status': this.status.filter(x => x.value === associate.status).map(x => x.label)[0],
                    'Graduação': associate.graduation,
                    'Cidade': associate.city,
                    'Estado': associate.state,
                    'País': associate.country
                }
            ));
        if (!data.length) {
            return;
        }
        this._excelService.exportAsExcelFile(data, null, 'associados');
    }

}
