import { Component, OnInit, AfterViewChecked, ChangeDetectorRef, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Router, NavigationEnd } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { MatDialog } from '@angular/material';
import { SharedService } from '@app-hyper-store/services/shared.service';
import { HyperToastsService, HyperCookieService, BroadcastEventService } from 'lib-services';
import { VoucherComponent } from 'lib-components';

declare var require: any;
const jsonSearch = require('global/data/search-store.json');

@Component({
  selector: 'app-hyper-store-sub-navbar',
  templateUrl: './sub-navbar.component.html',
  styleUrls: ['./sub-navbar.component.less']
})
export class SubNavbarComponent implements OnInit, AfterViewChecked, OnDestroy {

  public shopCartNumOfProducts = 0;
  public objUserLogged: any;
  public displaySideNav: any;
  public currentStep;
  public currentCategories: any;
  public objOptonsSearch: any;

  private listenerLoginComponent = new Subscription;
  private listenerSideNav = new Subscription;
  private updateShoppingCart = new Subscription;
  private updateShoppingFavorite = new Subscription;
  private listenerLogoutComponent = new Subscription;
  private subscription_dialog = new Subscription;

  constructor(
    private _sharedService: SharedService,
    private _hyperToastsService: HyperToastsService,
    private _hyperCookieService: HyperCookieService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private _router: Router,
    private cdRef: ChangeDetectorRef,
    public _dialog: MatDialog
  ) { }

  ngOnInit() {
    const _self = this;
    this.objUserLogged = this._sharedService.getUserData();
    this.shopCartNumOfProducts = this.getShopCartNumOfItems();

    this.updateShoppingCart = BroadcastEventService.event('updateShoppingCart').subscribe(
      (response) => {
        this._hyperCookieService.setCookie_SHOPCART(response);
        this.shopCartNumOfProducts = this.getShopCartNumOfItems();
      }
    );

    this.updateShoppingFavorite = BroadcastEventService.event('updateShoppingFavorite').subscribe(
      response => {
        this._hyperCookieService.setCookie_FAVORITES(response);
        if (this.objUserLogged) {
          this.setWishList(response);
        }
      }
    );

    this.listenerLoginComponent = BroadcastEventService.event('listenerLoginComponent').subscribe(
      userData => {
        if (userData.JWT) {
          this.objUserLogged = userData;
        }
      }
    );

    this.listenerLogoutComponent = BroadcastEventService.event('listenerLogoutComponent').subscribe(
      response => {
        this._hyperCookieService.deleteCookie_AUTH();
        this._hyperCookieService.deleteCookie_FAVORITES();
        this._hyperCookieService.deleteCookie_SHOPCART();
        if (isPlatformBrowser(this.platformId)) {
          window.location.href = '/home';
        }
      }
    );

    this.objOptonsSearch = jsonSearch;
  }

  getShopCartNumOfItems(): number {
    const ShopCart = this._hyperCookieService.getCookie_SHOPCART();
    if (!ShopCart) {
      return 0;
    } else {
      let aux = 0;
      ShopCart.forEach((element: any) => {
        aux += Number(element.quantity);
      });
      return aux;
    }
  }

  getWishList() {
    // this._sharedService.getWishList().subscribe(
    //   response => {
    //     BroadcastEventService.event('updateShoppingFavorite').emit(response);
    //   }
    // );
  }

  setWishList(list) {
    // this._sharedService.setWishList(list).subscribe(
    //   resp => {
    //     // console.log(resp);
    //   },
    //   err => { this._hyperToastsService.addToast('error', 'Erro', err); }
    // );
  }

  openLeftSideNav(action) {
    if (action === 'open') { this.displaySideNav = true; }
    if (action === 'close') { this.displaySideNav = false; }
  }

  onShow() {
    this.currentStep = '';
    BroadcastEventService.event('changeNavFixed').emit('open');
  }

  onHide() {
    this.currentStep = '';
    BroadcastEventService.event('changeNavFixed').emit('close');
  }


  redirectOpportunities() {
    window.location.href = 'https://dash.hyper.jobs/job-opportunities/register';
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

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  ngOnDestroy() {
    this.listenerSideNav.unsubscribe();
    this.updateShoppingCart.unsubscribe();
    this.updateShoppingFavorite.unsubscribe();
    this.listenerLoginComponent.unsubscribe();
    this.listenerLogoutComponent.unsubscribe();
  }
}
