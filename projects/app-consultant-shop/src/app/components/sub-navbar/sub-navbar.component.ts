import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BroadcastEventService } from 'lib-services';
import { SharedService } from '@app-consultant-shop/services/shared.service';
import { VoucherComponent } from 'lib-components';
import { MatDialog } from '@angular/material';
import { Subscription } from 'rxjs';

declare var require: any;
const jsonSearch = require('global/data/search-partner.json');

@Component({
    selector: 'app-consultant-shop-sub-navbar',
    templateUrl: './sub-navbar.component.html',
    styleUrls: ['./sub-navbar.component.less']
})
export class SubNavbarComponent implements OnInit {

    public objUserLogged: any;
    public displaySideNav: any;
    public objConsultant: any = {};
    public objOptonsSearch: any;
    private subscription_dialog = new Subscription;
    public hyperServices: any[] = [];

    constructor(
        private _sharedService: SharedService,
        private _router: Router,
        public _dialog: MatDialog

    ) {
        this.getHyperServices();
    }

    ngOnInit() {
        this.objUserLogged = this._sharedService.getUserData();
        this.objConsultant = this._sharedService.getOwnerStore();
        this.listenerSideNav();
        this.listenerLogin();
        this.mountSearch();
    }

    mountSearch() {
        const shop = this._sharedService.getSubdomainOwnerStore();

        jsonSearch.config.forEach(element => {
            element.value.redirect = element.value.redirect.replace('REPLACE_SUBDOMAIN_OWNER', shop);
        });

        this.objOptonsSearch = jsonSearch;
    }

    openRoute(route) {
        const url = this._sharedService.getSubdomainOwnerStore();
        this._router.navigate([url + route]);
    }

    listenerLogin() {
        BroadcastEventService.event('listenerLoginComponent').subscribe(
            userData => {
                if (userData.JWT) {
                    this.objUserLogged = userData;
                }
            }
        );
    }

    listenerSideNav() {
        BroadcastEventService.event('onSideNav').subscribe(
            action => {
                if (action === 'open') { this.displaySideNav = true; }
                if (action === 'close') { this.displaySideNav = false; }
            }
        );
    }

    signIn() {
        BroadcastEventService.event('openLoginModal').emit(true);
        this.displaySideNav = false;
    }

    signOut() {
        BroadcastEventService.event('logout').emit(true);
    }

    onShow() {
        BroadcastEventService.event('onNavFixed').emit('open');
    }

    onHide() {
        BroadcastEventService.event('onNavFixed').emit('close');
    }

    openModalVoucher() {
        const dialogRef = this._dialog.open(
            VoucherComponent,
            {
                id: 'voucherModal',
                data: {

                },
                panelClass: 'globalModalHJ'
            });
        this.subscription_dialog = dialogRef.afterClosed().subscribe(
            result => {
                this.subscription_dialog.unsubscribe();

            });
    }

    getHyperServices() {
        this._sharedService.getHyperServices().subscribe(
            (response: any) => {
                if (response.return) {
                    this.hyperServices = this.hyperServices.concat(response.data);
                }
            }
        );
    }

}
