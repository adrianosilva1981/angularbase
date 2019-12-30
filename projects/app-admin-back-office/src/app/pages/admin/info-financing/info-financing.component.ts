import { DataTable } from 'primeng/primeng';
import { HyperToastsService, ExcelService } from 'lib-services';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/components/common/menuitem';
import { SharedService } from '@app-admin-back-office/services/shared.service';
// tslint:disable:no-unused-expression

@Component({
    selector: 'app-admin-back-office-info-financing',
    templateUrl: './info-financing.component.html',
    styleUrls: ['./info-financing.component.less']
})
export class InfoFinancingComponent implements OnInit {

    public items: MenuItem[] = this._sharedService.items;
    public interval: Date[] = this._activatedRoute.snapshot.queryParams.interval;
    public associates: any[] = [];
    public cols: any[] = [
        { field: 'username', header: 'Código' },
        { field: 'name', header: 'Nome' },
        { field: 'email', header: 'Email' },
        { field: 'cellphone', header: 'Celular' },
        { field: 'request_date', header: 'Data' },
        { field: 'value_init', header: 'Valor de entrada' },
        { field: 'value_financed', header: 'Valor financiado' },
        { field: 'value_buy', header: 'Total' }
    ];

    constructor(
        private _sharedService: SharedService,
        private _hyperToastsService: HyperToastsService,
        private _activatedRoute: ActivatedRoute,
        private _router: Router,
        private _excelService: ExcelService
    ) {
        this.setBreadCrumb();
        this.getSummaryFinancing();
    }

    ngOnInit() {
    }

    setBreadCrumb() {
        if (!this._activatedRoute.snapshot.queryParams.interval) {
            this._hyperToastsService.clear();
            this._hyperToastsService.addToast('warn', 'Atenção', 'Escolha um período para ter as informações');
            this._router.navigate(['/admin']);
            return;
        }
        this.items.splice(1, this.items.length);
        this.items.push({
            label: 'Financiamento',
            routerLink: ['/' + this._activatedRoute.snapshot.url[0].path, this._activatedRoute.snapshot.url[1].path],
            queryParams: { interval: this._activatedRoute.snapshot.queryParams.interval || null },
        });
        try {
            if (this.items[0].label !== 'Adminstração') {
                this._router.navigate(['/admin']);
                return;
            }
        } catch (TypeError) {
            this._router.navigate(['/admin']);
            return;
        }
    }

    exportExcel(dt: DataTable) {
        const data = (dt.filteredValue || dt.value).map(associate => ({
            'Código': associate.username,
            'Nome': associate.name,
            'Email': associate.email,
            'Celular': associate.cellphone,
            'Data': associate.request_date,
            'Valor de entrada': associate.value_init,
            'Valor financiado': associate.value_financed,
            'Total': associate.value_buy,
            'parcels': associate.parcels.map(parcel => ({
                'Parcela': parcel.parcel,
                'Data vencimento': new Date(parcel.date_attempt).toDateString(),
                'Data de Pagamento': parcel.date_payment ? new Date(parcel.date_payment).toDateString() : 'Não pago',
                'Valor': parcel.value
            }))
        }));
        this._excelService.exportAsExcelFile(data, null, 'Financiamento');
    }

    getSummaryFinancing() {
        const data = { startDate: new Date(this.interval[0]).toDateString(), endDate: new Date(this.interval[1]).toDateString() };
        this._sharedService.getSummaryFinancing(data).subscribe(
            response => {
                if (response.return) {
                    (this.associates = response.data).forEach(associate => associate.parcels = JSON.parse(associate.parcels).sort((a, b) => a.parcel - b.parcel));
                } else {
                    this._hyperToastsService.addToast('warn', 'Atenção', response.msg);
                    console.warn(response);
                }
            },
            err => {
                this._hyperToastsService.addToast('warn', 'Atenção', err.msg);
                console.error(err);
            }
        );
    }

}