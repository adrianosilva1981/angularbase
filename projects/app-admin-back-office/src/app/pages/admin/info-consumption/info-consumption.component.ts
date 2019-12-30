import { HyperToastsService } from 'lib-services';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/components/common/menuitem';
import { SharedService } from '@app-admin-back-office/services/shared.service';

@Component({
    selector: 'app-admin-back-office-info-consumption',
    templateUrl: './info-consumption.component.html',
    styleUrls: ['./info-consumption.component.less']
})
export class InfoConsumptionComponent implements OnInit {

    public items: MenuItem[] = this._sharedService.items;
    public interval: Date[] = this._activatedRoute.snapshot.queryParams.interval;
    public consumptionValid: any[] = [];
    public consumptionReversal: any[] = [];
    public consumption: any = {};

    constructor(
        private _sharedService: SharedService,
        private _hyperToastsService: HyperToastsService,
        private _activatedRoute: ActivatedRoute,
        private _router: Router
    ) {
        this.setBreadCrumb();
        this.getSummaryConsumption();
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
            label: 'Consumo',
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
    getSummaryConsumption() {
        const data = { startDate: new Date(this.interval[0]).toDateString(), endDate: new Date(this.interval[1]).toDateString() };
        this._sharedService.getSummaryConsumption(data).subscribe(
            response => {
                if (response.return) {
                    this.consumptionValid = response.data.consumption.filter(consumption => consumption.status === 'A');
                    this.consumptionReversal = response.data.consumption.filter(consumption => consumption.status === 'E');
                    this.consumption.points = this.consumptionValid.map(consumption => parseInt(consumption.points, 10)).reduceRight((sum, value) => sum + value);
                    this.consumption.total_value = this.consumptionValid.map(consumption => parseFloat(consumption.total_value)).reduceRight((sum, value) => sum + value);
                    this.consumption.count_consumption = this.consumptionValid.map(consumption => parseInt(consumption.count_consumption, 10)).reduceRight((sum, value) => sum + value);
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

    returnTitle(type: string): string {
        switch (type) {
            case 'product': return 'Produtos';
            case 'service': return 'Serviços';
            default: return type;
        }
    }
}
