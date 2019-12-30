import { HyperToastsService } from 'lib-services';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/components/common/menuitem';
import { SharedService } from '@app-admin-back-office/services/shared.service';
// tslint:disable:no-unused-expression

@Component({
    selector: 'app-admin-back-office-info-connections',
    templateUrl: './info-connections.component.html',
    styleUrls: ['./info-connections.component.less']
})
export class InfoConnectionsComponent implements OnInit {

    public items: MenuItem[] = this._sharedService.items;
    public interval: Date[] = this._activatedRoute.snapshot.queryParams.interval;
    public connections: Number = -2;
    public connectionsByMethod: any[] = [];

    constructor(
        private _sharedService: SharedService,
        private _hyperToastsService: HyperToastsService,
        private _activatedRoute: ActivatedRoute,
        private _router: Router
    ) {
        this.setBreadCrumb();
        this.getSummaryConnections();
    }

    ngOnInit() {
    }

    setBreadCrumb() {
        this.items.splice(1, this.items.length);
        this.items.push({
            label: 'Conexões',
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

    getSummaryConnections() {
        this.connections = 0;
        const data = { startDate: new Date(this.interval[0]).toDateString(), endDate: new Date(this.interval[1]).toDateString() };
        this._sharedService.getSummaryConnections(data).subscribe(
            response => {
                if (response.return) {
                    this.connections = response.data.connections.map(method => method.value).reduceRight((sum, value) => sum + value) || -1;
                    this.connectionsByMethod = response.data.connections;
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

    returnHeader(label: string): string {
        switch (label) {
            case 'credit_card': return 'Cartão de Crédito';
            case 'crypto_coins': return 'Cripto Moeda';
            case 'transfer_bank': return 'Transferência Bancária';
            case 'financing': return 'Financiamento';
            case 'eduzz': return 'Eduzz';
            case 'quotas': return 'Packs';
            case 'platform_credit': return 'Crédito da Plataforma';
            case 'ticket': return 'Boleto';
            default: return label;
        }
    }
}
