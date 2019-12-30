import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem } from 'primeng/components/common/menuitem';
import { HyperToastsService, ExcelService } from 'lib-services';
import { SharedService } from '@app-admin-youhubshop/services/shared.service';
import { DataTable, Calendar } from 'primeng/primeng';

@Component({
    selector: 'app-admin-youhubshop-gift-card',
    templateUrl: './gift-card.component.html',
    styleUrls: ['./gift-card.component.less']
})
export class GiftCardComponent implements OnInit {

    public items: MenuItem[] = this._sharedService.items;
    public giftCards: any[] = [];
    public cols: { header: string; field: string }[] = [
        { header: 'Código', field: 'id' },
        { header: 'Titulo', field: 'title' },
        { header: 'Validade', field: 'valid_thru' },
        { header: 'Quantidade', field: 'quantity' },
        { header: 'Status', field: 'status' }
    ];
    public colsBuyers: { header: string; field: string }[] = [
        { header: 'Compra', field: 'idBso' },
        { header: 'Valor', field: 'main_value' },
        { header: 'Valor Fornecedor', field: 'supply_value' },
        { header: 'Quantidade', field: 'quantity' },
        { header: 'Comprador', field: 'user' },
        { header: 'Email', field: 'mail' }
    ];
    public interval: Date[] = this._activatedRoute.snapshot.queryParams.interval;
    @ViewChild('interval') public calendar: Calendar;

    constructor(
        private _sharedService: SharedService,
        private _activatedRoute: ActivatedRoute,
        private _hyperToastsService: HyperToastsService,
        private _router: Router,
        private _excelService: ExcelService
    ) {
        this.setBreadCrumb();
    }

    ngOnInit() {
        if (this.interval) {
            this.calendar.value = [new Date(this.interval[0]), new Date(this.interval[1])];
            setTimeout(() => { this.calendar.updateInputfield(); }, 1);
            this.changeDate(this.calendar.value);
        }
    }

    setBreadCrumb() {
        this.items.splice(1, this.items.length);
        this.items.push({
            label: 'Guia Smart',
            routerLink: ['/' + this._activatedRoute.snapshot.url[0].path, this._activatedRoute.snapshot.url[1].path],
            queryParams: { interval: this._activatedRoute.snapshot.queryParams.interval || null }
        });
        try {
            if (this.items[0].label !== 'Dashboard') {
                this._router.navigate(['/']);
                return;
            }
        } catch (TypeError) {
            this._router.navigate(['/']);
            return;
        }
    }

    changeDate(interval: Date[]) {
        if (!interval[1]) { return; }
        const data = { startDate: interval[0].toISOString().split('T')[0], endDate: interval[1].toISOString().split('T')[0] };
        const item: MenuItem = this.items.pop();
        item.queryParams = { interval: interval };
        this.items.push(item);
        this.getInfoDetailsGiftCard(data);
    }

    getInfoDetailsGiftCard(data: { startDate: string; endDate: string; }) {
        this._sharedService.getInfoDetailsGiftCard(data).subscribe(
            response => {
                if (response.return) {
                    (this.giftCards = response.data).forEach(giftCard => { giftCard.buyers = JSON.parse(giftCard.buyers); giftCard.status = giftCard.status === 'A' ? 'Ativo' : 'Inativo'; });
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
