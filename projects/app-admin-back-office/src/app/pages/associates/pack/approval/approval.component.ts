import { Component, OnInit } from '@angular/core';
import { SharedService } from '@app-admin-back-office/services/shared.service';
import * as _ from 'lodash';
import swal from 'sweetalert2';
import { HyperToastsService } from 'lib-services';

@Component({
    selector: 'app-admin-back-office-approval',
    templateUrl: './approval.component.html',
    styleUrls: ['./approval.component.less']
})
export class ApprovalComponent implements OnInit {

    associates: any;
    cols: any;
    colsQuery: any;

    constructor(
        private _sharedService: SharedService,
        private _hyperToastsService: HyperToastsService,
    ) {
        this.setAssociates();
    }

    ngOnInit() {
    }

    setAssociates(): any {
        this.associates = [];
        this.cols = [];
        this.colsQuery = [];
        this._sharedService.getListAssociateWithOrderProcessing().subscribe(
            response => {
                if (response.return) {
                    this.associates = response.data;
                    Object.keys(this.associates[0]).forEach(col => {
                        this.setCols(col);
                    });
                }
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
                this.colsQuery.push(col);
                break;
            case 'method':
                this.cols.push({
                    field: col,
                    header: 'Método',
                });
                this.colsQuery.push(col);
                break;
            case 'value':
                this.cols.push({
                    field: col,
                    header: 'Valor',
                });
                this.colsQuery.push(col);
                break;
            case 'creation_date':
                this.cols.push({
                    field: col,
                    header: 'Data de Criação',
                });
                this.colsQuery.push(col);
                break;

            case 'id_reseller_order':
                break;
            default:
                this.cols.push({
                    field: col,
                    header: _.upperFirst(col).replace(new RegExp('_'), ' '),
                });
                this.colsQuery.push(col);
                break;
        }
    }

    validate(associate) {
        swal({
            title: 'Atenção!',
            text: 'Deseja realmente aprovar R$' + associate.value + ' de ' + associate.name + '?',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Confirmar',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (!result.dismiss) {
                const data = {
                    id_reseller_order: associate.id_reseller_order,
                    value: associate.value,
                    status: 'PC'
                };
                // console.log(data);
                this._sharedService.associateOrderAproval(data).subscribe(
                    response => {
                        if (response.return) {
                            this.setAssociates();
                            this._hyperToastsService.addToast('success', 'Sucesso', response.msg);
                        } else {
                            this._hyperToastsService.addToast('error', 'Error', response.msg);
                        }
                    },
                    err => {
                        this._hyperToastsService.addToast('error', 'Error', err.msg);
                    }
                );
            }
        },
            err => {
                this._hyperToastsService.addToast('error', 'Error', err.msg);
            }
        );
    }

    denied(associate) {
        swal({
            title: 'Atenção!',
            text: 'Deseja realmente recusar R$' + associate.value + ' de ' + associate.name + '?',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Confirmar',
            cancelButtonText: 'Cancelar',
            input: 'text',
            inputValue: '',
            inputPlaceholder: 'Motivo',
            inputValidator: (value) => {
                return !value && 'Precisamos de um motivo!';
            },
        }).then((result) => {
            if (!result.dismiss) {
                const data = {
                    id_reseller_order: associate.id_reseller_order,
                    value: associate.value,
                    status: 'PN',
                    msg: result.value
                };
                // console.log(data);
                this._sharedService.associateOrderAproval(data).subscribe(
                    response => {
                        if (response.return) {
                            this.setAssociates();
                            this._hyperToastsService.addToast('success', 'Sucesso', response.msg);
                        } else {
                            this._hyperToastsService.addToast('error', 'Error', response.msg);
                        }
                    },
                    err => {
                        this._hyperToastsService.addToast('error', 'Error', err.msg);
                    }
                );
            }
        },
            err => {
                this._hyperToastsService.addToast('error', 'Error', err.msg);
            }
        );
    }


}
