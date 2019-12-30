import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { HyperToastsService, ExcelService } from 'lib-services';
import { MenuItem } from 'primeng/components/common/menuitem';
import { DataTable } from 'primeng/primeng';
import { SharedService } from '@app-admin-back-office/services/shared.service';
// tslint:disable:no-unused-expression

@Component({
    selector: 'app-admin-back-office-details-info-grid',
    templateUrl: './details-info-grid.component.html',
    styleUrls: ['./details-info-grid.component.less']
})
export class DetailsInfoGridComponent implements OnInit {

    public items: MenuItem[] = this._sharedService.items;
    public interval: Date[] = this._activatedRoute.snapshot.queryParams.interval;
    public paymentMethod: string = this._activatedRoute.snapshot.queryParams.paymentMethod;
    public title: string = this._activatedRoute.snapshot.data.title;
    public connections: any = [];
    public cols: any = [];
    public cell: any = {};
    public total: any = {};

    constructor(
        private _sharedService: SharedService,
        private _hyperToastsService: HyperToastsService,
        private _activatedRoute: ActivatedRoute,
        private _router: Router,
        private _excelService: ExcelService
    ) {
        this.setBreadCrumb();
        this.getSummaryDetailsGrids();
    }

    ngOnInit() {
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

    setBreadCrumb() {
        this.items.splice(2, this.items.length);
        this.items.push({
            label: this.title + this._activatedRoute.snapshot.params.id_executive_cell,
            routerLink: ['/' + this._activatedRoute.snapshot.url[0].path, this._activatedRoute.snapshot.url[1].path, this._activatedRoute.snapshot.url[2].path, this._activatedRoute.snapshot.url[3].path],
            queryParams: { interval: this._activatedRoute.snapshot.queryParams.interval || null }
        });
        try {
            if (this.items[1].label !== 'Conexões Por Grade') {
                this._router.navigate(['/admin']);
                return;
            }
        } catch (TypeError) {
            this._router.navigate(['/admin']);
            return;
        }
    }

    exportExcel(dt: DataTable) {
        this._excelService.exportAsExcelFile(dt.filteredValue || dt.value, null, this.title);
    }

    getSummaryDetailsGrids() {
        const data = {
            idGrid: this._activatedRoute.snapshot.params.id_executive_cell,
            startDate: this.interval ? new Date(this.interval[0]).toDateString() : null,
            endDate: this.interval ? new Date(this.interval[1]).toDateString() : null
        };
        this._sharedService.getSummaryDetailsGrids(data).subscribe(
            response => {
                if (response.return) {
                    this.connections = response.data.connections;
                    this.cell = response.data.cell;
                    this.total = response.data.total;
                    //console.log(response.data);
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
            case 'cellphone': this.cols.push({ field: col, header: 'Celular' }); break;
            case 'method': this.cols.push({ field: col, header: 'Método' }); break;
            case 'activation': this.interval && this.cols.push({ field: col, header: 'Data de ativação' }); break;
            case 'info': this.interval && this.cols.push({ field: col, header: 'Mais Informação' }); break;
        }
    }
}
