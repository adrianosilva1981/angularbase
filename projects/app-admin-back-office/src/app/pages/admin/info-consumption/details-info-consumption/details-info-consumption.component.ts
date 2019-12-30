import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DataTable } from 'primeng/primeng';
import { HyperToastsService, ExcelService } from 'lib-services';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/components/common/menuitem';
import { SharedService } from '@app-admin-back-office/services/shared.service';
import { ItemsControl } from '@ngu/carousel/src/ngu-carousel/ngu-carousel.interface';

@Component({
    selector: 'app-admin-back-office-details-info-consumption',
    templateUrl: './details-info-consumption.component.html',
    styleUrls: ['./details-info-consumption.component.less']
})
export class DetailsInfoConsumptionComponent implements OnInit {

    public items: MenuItem[] = this._sharedService.items;
    public interval: Date[] = this._activatedRoute.snapshot.queryParams.interval;
    public title: string = this._activatedRoute.snapshot.data.title;
    public consumptions: any[] = [];
    public cols: any[] = [
        { field: 'username', header: 'Código' },
        { field: 'name', header: 'Nome' },
        { field: 'points', header: 'Pontos' },
        { field: 'type', header: 'Tipo' },
        { field: 'status', header: 'Status' },
        { field: 'total_value', header: 'Valor' }
    ];

    constructor(
        private _sharedService: SharedService,
        private _hyperToastsService: HyperToastsService,
        private _activatedRoute: ActivatedRoute,
        private _router: Router,
        private _excelService: ExcelService
    ) {
        this.setBreadCrumb();
        this.getSummaryDetailsConsumption();
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
            label: this.title,
            routerLink: ['/' + this._activatedRoute.snapshot.url[0].path, this._activatedRoute.snapshot.url[1].path, this._activatedRoute.snapshot.url[2].path],
            queryParams: { interval: this._activatedRoute.snapshot.queryParams.interval || null, paymentMethod: this._activatedRoute.snapshot.queryParams.paymentMethod || null },
        });
        try {
            if (this.items[1].label !== 'Consumo') {
                this._router.navigate(['/admin']);
                return;
            }
        } catch (TypeError) {
            this._router.navigate(['/admin']);
            return;
        }
    }

    getSummaryDetailsConsumption() {
        const data = {
            startDate: new Date(this.interval[0]).toDateString(),
            endDate: new Date(this.interval[1]).toDateString()
        };
        this._sharedService.getSummaryDetailsConsumption(data).subscribe(
            response => {
                if (response.return) {
                    this.consumptions = response.data.consumption.filter(consumption => this.returnFlagFilter(consumption));
                    this.consumptions.forEach(row => {row.total_value = parseFloat(row.total_value)});
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

    returnFlagFilter(consumption) {
        // consumption.type = this.returnLabelType(consumption.type);
        consumption.type = consumption.type === 'product' ? 'Produto' : 'Serviço';
        consumption.status = consumption.status === 'A' ? 'Adquirido' : 'Estornado';
        switch (this._activatedRoute.snapshot.url[2].path) {
            case 'details-consumption': return true;
            case 'details-product': return consumption.type === 'Produto' && consumption.status === 'Adquirido';
            case 'details-service': return consumption.type === 'Serviço' && consumption.status === 'Adquirido';
            case 'details-reversal-service': return consumption.type === 'Serviço' && consumption.status === 'Estornado';
            case 'details-reversal-product': return consumption.type === 'Produto' && consumption.status === 'Estornado';
        }
    }

    returnLabelType(type: string): string {
        switch (type) {
            case 'service': return 'Serviço';
            case 'product': return 'Produto';
            default: return type;
        }
    }

    exportExcel(dt: DataTable) {
        this._excelService.exportAsExcelFile(dt.filteredValue || dt.value, null, this.title);
    }
}