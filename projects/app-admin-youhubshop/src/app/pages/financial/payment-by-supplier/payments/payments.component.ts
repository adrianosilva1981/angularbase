import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SharedService } from '@app-admin-youhubshop/services/shared.service';
import { HyperToastsService, ExcelService } from 'lib-services';
import * as _ from 'lodash';
import { Location } from '@angular/common';
import { DataTable } from 'primeng/primeng';

// tslint:disable:no-unused-expression
@Component({
    selector: 'app-admin-youhubshop-payments',
    templateUrl: './payments.component.html',
    styleUrls: ['./payments.component.less']
})
export class PaymentsComponent implements OnInit {
    public payments: any[] = [];
    public cols: any[] = [
        { field: 'request_date', header: 'Requesição' },
        { field: 'id_request', header: 'Código Requisição' },
        { field: 'id_bso_array', header: 'Código das compras' },
        { field: 'total_supplier_value', header: 'Repasse' },
        { field: 'total_freight_value', header: 'Frete' },
        { field: 'total_value', header: 'Total' },
        { field: 'bank', header: 'Banco' },
        { field: 'account', header: 'Conta' },
        { field: 'agency', header: 'Agência' },
        { field: 'cpf_cnpj', header: 'CPF/CNPJ' },
        { field: 'user_supplier', header: 'Fornecedor' }
    ];

    public selectedPayments: any;
    public flagDisabled = false;
    public debits: any;
    public total: Number = 0;
    public user: any;


    constructor(
        private _sharedService: SharedService,
        private _hyperToastsService: HyperToastsService,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _location: Location,
        private _excelService: ExcelService
    ) {
        this.getPayments(
            this._activatedRoute.snapshot.queryParams.id_user_supplier,
            this._activatedRoute.snapshot.queryParams.request_date
        );
        this.getDebits(this._activatedRoute.snapshot.queryParams.id_user_supplier);
    }

    ngOnInit() { }

    getDebits(id_user_supplier: number) {
        this._sharedService.getDebits(id_user_supplier).subscribe(
            response => {
                if (response.return) {
                    this.debits = response.data;
                }
            },
            err => {
                this._hyperToastsService.addToast('warn', 'Atenção', 'Pagamento da mensalidade do BackOffice não encontrada!');
                console.warn(err);
                return;
            }
        );
    }


    getPayments(id_user_supplier, request_date) {
        this._sharedService.getPayments(id_user_supplier, request_date).subscribe(
            response => {
                if (response.return) {
                    (this.payments = response.data.payments).forEach(
                        (payment) => {
                            payment.items = JSON.parse(payment.items);
                            !payment.bank && (payment.bank = 'Receber BackOffice');
                            payment.cpf_cnpj && (payment.cpf_cnpj = this.formatCpfOrCnpj(payment.cpf_cnpj));
                        }
                    );
                    this.user = response.data.user;
                } else {
                    this._hyperToastsService.addToast('success', 'Sucesso', 'Para este fornecedor neste dia foi tudo pago!');
                    console.warn(response.msg);
                    this._router.navigate(['/financial/payments']);
                }
            },
            err => {
                this._hyperToastsService.addToast('error', 'Error', 'Aconteceu algum problema, por favor entre em contato com o suporte!');
                console.error(err);
                return;
            }
        );
    }

    formatCpfOrCnpj(cpf_cnpj: String): String {
        switch (cpf_cnpj.length) {
            //cpf
            case 11: return cpf_cnpj.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, '\$1.\$2.\$3-\$4');
            //cnpj
            case 14: return cpf_cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g, '\$1.\$2.\$3\/\$4\-\$5');
            //retornar algo
            default: return cpf_cnpj;
        }
    }

    uploadImages(images) {
        if (!(images.files.length && this.selectedPayments.length)) {
            this._hyperToastsService.addToast('warn', 'Atenção', 'Você deve pelo menos carregar uma foto e/ou selecionar um fornecedor e um conta!');
            return;
        }
        this.flagDisabled = true;
        const imagesURL = [];
        images.files.forEach(image => {
            this._sharedService.uploadImage('yh_admin_hub', image).subscribe(
                response => {
                    if (response.return) {
                        imagesURL.push(response.data);
                        if (imagesURL.length === images.files.length) {
                            this.requestPayments(imagesURL, images);
                        }
                    } else {
                        this._hyperToastsService.addToast('error', 'Error', 'Aconteceu algum problema, por favor entre em contato com o suporte!');
                        console.warn(response);
                        return;
                    }
                },
                err => {
                    this._hyperToastsService.addToast('error', 'Error', 'Aconteceu algum problema, por favor entre em contato com o suporte!');
                    console.error(err);
                    return;
                }
            );
        });
    }

    requestPayments(imagesURL: string[], images) {
        const data = {
            request_payments: this.selectedPayments.map(payment => payment.id_request),
            images: imagesURL,
            id_user_supplier: this._activatedRoute.snapshot.queryParams.id_user_supplier
        };
        this._sharedService.setPayments(data).subscribe(
            response => {
                if (response.return) {
                    images.clear();
                    this._hyperToastsService.addToast('Success', 'Sucesso', 'Pagamento enviado com sucesso!');
                    this.getPayments(
                        this._activatedRoute.snapshot.queryParams.id_user_supplier,
                        this._activatedRoute.snapshot.queryParams.request_date
                    );
                } else {
                    this._hyperToastsService.addToast('warn', 'Atenção', 'Aconteceu algum problema consulte o Suporte.');
                    console.warn(response);
                }
                this.flagDisabled = false;
            },
            err => {
                this._hyperToastsService.addToast('error', 'Error', 'Aconteceu algum problema consulte o Suporte.');
                console.error(err);
            }
        );
    }

    sumTotal() {
        this.total = this.selectedPayments
            .map(
                (payment) => parseFloat(payment.total_value)
            )
            .reduce(
                (sum, value) => sum + value, 0
            );
    }

    back() {
        this._location.back();
    }

    exportExcel(dt: DataTable) {
        this._excelService.exportAsExcelFile((dt.filteredValue || dt.value), null, 'Pagamento do forncedor ' + this.user.name);
    }

}
