import { Component, OnInit } from '@angular/core';
import { SharedService } from '@app-admin-youhubshop/services/shared.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HyperToastsService } from 'lib-services';
import { MenuItem } from 'primeng/components/common/menuitem';

// tslint:disable:no-unused-expression
@Component({
    selector: 'app-admin-youhubshop-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.less']
})
export class DashboardComponent implements OnInit {

    public items: MenuItem[] = this._sharedService.items = [];
    public shops: Number = -1;
    public suppliers: Number = -1;
    public giftCard: Number = -1;
    public products: { hyper_product: Number, product: Number } = { hyper_product: -1, product: -1 };
    public users: { associate: Number, prime: Number, normal: Number } = { associate: -1, prime: -1, normal: -1 };
    public services: { hyper_service: Number, service: Number } = { hyper_service: -1, service: -1 };

    constructor(
        private _sharedService: SharedService,
        private _activatedRoute: ActivatedRoute,
        private _hyperToastsService: HyperToastsService,
        private _router: Router
    ) {
        this.setBreadCrumb();
        this.getInfo();
    }

    ngOnInit() {
    }

    setBreadCrumb() {
        this.items.push({
            label: 'Dashboard',
            routerLink: ['/dash'],
        });
    }

    getInfo() {
        this.getInfoShops();
        this.getInfoSuppliers();
        this.getInfoVouchers();
        this.getInfoProducts();
        this.getInfoUsers();
        this.getInfoService();
    }

    getInfoShops() {
        this._sharedService.getInfoDashBoard(0).subscribe(
            response => {
                if (response.return) {
                    this.shops = parseInt(response.data.count_shops, 10);
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

    getInfoSuppliers() {
        this._sharedService.getInfoDashBoard(1).subscribe(
            response => {
                if (response.return) {
                    this.suppliers = parseInt(response.data.count_supplier, 10);
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

    getInfoVouchers() {
        this._sharedService.getInfoDashBoard(2).subscribe(
            response => {
                if (response.return) {
                    this.giftCard = parseInt(response.data.count_gift_card, 10);
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

    getInfoProducts() {
        this._sharedService.getInfoDashBoard(3).subscribe(
            response => {
                if (response.return) {
                    this.products.product = parseInt(response.data.count_product, 10) + parseInt(response.data.count_hyper_product, 10);
                    this.products.hyper_product = parseInt(response.data.count_hyper_product, 10);
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

    getInfoUsers() {
        this._sharedService.getInfoDashBoard(4).subscribe(
            response => {
                if (response.return) {
                    this.users.normal = parseInt(response.data.count_normal, 10) + parseInt(response.data.count_associate, 10) + parseInt(response.data.count_prime, 10);
                    this.users.prime = parseInt(response.data.count_prime, 10);
                    this.users.associate = parseInt(response.data.count_associate, 10);
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

    getInfoService() {
        this._sharedService.getInfoDashBoard(5).subscribe(
            response => {
                if (response.return) {
                    this.services.service = parseInt(response.data.count_service, 10) + parseInt(response.data.count_hyper_service, 10);
                    this.services.hyper_service = parseInt(response.data.count_hyper_service, 10);
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

    redirect(...routes: String[]) {
        this._router.navigate(['/dash', ...routes]);
    }
}
