import { Component, OnInit, ViewChild } from '@angular/core';
import { SharedService } from '@app-admin-youhubshop/services/shared.service';
import { MenuItem } from 'primeng/components/common/menuitem';
import { ActivatedRoute, Router } from '@angular/router';
import { HyperToastsService } from 'lib-services';
import { Calendar } from 'primeng/primeng';

// tslint:disable:no-unused-expression
@Component({
    selector: 'app-admin-youhubshop-shops',
    templateUrl: './shops.component.html',
    styleUrls: ['./shops.component.less']
})
export class ShopsComponent implements OnInit {

    public items: MenuItem[] = this._sharedService.items;
    public shops: any[] = [];
    public interval: Date[] = this._activatedRoute.snapshot.queryParams.interval;
    @ViewChild('interval') public calendar: Calendar;

    public cols = [
        { field: 'id', header: 'Código' },
        { field: 'title', header: 'Loja' },
        { field: 'sold', header: 'Quantidade vendida' }
    ];


    constructor(
        private _sharedService: SharedService,
        private _activatedRoute: ActivatedRoute,
        private _router: Router,
        private _hyperToastsService: HyperToastsService
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
            label: 'Lojas',
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
        this.getInfoShops(data);
    }

    getInfoShops(data: { startDate: string; endDate: string; }) {
        this._sharedService.getInfoShops(data).subscribe(
            response => {
                if (response.return) {
                    this.shops = response.data;
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

    redirect(interval: Date[], ...routes: String[]) {
        this._router.navigate(['/dash', ...routes], { queryParams: { interval: interval } });
    }

}
