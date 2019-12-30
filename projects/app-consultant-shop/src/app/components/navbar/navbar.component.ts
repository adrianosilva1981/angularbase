import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Subscription } from 'rxjs';
import { HyperCookieService, BroadcastEventService, HyperToastsService } from 'lib-services';
import { SharedService } from '@app-consultant-shop/services/shared.service';

declare var require: any;
const jsonSearch = require('global/data/search-partner.json');

@Component({
  selector: 'app-consultant-shop-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.less']
})
export class NavbarComponent implements OnInit, OnDestroy {

  public objConsultant: any = {};
  public shopCartNumOfProducts = 0;
  public subdomain = '';
  public objOptonsSearch: any;
  public screenSize = window.innerWidth;
  private updateShoppingCart = new Subscription;
  private updateShoppingFavorite = new Subscription;
  private listenerLoginComponent = new Subscription;

  constructor(
    private _hyperCookieService: HyperCookieService,
    private _sharedService: SharedService
  ) { }
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.screenSize = event.target.innerWidth;
  }
  ngOnInit() {
    this.subdomain = this._sharedService.getSubdomainOwnerStore(false);

    this.shopCartNumOfProducts = this.getShopCartNumOfItems();
    this.objConsultant = this._sharedService.getOwnerStore();

    this.updateShoppingCart = BroadcastEventService.event('updateShoppingCart').subscribe(
      (response) => {
        this._hyperCookieService.setCookie_SHOPCART(response, this.subdomain);
        this.shopCartNumOfProducts = this.getShopCartNumOfItems();
      }
    );

    this.updateShoppingFavorite = BroadcastEventService.event('updateShoppingFavorite').subscribe(
      response => {
        this._hyperCookieService.setCookie_FAVORITES(response, this.subdomain);
      }
    );

    this.mountSearch();

  }

  mountSearch() {
    const shop = this._sharedService.getSubdomainOwnerStore();

    jsonSearch.config.forEach(element => {
      element.value.redirect = element.value.redirect.replace('REPLACE_SUBDOMAIN_OWNER', shop);
    });

    this.objOptonsSearch = jsonSearch;
  }

  getShopCartNumOfItems(): number {
    const ShopCart = this._hyperCookieService.getCookie_SHOPCART(this.subdomain);
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

  openLeftSideNav() {
    BroadcastEventService.event('onSideNav').emit('open');
  }

  getWishList() {
    this._sharedService.getWishList().subscribe(
      response => {
        BroadcastEventService.event('updateShoppingFavorite').emit(response);
      }
    );
  }

  ngOnDestroy() {
    this.updateShoppingCart.unsubscribe();
    this.updateShoppingFavorite.unsubscribe();
    this.listenerLoginComponent.unsubscribe();
  }

}
