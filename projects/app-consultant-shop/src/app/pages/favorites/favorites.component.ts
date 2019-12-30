import { Component, OnInit } from '@angular/core';
import { BroadcastEventService, HyperToastsService, HyperCookieService } from 'lib-services';
import { SharedService } from '@app-consultant-shop/services/shared.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-consultant-shop-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.less']
})
export class FavoritesComponent implements OnInit {

  public shopFavoriteList: any = [];
  public listFull = [];

  constructor(
    private _hyperToastsService: HyperToastsService,
    private _hyperCookieService: HyperCookieService,
    private _sharedService: SharedService,
    private _router: Router
  ) { }

  ngOnInit() {
    const _self = this;

    this._sharedService.addBreadCrumb(
      [
        { 'text': 'Minha Conta', 'router': this._sharedService.getSubdomainOwnerStore() + '/my-account' },
        { 'text': 'Favoritos', 'router': '' }
      ]
    );

    this.init();

    BroadcastEventService.event('listenerLoginComponent').subscribe(
      userData => {
        if (userData.JWT) {
          setTimeout(() => {
            _self.init();
          }, 1000);
        }
      }
    );
  }

  init() {
    const cookieFav = this._hyperCookieService.getCookie_FAVORITES(this._sharedService.getSubdomainOwnerStore(false));
    this.shopFavoriteList = cookieFav ? cookieFav : [];

    this.getRangeServices(this.getItemIds('service'));
  }

  validationData() {
    this.listFull = this.listFull.filter(x => x !== undefined);
  }

  getItemIds(tpy) {
    const list = this.shopFavoriteList.filter(x => x.itemType === tpy);
    return list ? Object.keys(list).map(idx => list[idx].itemID) : [];
  }

  getRangeServices(ids) {
    if (ids.length > 0) {

      const filt = {
        range: ids
      };

      this._sharedService.getHyperServices(filt).subscribe(
        (response: any) => {
          if (response.return === true) {
            response.data.forEach(element => {

              element.photos.push({ position: 999, url: 'global/img/image_default.png' }); //Para nunca ficar vazio

              const refItem = this.shopFavoriteList.find(x => x.itemID === element.id && x.itemType === 'service');
              const position = this.shopFavoriteList.findIndex(x => x.itemID === element.id && x.itemType === 'service');
              const list = {
                itemID: refItem.itemID,
                itemType: refItem.itemType,
                dateAdd: refItem.dateAdd,
                valueWhenAdded: refItem.valueWhenAdded,
                photo: element.photos[0].url,
                title: element.name,
                value: element.value,
                hyperCoin: element.pricing.hyper_coins_value
              };
              this.listFull[position] = list;
            });
          }
          this.validationData();
        },
        err => { this._hyperToastsService.addToast('error', 'Erro', err); }
      );
    }

  }

  removeItem(item) {
    const pos = this.shopFavoriteList.findIndex(x => x.itemID === item.itemID && x.itemType === item.itemType);
    const posFull = this.listFull.findIndex((x: any) => x.itemID === item.itemID && x.itemType === item.itemType);

    if (pos !== -1 && posFull !== -1) {
      this.shopFavoriteList.splice(pos, 1);
      this.listFull.splice(posFull, 1);

      BroadcastEventService.event('updateShoppingFavorite').emit(this.shopFavoriteList);
    }
  }

  buyItem(item) {
    const shopCart = {
      quantity: 1,
      type: item.itemType,
      id: item.itemID
    };

    this._sharedService.addItemOnShopCart(shopCart, item.maximum_quantity_per_user);
    this._router.navigate([this._sharedService.getSubdomainOwnerStore() + '/shop-cart']);
  }

}