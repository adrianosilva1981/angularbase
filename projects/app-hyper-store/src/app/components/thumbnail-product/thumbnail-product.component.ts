import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import { HyperCookieService } from 'lib-services';
import { SharedService } from '@app-hyper-store/services/shared.service';

@Component({
  selector: 'app-hyper-store-thumbnail-product',
  templateUrl: './thumbnail-product.component.html',
  styleUrls: ['./thumbnail-product.component.less']
})
export class ThumbnailProducctComponent implements OnInit {

  @Input() itemObject: any;
  public defaultImage: any;
  public selected = [];
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
    const aux = [];
    this.itemObject.features.forEach(element => {
      if (aux.length == 0) {
        aux.push([element]);
        this.selected.push(element.type + ': Aleatório');
      } else {
        const indexAux = aux.findIndex((el, i) => {
          const found = el.find(x => x.type == element.type);
          if (found != undefined) {
            return true;
          }
        });
        if (indexAux != -1) {
          aux[indexAux].push(element);
        } else {
          this.selected.push(element.type + ': Aleatório');
          aux.push([element]);
        }
      }
    });
    this.itemObject.features = aux;
  }

  viewDetails() {
    this._sharedService.lastProduct.id = this.itemObject.id;
    this._route.navigate(['/department/product/' + this.itemObject.id]);
  }

  addToCart() {
    const shopCart = {
      quantity: 1,
      type: 'product',
      id: this.itemObject.id,
      features: this.selected
    };
    this._sharedService.addItemOnShopCart(shopCart, this.itemObject.maximum_quantity_per_user);
  }

}
