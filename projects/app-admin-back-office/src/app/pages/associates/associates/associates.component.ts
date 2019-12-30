import { Component, OnInit } from '@angular/core';
import { SharedService } from '@app-admin-back-office/services/shared.service';
import { HyperToastsService, ExcelService } from 'lib-services';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { DataTable } from 'primeng/primeng';


@Component({
    selector: 'app-admin-back-office-associates',
    templateUrl: './associates.component.html',
    styleUrls: ['./associates.component.less']
})
export class AssociatesComponent implements OnInit {

    public associates: any[] = [];
    public cols: any[] = [];
    public status: any[] = [];

    constructor(
        private _sharedService: SharedService,
        private _hyperToastsService: HyperToastsService,
        private _router: Router,
        private _excelService: ExcelService
    ) {
        this.setStatus();
    }

    ngOnInit() { }

    setStatus() {
        this.status = this._sharedService.listEnumStatus() as Array<any>;
    }

    setAssociates(query: string = null) {
        this._sharedService.getListAssociates(query).subscribe(
            response => {
                if (response.return) {
                    this.associates = [];
                    this.cols = [];
                    response.data.forEach(associate => {
                        associate.grid_info = JSON.parse(associate.grid_info);
                        associate.parent = JSON.parse(associate.parent);
                    });
                    this.associates = response.data;
                    if (this.associates.length) {
                        Object.keys(this.associates[0]).forEach(element => {
                            this.setCols(element);
                        });
                    }
                } else {
                    this._hyperToastsService.addToast('warn', 'Atenção', response.msg);
                }
            },
            err => {
                this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro inesperado. Atualize a página e tente novamente');
                this._router.navigate(['/login']);
            }
        );
    }

    setCols(col: string) {
        switch (col) {
            case 'cnpj_cpf':
                this.cols.push({
                    field: col,
                    header: 'CNPJ/CPF',
                });
                break;
            case 'name':
                this.cols.push({
                    field: col,
                    header: 'Nome',
                });
                break;

            case 'username':
                this.cols.push({
                    field: col,
                    header: 'Código',
                });
                break;
            case 'stage':
                this.cols.push({
                    field: col,
                    header: 'Situação',
                });
                break;
            case 'status':
                this.cols.push({
                    field: col,
                    header: 'Status',
                });
                break;
            case 'ativacao':
                this.cols.push({
                    field: col,
                    header: 'Primeira Ativação',
                });
                break;
            case 'id':
            case 'cellphone':
            case 'grid_info':
            case 'parent':
            case 'amount': break;
            default:
                this.cols.push({
                    field: col,
                    header: _.upperFirst(col).replace(new RegExp('_'), ' ')
                });
                break;
        }
    }

    statusLabel(user): string {
        return this.status.filter(x => x.value === user.status).map(x => x.label)[0];
    }

    export(dt: DataTable) {
        const data: any[] = (dt.filteredValue || dt.value).map((associate: any) => ({
            'Código': associate.username, 'Nome': associate.name, 'CNPJ/CPF': associate.cnpj_cpf, 'Email': associate.email, 'Celular': associate.cellphone
        }));
        if (!data.length) {
            return;
        }
        this._excelService.exportAsExcelFile(data, null, 'associados');
    }

}
