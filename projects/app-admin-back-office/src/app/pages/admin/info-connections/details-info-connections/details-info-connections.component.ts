import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { HyperToastsService, ExcelService } from 'lib-services';
import { MenuItem } from 'primeng/components/common/menuitem';
import { DataTable } from 'primeng/primeng';
import { SharedService } from '@app-admin-back-office/services/shared.service';
// tslint:disable:no-unused-expression

@Component({
    selector: 'app-admin-back-office-details-info-connections',
    templateUrl: './details-info-connections.component.html',
    styleUrls: ['./details-info-connections.component.less']
})
export class DetailsInfoConnectionsComponent implements OnInit {

    public query: String;
    public items: MenuItem[] = this._sharedService.items;
    public interval: Date[] = this._activatedRoute.snapshot.queryParams.interval;
    public paymentMethod: string = this._activatedRoute.snapshot.queryParams.paymentMethod;
    public title: string = this._activatedRoute.snapshot.data.title;
    public connections: any[] = [];
    public cols: any[] = [];

    constructor(
        private _sharedService: SharedService,
        private _hyperToastsService: HyperToastsService,
        private _activatedRoute: ActivatedRoute,
        private _router: Router,
        private _excelService: ExcelService
    ) {
        this.setBreadCrumb();
        this.getSummaryDetailsConnections();
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
        this.items.splice(2, this.items.length);
        this.items.push({
            label: this.title + (this._activatedRoute.snapshot.queryParams.paymentMethod ? ' Por ' + this.returnLabelPaymentMethod(this._activatedRoute.snapshot.queryParams.paymentMethod) : ''),
            routerLink: ['/' + this._activatedRoute.snapshot.url[0].path, this._activatedRoute.snapshot.url[1].path, this._activatedRoute.snapshot.url[2].path],
            queryParams: { interval: this._activatedRoute.snapshot.queryParams.interval || null, paymentMethod: this._activatedRoute.snapshot.queryParams.paymentMethod || null },
        });
        try {
            if (this.items[1].label !== 'Conexões') {
                this._router.navigate(['/admin']);
                return;
            }
        } catch (TypeError) {
            this._router.navigate(['/admin']);
            return;
        }
    }

    returnLabelPaymentMethod(key: string): string {
        switch (key) {
            case 'credit_card': return 'Cartão de Crédito';
            case 'crypto_coins': return 'Cripto Moeda';
            case 'transfer_bank': return 'Transferência Bancária';
            case 'financing': return 'Financiamento';
            case 'eduzz': return 'Eduzz';
            case 'quotas': return 'Packs';
            case 'platform_credit': return 'Crédito da Plataforma';
            case 'ticket': return 'Boleto';
        }
    }

    exportExcel(dt: DataTable) {
        this._excelService.exportAsExcelFile(dt.filteredValue || dt.value, null, this.title + this.returnLabelPaymentMethod(this._activatedRoute.snapshot.queryParams.paymentMethod));
    }

    getSummaryDetailsConnections() {
        const data = { method: this._activatedRoute.snapshot.queryParams.paymentMethod, startDate: new Date(this.interval[0]).toDateString(), endDate: new Date(this.interval[1]).toDateString() };
        this._sharedService.getSummaryDetailsConnections(data).subscribe(
            response => {
                if (response.return) {
                    this.connections = response.data;
                    Object.keys(this.connections[0]).forEach((col: string) => this.setCols(col));
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

    setCols(col: string) {
        switch (col) {
            case 'username': this.cols.push({ field: col, header: 'Código' }); break;
            case 'name': this.cols.push({ field: col, header: 'Nome' }); break;
            case 'email': this.cols.push({ field: col, header: 'Email' }); break;
            case 'method': this.cols.push({ field: col, header: 'Método' }); break;
            case 'activation': this.cols.push({ field: col, header: 'Data de ativação' }); break;
        }
    }
}
