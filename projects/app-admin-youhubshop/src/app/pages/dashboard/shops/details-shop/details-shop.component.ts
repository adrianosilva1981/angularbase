import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem } from 'primeng/components/common/menuitem';
import { HyperToastsService, ExcelService } from 'lib-services';
import { SharedService } from '@app-admin-youhubshop/services/shared.service';
import { DataTable } from 'primeng/primeng';

@Component({
    selector: 'app-admin-youhubshop-details-shop',
    templateUrl: './details-shop.component.html',
    styleUrls: ['./details-shop.component.less']
})
export class DetailsShopComponent implements OnInit {

    public items: MenuItem[] = this._sharedService.items;
    public interval: Date[] = this._activatedRoute.snapshot.queryParams.interval;
    public shop: any;
    public orders: any[];
    public cols: { header: string, field: string }[] = [];
    public total: Number = 0;

    constructor(
        private _sharedService: SharedService,
        private _activatedRoute: ActivatedRoute,
        private _hyperToastsService: HyperToastsService,
        private _router: Router,
        private _excelService: ExcelService
    ) {
        this.getInfoDetailsShops();
    }

    ngOnInit() {
    }

    getInfoDetailsShops() {
        const data = { idShop: this._activatedRoute.snapshot.params.idShop, startDate: new Date(this.interval[0]).toISOString().split('T')[0], endDate: new Date(this.interval[1]).toISOString().split('T')[0] };
        this._sharedService.getInfoDetailsShops(data).subscribe(
            response => {
                if (response.return) {
                    this.shop = response.data.shop;
                    this.orders = response.data.sales;
                    this.orders.forEach(order => { order.items_sold = JSON.parse(order.items_sold); order.main_value = parseFloat(order.main_value); });
                    Object.keys(this.orders[0]).forEach((col: string) => { this.setCols(col); });
                    this.total = this.orders.map(order => parseFloat(order.main_value)).reduceRight((value, sum) => sum + value);
                    this.setBreadCrumb();
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

    setBreadCrumb() {
        if (!this._activatedRoute.snapshot.queryParams.interval) {
            this._hyperToastsService.clear();
            this._hyperToastsService.addToast('warn', 'Atenção', 'Escolha um período para ter as informações');
            this._router.navigate(['/']);
            return;
        }
        this.items.splice(2, this.items.length);
        this.items.push({
            label: this.shop.title,
            routerLink: ['/' + this._activatedRoute.snapshot.url[0].path, this._activatedRoute.snapshot.url[1].path, this._activatedRoute.snapshot.url[2].path, this._activatedRoute.snapshot.url[3].path],
            queryParams: { interval: this._activatedRoute.snapshot.queryParams.interval || null },
        });
        try {
            if (this.items[1].label !== 'Lojas') {
                this._router.navigate(['/']);
                return;
            }
        } catch (TypeError) {
            this._router.navigate(['/']);
            return;
        }
    }


    setCols(col: string) {
        switch (col) {
            case 'idOrder': this.cols.push({ field: col, header: 'Código Pedido' }); break;
            case 'idUser': this.cols.push({ field: col, header: 'Código Usuário' }); break;
            case 'name': this.cols.push({ field: col, header: 'Usuário' }); break;
            case 'main_value': this.cols.push({ field: col, header: 'Valor do Pedido' }); break;
            case 'payment': this.cols.push({ field: col, header: 'Pagamento' }); break;
            case 'method': this.cols.push({ field: col, header: 'Método de Pagamento' }); break;
        }
    }

    returnMethodLabel(method: string): string {
        switch (method) {
            case 'credit_card': return 'Cartão de Crédito';
            default: return method;
        }
    }

    exportExcel(dt: DataTable) {
        this._excelService.exportAsExcelFile(dt.filteredValue || dt.value, null, this.shop.title);
    }

}
