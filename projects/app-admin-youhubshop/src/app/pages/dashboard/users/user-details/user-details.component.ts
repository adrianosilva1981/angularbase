import { Component, OnInit } from '@angular/core';
import { SharedService } from '@app-admin-youhubshop/services/shared.service';
import { MenuItem } from 'primeng/components/common/menuitem';
import { ActivatedRoute } from '@angular/router';
import { HyperToastsService } from 'lib-services';

@Component({
    selector: 'app-admin-youhubshop-user-details',
    templateUrl: './user-details.component.html',
    styleUrls: ['./user-details.component.less']
})
export class UserDetailsComponent implements OnInit {

    public items: MenuItem[] = this._sharedService.items;
    public user: any;
    public shopping: { itemsOrder: any[], cols: { header: string, field: string }[], points: Number } = {
        itemsOrder: [],
        cols: [
            { header: 'Código da compra', field: 'id' },
            { header: 'Valor', field: 'main_value' },
            { header: 'Frete', field: 'freight_value' },
            { header: 'Total', field: 'amount_receiver' },
            { header: 'Pontos', field: 'points_value' },
        ],
        points: 0
    };
    public sales: {
        products: any[],
        colsProducts: { header: string, field: string }[],
        services: any[],
        colsServices: { header: string, field: string }[],
        giftCards: any[],
        colsGiftCards: { header: string, field: string }[]
    } = {
            products: [],
            colsProducts: [
                { header: 'Código do produto', field: 'id' },
                { header: 'Código da venda', field: 'id_buyShoppingOrder' },
                { header: 'Nome', field: 'reference_name' },
                { header: 'Pago', field: 'main_value' },
                { header: 'Fornecedor', field: 'supply_value' },
                { header: 'Quantidade', field: 'quantity' },
                { header: 'Pontos', field: 'points_value' }
            ],
            services: [],
            colsServices: [
                { header: 'Código do produto', field: 'id' },
                { header: 'Código da venda', field: 'id_buyShoppingOrder' },
                { header: 'Nome', field: 'reference_name' },
                { header: 'Pago', field: 'main_value' },
                { header: 'Fornecedor', field: 'supply_value' },
                { header: 'Quantidade', field: 'quantity' },
                { header: 'Pontos', field: 'points_value' }
            ],
            giftCards: [],
            colsGiftCards: [
                { header: 'Código do produto', field: 'id' },
                { header: 'Código da venda', field: 'id_buyShoppingOrder' },
                { header: 'Nome', field: 'reference_name' },
                { header: 'Pago', field: 'main_value' },
                { header: 'Fornecedor', field: 'supply_value' },
                { header: 'Quantidade', field: 'quantity' },
                { header: 'Pontos', field: 'points_value' }
            ]
        };
    public extract: any;


    constructor(
        private _sharedService: SharedService,
        private _activatedRoute: ActivatedRoute,
        private _hyperToastsService: HyperToastsService
    ) {
        this.getInfoDetailsUser(_activatedRoute.snapshot.params.idUser);
    }

    ngOnInit() { }

    setBreadCrumb(name: string) {
        this.items.splice(2, this.items.length);
        this.items.push({
            label: name
        });
    }

    getInfoDetailsUser(idUser: Number) {
        this._sharedService.getInfoDetailsUser(idUser).subscribe(
            response => {
                if (response.return) {
                    console.log();
                    this.user = response.data.user;
                    console.log(this.extract = response.data.extract);
                    (this.shopping.itemsOrder = response.data.shopping).forEach(item => {
                        item.points_value = (item.details = JSON.parse(item.details))
                            .map(detail => parseFloat(detail.points || 0))
                            .reduceRight((sum, value) => sum + value);
                        this.shopping.points += item.points_value;
                    });
                    console.log(this.shopping.points);
                    this.sales.products = response.data.salesProducts;
                    this.sales.services = response.data.salesServices;
                    this.sales.giftCards = response.data.salesGiftCards;
                    this.setBreadCrumb(this.user.name);
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
