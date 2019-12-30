import { HyperToastsService, ExcelService } from 'lib-services';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from '@app-admin-back-office/services/shared.service';
import * as _ from 'lodash';
// import { DetailsAddressComponent } from '@app-admin-back-office/components/Modals/details-address/details-address.component';
// import { MatDialog } from '@angular/material';
import { DataTable } from 'primeng/primeng';


@Component({
    selector: 'app-admin-back-office-pack-sold-details',
    templateUrl: './pack-sold-details.component.html',
    styleUrls: ['./pack-sold-details.component.less']
})
export class PackSoldDetailsComponent implements OnInit {

    packagesSold: any;
    cols: any;

    constructor(
        private _activatedRoute: ActivatedRoute,
        private _sharedService: SharedService,
        private _hyperToastsService: HyperToastsService,
        private _router: Router,
        private _excelService: ExcelService,
        // private _dialog: MatDialog,
    ) {

        this.setPacagesSold(this._activatedRoute.snapshot.queryParams['id'], this._activatedRoute.snapshot.queryParams['stage']);

    }

    ngOnInit() { }

    setPacagesSold(id: number, stage: string) {
        this.packagesSold = [];
        this.cols = [];
        this._sharedService.getPackagesDetails({ 'id': id, 'stage': stage }).subscribe(
            response => {
                if (response.return) {
                    this.packagesSold = response.data;
                    Object.keys(this.packagesSold[0]).forEach(col => {
                        this.setCols(col);
                    });
                } else {
                    this._hyperToastsService.addToast('warn', 'Warning', response.smg);
                    this._router.navigate(['/']);
                }
            },
            err => {
                this._hyperToastsService.addToast('error', 'Error', err.msg);
                this._router.navigate(['/']);
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
            case 'cnpj_cpf':
                this.cols.push({
                    field: col,
                    header: 'CNPJ/CPF',
                });
                break;
            case 'cellphone':
                this.cols.push({
                    field: col,
                    header: 'Celular',
                });
                break;
            case 'method':
                this.cols.push({
                    field: col,
                    header: 'Metodo',
                });
                break;
            case 'amount_receiver':
                this.cols.push({
                    field: col,
                    header: 'Valor',
                });
                break;
            case 'address':
                break;
            case 'creation_date':
                this.cols.push({
                    field: col,
                    header: 'Data da Venda'
                });
                break;
            case 'payment_date':
                this.cols.push({
                    field: col,
                    header: 'Data do Pagamento'
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

    // addressDetails(data) {
    //     data = JSON.parse(data);
    //     const address = {
    //         'País': data.country,
    //         'Estado': data.stage,
    //         'Cidade': data.city,
    //         'CEP': data.zipcode,
    //         'Bairro': data.neighborhood,
    //         'Rua': data.street,
    //         'Complemento': data.complement,
    //         'Número': data.number,
    //     };
    //     const dialog = this._dialog.open(DetailsAddressComponent, {
    //         height: '600px',
    //         width: '600px',
    //         data: address,
    //     });
    // }

    export(dt: DataTable) {
        const data = dt.value.map(x => ({
            'Nome': x.name,
            'CPNJ/CPF': x.cnpj_cpf,
            'Email': x.email,
            'Celular': x.cellphone,
            'Metódo': x.method,
            'Valor': x.amount_receiver,
            'Data da venda': x.creation_date,
            'Data do Pagamento': x.payment_date
        }));
        this._excelService.exportAsExcelFile(data, null, 'arquivo');
        console.log(dt);
    }
}
