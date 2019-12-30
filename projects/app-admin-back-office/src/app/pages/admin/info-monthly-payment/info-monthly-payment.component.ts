import { HyperToastsService } from 'lib-services';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/components/common/menuitem';
import { SharedService } from '@app-admin-back-office/services/shared.service';
// tslint:disable:no-unused-expression

@Component({
    selector: 'app-admin-back-office-info-monthly-payment',
    templateUrl: './info-monthly-payment.component.html',
    styleUrls: ['./info-monthly-payment.component.less']
})
export class InfoMonthlyPaymentComponent implements OnInit {

    public items: MenuItem[] = this._sharedService.items;
    public interval: Date[] = this._activatedRoute.snapshot.queryParams.interval;
    public monthly: Number = -2;
    public adept: Number = -2;
    public active: Number = -2;
    public notPaid: Number = -2;

    constructor(
        private _sharedService: SharedService,
        private _hyperToastsService: HyperToastsService,
        private _activatedRoute: ActivatedRoute,
        private _router: Router
    ) {
        this.setBreadCrumb();
        this.getSummaryMonthly();
    }

    ngOnInit() {
    }

    setBreadCrumb() {
        this.items.splice(1, this.items.length);
        this.items.push({
            label: 'Mensalidade',
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

    getSummaryMonthly() {
        this.monthly = this.adept = this.active = this.notPaid = 0;
        const data = { startDate: new Date(this.interval[0]).toDateString(), endDate: new Date(this.interval[1]).toDateString() };
        this._sharedService.getSummaryMonthly(data).subscribe(
            response => {
                if (response.return) {
                    this.monthly = response.data.monthly || -1;
                    this.adept = response.data.adept || -1;
                    this.active = response.data.active || -1;
                    this.notPaid = response.data.not_paid || -1;
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
