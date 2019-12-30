import { DataTable } from 'primeng/primeng';
import { HyperToastsService, ExcelService } from 'lib-services';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/components/common/menuitem';
import { SharedService } from '@app-admin-back-office/services/shared.service';
// tslint:disable:no-unused-expression

@Component({
    selector: 'app-admin-back-office-info-tickets-kits',
    templateUrl: './info-tickets-kits.component.html',
    styleUrls: ['./info-tickets-kits.component.less']
})
export class InfoTicketsKitsComponent implements OnInit {

    public items: MenuItem[] = this._sharedService.items;
    public interval: Date[] = this._activatedRoute.snapshot.queryParams.interval;
    public associates: any[] = [];
    public cols: any[] = [
        { field: 'username', header: 'Código' },
        { field: 'name', header: 'Nome' },
        { field: 'email', header: 'Email' },
        { field: 'cellphone', header: 'Celular' },
        { field: 'ticket_kit', header: 'Ingresso/Kit' },
        { field: 'date_payment', header: 'Data de Pagamento' }
    ];

    constructor(
        private _sharedService: SharedService,
        private _hyperToastsService: HyperToastsService,
        private _activatedRoute: ActivatedRoute,
        private _router: Router,
        private _excelService: ExcelService
    ) {
        this.setBreadCrumb();
        this.getSummaryTicketsKits();
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
            label: 'Ingressos/Kits',
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
        this._excelService.exportAsExcelFile((dt.filteredValue || dt.value), null, 'Saque');
    }

    getSummaryTicketsKits() {
        const data = { startDate: new Date(this.interval[0]).toDateString(), endDate: new Date(this.interval[1]).toDateString() };
        this._sharedService.getSummaryTicketsKits(data).subscribe(
            response => {
                if (response.return) {
                    this.associates = response.data;
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