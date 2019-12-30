import { Component, OnInit } from '@angular/core';
import { SharedService } from '@app-admin-back-office/services/shared.service';
import * as _ from 'lodash';
import { MatDialog } from '@angular/material';
import { HyperToastsService } from 'lib-services';
import swal from 'sweetalert2';
import { DialogImageComponent } from '@app-admin-back-office/components/dialog-image/dialog-image.component';
import { Router } from '@angular/router';


@Component({
    selector: 'app-admin-back-office-validation-document',
    templateUrl: './validation-document.component.html',
    styleUrls: ['./validation-document.component.less']
})
export class ValidationDocumentComponent implements OnInit {

    associates: any;
    cols: any;
    colsQuery: any;
    display = false;
    url = null;

    constructor(
        private _sharedService: SharedService,
        private _dialog: MatDialog,
        private _hyperToastsService: HyperToastsService,
        private _router: Router
    ) {
        this.getAssociates();

    }

    getAssociates() {
        this.associates = [];
        this.cols = [];
        this.colsQuery = [];
        this._sharedService.getUnvailidateAssociates().subscribe(
            response => {
                if (response.return) {
                    try {
                        this.associates = response.data;
                        Object.keys(this.associates[0]).forEach(col => {
                            this.setCols(col);
                        });
                    } catch (TypeError) {
                        this._hyperToastsService.addToast('warn', 'Warning', 'Não existe associados para validar!');
                        return;
                    }
                } else {
                    this._hyperToastsService.addToast('warn', 'Warning', response.msg);
                    this._router.navigate(['/dash']);
                }
            },
            err => {
                console.log(err.data);
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
            case 'cnpj_cpf':
                this.cols.push({
                    field: col,
                    header: 'CNPJ/CPF',
                });
                this.colsQuery.push(col);
                break;

            case 'id':
            case 'email':
            case 'corporative_name':
            case 'username':
            case 'cellphone':
            case 'id_document':
            case 'url':
            case 'quantity':
                break;
            default:
                this.cols.push({
                    field: col,
                    header: _.replace(col, new RegExp('_'), '/').toUpperCase()
                });
                break;
        }
    }

    ngOnInit() {
    }

    validate(user) {
        swal({
            title: 'Atenção!',
            text: 'Deseja realmente validar o CPF de ' + user.name + '?',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Confirmar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (!result.dismiss) {
                const data = {
                    result: 'accept',
                    id: user.id,
                    id_document: user.id_document,
                    msg: user.reason,
                };
                this._sharedService.validateAssociate(data).subscribe(
                    response => {
                        this.msg(response);
                        if (response.return) {
                            this.getAssociates();
                        }
                    },
                    err => {
                        this.error(err);
                    });
            }
        },
            err => {
                console.log(err);
            }
        );
    }

    denied(user) {
        swal({
            title: 'Atenção!',
            text: 'Deseja realmente recusar o CPF de ' + user.name + '?',
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
                    result: 'denied',
                    id: user.id,
                    id_document: user.id_document,
                    msg: result.value,
                };
                this._sharedService.validateAssociate(data).subscribe(
                    response => {
                        this.msg(response);
                        if (response.return) {
                            this.getAssociates();
                        }
                    },
                    err => {
                        this.error(err);
                    });
            }
        },
            err => {
                console.log(err);
            }
        );
    }


    msg(response) {
        if (response.return) {
            this._hyperToastsService.addToast('success', 'Success', response.msg);
        } else {
            this._hyperToastsService.addToast('warn', 'Warning', response.msg);
        }
    }

    error(err) {
        this._hyperToastsService.addToast('err', 'Error', err.msg);
    }


    showDialog(user) {
        const dialogRef = this._dialog.open(DialogImageComponent, {
            data: {user: user, type: 'image'},
            panelClass: 'globalModalHJ'
        });
        dialogRef.afterClosed().subscribe(result => { });
    }

}
