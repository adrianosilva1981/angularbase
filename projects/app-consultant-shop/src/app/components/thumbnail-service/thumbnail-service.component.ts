import { Component, OnInit, Input, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
import { Router } from '@angular/router';

import { HyperCookieService } from 'lib-services';
import { SharedService } from '@app-consultant-shop/services/shared.service';

@Component({
  selector: 'app-consultant-shop-thumbnail-service',
  templateUrl: './thumbnail-service.component.html',
  styleUrls: ['./thumbnail-service.component.less']
})
export class ThumbnailServiceComponent implements OnChanges, OnInit {

  @Input() itemObject: any;

  public _itemObject: any;
  public inWishList = false;
  public defaultImage: any;
  public userLogged: String;
  constructor(
    private _route: Router,
    private _sharedService: SharedService,
    private _hyperCookieService: HyperCookieService
  ) {
    this.defaultImage = '/global/img/image_default.png';
    const logged = this._sharedService.getUserData();
    if (logged) {
      if (logged.id_youhub != null) {
        this.userLogged = 'smart';
      } else if (logged.prime == 'Y') {
        this.userLogged = 'prime';
      }
    }
  }

  ngOnInit() {
    const list = this._hyperCookieService.getCookie_FAVORITES(this._sharedService.getSubdomainOwnerStore(false));

    this._itemObject = this.itemObject;

    if (list) {
      const exists = list.find(x => x.itemID === this._itemObject.id && x.itemType === 'service');
      this.inWishList = exists;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    const auxItemObject: SimpleChange = changes.itemObject;

    if (auxItemObject) {
      this._itemObject = auxItemObject.currentValue;
    }
  }

  viewDetails() {
    const url = this._sharedService.getSubdomainOwnerStore();
    this._route.navigate([url + '/department/service/' + this._itemObject.id]);
  }

  addToCart() {
    const shopCart = {
      quantity: 1,
      type: 'service',
      id: this._itemObject.id
    };
    this._sharedService.addItemOnShopCart(shopCart, this._itemObject.maximum_quantity_per_user);
  }

  addToFavorite() {
    this._sharedService.addItemOnWishList(this._itemObject, 'service');
    this.inWishList = true;
  }

}
