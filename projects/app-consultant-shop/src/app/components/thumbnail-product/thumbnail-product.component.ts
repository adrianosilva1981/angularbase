import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import { HyperCookieService } from 'lib-services';
import { SharedService } from '@app-consultant-shop/services/shared.service';

@Component({
  selector: 'app-consultant-shop-thumbnail-product',
  templateUrl: './thumbnail-product.component.html',
  styleUrls: ['./thumbnail-product.component.less']
})
export class ThumbnailProducctComponent implements OnInit {

  @Input() itemObject: any;
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

  ngOnInit() { }

  viewDetails() {
    const url = this._sharedService.getSubdomainOwnerStore();
    this._route.navigate([url + '/department/product/' + this.itemObject.id]);
  }

  addToCart() {
    const shopCart = {
      quantity: 1,
      type: 'product',
      id: this.itemObject.id
    };
    this._sharedService.addItemOnShopCart(shopCart, this.itemObject.maximum_quantity_per_user);
  }
}
