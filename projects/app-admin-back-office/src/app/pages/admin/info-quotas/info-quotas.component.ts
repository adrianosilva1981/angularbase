import { DataTable } from 'primeng/primeng';
import { HyperToastsService, ExcelService } from 'lib-services';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/components/common/menuitem';
import { SharedService } from '@app-admin-back-office/services/shared.service';
// tslint:disable:no-unused-expression

@Component({
    selector: 'app-admin-back-office-info-quotas',
    templateUrl: './info-quotas.component.html',
    styleUrls: ['./info-quotas.component.less']
})
export class InfoQuotasComponent implements OnInit {

    public items: MenuItem[] = this._sharedService.items;
    public interval: Date[] = this._activatedRoute.snapshot.queryParams.interval;
    public associates: any[] = [];
    public cols: any[] = [
        { field: 'buyer_username', header: 'Código' },
        { field: 'buyer_name', header: 'Nome' },
        { field: 'buyer_email', header: 'Email' },
        { field: 'buyer_cellphone', header: 'Celular' },
        { field: 'creation_date', header: 'Data Compra' },
        { field: 'quotas', header: 'Packs' },
        { field: 'quotas_used', header: 'Usadas' }
    ];

    constructor(
        private _sharedService: SharedService,
        private _hyperToastsService: HyperToastsService,
        private _activatedRoute: ActivatedRoute,
        private _router: Router,
        private _excelService: ExcelService
    ) {
        this.setBreadCrumb();
        this.getSummaryQuotas();
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
            'Código': associate.buyer_username,
            'Nome': associate.buyer_name,
            'Email': associate.buyer_email,
            'Celular': associate.buyer_cellphone,
            'Packs Comprados': associate.quotas,
            'Packs Usados': associate.quotas_used,
            'Usados em:': '[' + associate.reseller_quotas_used.map(used =>
                '{Código:' + used.username +
                ',Nome:' + used.name +
                ',Email:' + used.email +
                ',Celular:' + used.cellphone +
                ',Ativado:' + new Date(used.activation).toDateString() +
                '}') + ']'
        }));
        this._excelService.exportAsExcelFile(data, null, 'Packs');
    }

    getSummaryQuotas() {
        const data = { startDate: new Date(this.interval[0]).toDateString(), endDate: new Date(this.interval[1]).toDateString() };
        this._sharedService.getSummaryQuotas(data).subscribe(
            response => {
                if (response.return) {
                    (this.associates = response.data).forEach(associate => associate.reseller_quotas_used = JSON.parse(associate.reseller_quotas_used).sort((a, b) => new Date(a.activation).getTime() - new Date(b.activation).getTime()));
                    console.log(this.associates);
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