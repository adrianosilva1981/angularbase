import { Component, OnInit, ViewChild } from '@angular/core';
import { SharedService } from '@app-admin-youhubshop/services/shared.service';
import { Router, ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';
import { DataTable, InputText } from 'primeng/primeng';
import { ExcelService, HyperToastsService } from 'lib-services';

@Component({
    selector: 'app-admin-youhubshop-payment-by-supplier',
    templateUrl: './payment-by-supplier.component.html',
    styleUrls: ['./payment-by-supplier.component.less']
})
export class PaymentBySupplierComponent implements OnInit {

    public payments: any[] = [];
    public cols: any[] = [
        { field: 'request_date', header: 'Requisição' },
        { field: 'id_user_supplier', header: 'Código Fornecedor' },
        { field: 'name', header: 'Fornecedor Responsável' },
        { field: 'total_freight_value', header: 'Valor de frete' },
        { field: 'total_supplier_value', header: 'Valor de repasse' },
        { field: 'total_value', header: 'Total requisitado' }
    ];
    public total: Number = 0;
    public filterDateValue = this._activatedRoute.snapshot.queryParams.filterDate;
    @ViewChild('dt') public dt: DataTable;

    constructor(
        private _sharedService: SharedService,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _excelService: ExcelService,
        private _hyperToastsService: HyperToastsService,
    ) {
        this.getPayments();
    }

    ngOnInit() {
    }

    getPayments() {
        this._sharedService.getPaymentsBySupplier().subscribe(
            response => {
                if (response.return) {
                    this.total = (this.payments = response.data)
                        .map(
                            (payment) => parseFloat(payment.total_value)
                        )
                        .reduceRight(
                            (sum, vale) => sum + vale
                        );
                } else {
                    this._hyperToastsService.addToast('warn', 'Atenção', 'Não houve requisição');
                    console.warn(response);
                }
            },
            err => {
                this._hyperToastsService.addToast('warn', 'Atenção', 'Aconteceu algum error');
                console.error(err);
            }
        );
    }

    exportExcel(dt: DataTable) {
        this._excelService.exportAsExcelFile((dt.filteredValue || dt.value), null, 'Pagamentos de fornecedor');
    }

    filterDate(date: Date) {
        this._router.navigate(['/financial/payments'], { queryParams: { filterDate: date || null } });
    }
}
