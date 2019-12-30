import { Component, OnInit, ViewChild } from '@angular/core';
import { SharedService } from '@app-admin-youhubshop/services/shared.service';
import { MenuItem } from 'primeng/components/common/menuitem';
import { ActivatedRoute, Router } from '@angular/router';
import { HyperToastsService } from 'lib-services';
import { Calendar } from 'primeng/primeng';

// tslint:disable:no-unused-expression
@Component({
    selector: 'app-admin-youhubshop-suppliers',
    templateUrl: './suppliers.component.html',
    styleUrls: ['./suppliers.component.less']
})
export class SuppliersComponent implements OnInit {

    public items: MenuItem[] = this._sharedService.items;
    public suppliers: any[] = [];
    public products: Number = 0;
    public services: Number = 0;
    public giftCards: Number = 0;
    public total: Number = 0;
    public interval: Date[] = this._activatedRoute.snapshot.queryParams.interval;
    @ViewChild('interval') public calendar: Calendar;

    public cols: { header: string, field: string }[] = [
        { header: 'Código', field: 'id' },
        { header: 'Nome', field: 'fantasyname' },
        { header: 'Produtos', field: 'sold_products' },
        { header: 'Serviços', field: 'sold_services' },
        { header: 'Gift Cards', field: 'sold_gift_card' },
        { header: 'Total', field: 'sold' }
    ];

    public query: String = '';

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
            label: 'Fornecedores',
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
        this.getInfoSuppliers(data);
    }

    getInfoSuppliers(data: { startDate: string; endDate: string; }) {
        this._sharedService.getInfoSuppliers(data).subscribe(
            response => {
                if (response.return) {
                    this.suppliers = response.data;
                    this.products = this.suppliers.map(x => parseInt(x.sold_products, 10)).reduceRight((sum, value) => sum + value);
                    this.services = this.suppliers.map(x => parseInt(x.sold_services, 0)).reduceRight((sum, value) => sum + value);
                    this.giftCards = this.suppliers.map(x => parseInt(x.sold_gift_card, 0)).reduceRight((sum, value) => sum + value);
                    this.total = this.suppliers.map(x => parseInt(x.sold, 0)).reduceRight((sum, value) => sum + value);
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

    redirect(interval: Date[], typeItem: String, ...routes: String[]) {
        this._router.navigate(['/dash', ...routes], { queryParams: { interval: interval, typeItem: typeItem } });
    }

    returnSuppliersSearch() {
        return this.query === '' ? this.suppliers : this.suppliers.filter(supplier => supplier.fantasyname.includes(this.query) || supplier.id.includes(this.query));
    }

}
