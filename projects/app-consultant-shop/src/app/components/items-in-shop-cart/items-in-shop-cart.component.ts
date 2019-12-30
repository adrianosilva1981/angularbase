import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';

import { BroadcastEventService, HyperCookieService, HyperToastsService } from 'lib-services';
import { SharedService } from '@app-consultant-shop/services/shared.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-consultant-shop-items-in-shop-cart',
  templateUrl: './items-in-shop-cart.component.html',
  styleUrls: ['./items-in-shop-cart.component.less']
})
export class ItemsInShopCartComponent implements OnInit {

  @Input() editable: Boolean = false;
  @Output() onShopCartItems = new EventEmitter<any>();

  public shopCartList: any = [];
  public shopCartFull: any = [];
  public resumeList: any = {};
  public objUserData: any = {};
  public pageLoaded = false;
  public fieldPricePerTypeUser = '';

  constructor(
    private _hyperCookieService: HyperCookieService,
    private _hyperToastsService: HyperToastsService,
    private _sharedService: SharedService,
    private _router: Router
  ) {
    BroadcastEventService.event('listenerLoginComponent').subscribe(evt => {
      if (evt.JWT) {
        this.objUserData = evt;
        this.resetVariables();
        this.attFieldPrice();
        this.init(this._hyperCookieService.getCookie_SHOPCART(this._sharedService.getSubdomainOwnerStore(false)));
      }
    });
  }

  ngOnInit() {
    this.objUserData = this._sharedService.getUserData();
    this.init(this._hyperCookieService.getCookie_SHOPCART(this._sharedService.getSubdomainOwnerStore(false)));
    this.attFieldPrice();
  }


  init(shopCart) {
    this.shopCartList = shopCart;
    if (this.shopCartList) {
      const listProduct = this.shopCartList.filter(x => x.type === 'product');
      const listService = this.shopCartList.filter(x => x.type === 'service');

      const IDSProduct = listProduct ? Object.keys(listProduct).map(idx => listProduct[idx].id) : [];
      const IDSServices = listService ? Object.keys(listService).map(idx => listService[idx].id) : [];

      this.getRangeProducts(IDSProduct);
      this.getRangeServices(IDSServices);
    } else {
      this.onShopCartItems.emit(undefined);
      this.pageLoaded = true;
    }
  }

  attFieldPrice() {
    if (this.objUserData) {
      if (this.objUserData.id_youhub != null) {
        this.fieldPricePerTypeUser = 'value_associate';
      } else if (this.objUserData.prime === 'Y') {
        this.fieldPricePerTypeUser = 'value_prime';
      } else {
        this.fieldPricePerTypeUser = 'value';
      }
    } else {
      this.fieldPricePerTypeUser = 'value';
    }
  }

  resetVariables() {
    this.shopCartList = [];
    this.shopCartFull = [];
    this.resumeList = {};
  }

  redirectToHome() {
    this._router.navigate([this._sharedService.getSubdomainOwnerStore()]);
  }

  getRangeServices(ids) {
    if (ids.length > 0) {

      const filt = { range: ids };

      this._sharedService.getHyperServices(filt).subscribe(
        (response: any) => {
          this.pageLoaded = true;
          if (response.return === true) {

            const auxResponse = Array.isArray(response.data) ? response.data : [response.data];

            auxResponse.forEach(element => {
              const refItem = this.shopCartList.find(x => x.id == element.id && x.type === 'service');
              if (refItem) {
                element.typeShopCart = refItem.type;
                element.quantityShopCart = refItem.quantity;
                element.idShopCart = refItem.id;
              }
            });
            this.shopCartFull = this.shopCartFull.concat(auxResponse);
            this.itemChange();
          }
        },
        err => {
          this._hyperToastsService.addToast('error', 'Erro', err);
          this.pageLoaded = true;
        }
      );
    }
  }

  getRangeProducts(ids) {
    if (ids.length > 0) {

      const filt = { range: ids };

      this._sharedService.getHyperProducts(filt).subscribe(
        (response: any) => {
          this.pageLoaded = true;
          if (response.return) {

            const auxResponse = Array.isArray(response.data) ? response.data : [response.data];

            auxResponse.forEach(element => {
              const refItem = this.shopCartList.find(x => x.id == element.id && x.type === 'product');
              if (refItem) {
                element.typeShopCart = refItem.type;
                element.quantityShopCart = refItem.quantity;
                element.idShopCart = refItem.id;
              }
            });
            this.shopCartFull = this.shopCartFull.concat(auxResponse);
            this.itemChange();
          }
        },
        err => {
          this._hyperToastsService.addToast('error', 'Erro', err);
          this.pageLoaded = true;
        }
      );
    }
  }

  changeQuantity(item, qnt) {
    const ref = this.shopCartList.find((x: any) => x.id === item.idShopCart && x.type === item.typeShopCart);
    const refFull = this.shopCartFull.find((x: any) => x.idShopCart === item.idShopCart && x.typeShopCart === item.typeShopCart);

    if (ref && refFull) {
      let aux = Number(ref.quantity) + Number(qnt);
      aux = aux < 1 ? 1 : aux;
      aux = aux > item.maximum_quantity_per_user ? item.maximum_quantity_per_user : aux;

      ref.quantity = aux;
      refFull.quantityShopCart = aux;

      BroadcastEventService.event('updateShoppingCart').emit(this.shopCartList);

      this.itemChange();
    }
  }

  removeFromShopCart(item) {
    const pos = this.shopCartList.findIndex((x: any) => x.id === item.idShopCart && x.type === item.typeShopCart);
    const posFull = this.shopCartFull.findIndex((x: any) => x.idShopCart === item.idShopCart && x.typeShopCart === item.typeShopCart);

    if (pos !== -1 && posFull !== -1) {
      this.shopCartList.splice(pos, 1);
      this.shopCartFull.splice(posFull, 1);

      this.itemChange();

      BroadcastEventService.event('updateShoppingCart').emit(this.shopCartList);
    }
  }

  itemChange() {
    let value = 0;

    this.shopCartFull.forEach(element => {
      const auxValue = element.value_associate == 0 ? element.value : element[this.fieldPricePerTypeUser];
      value = value + Number(auxValue) * Number(element.quantityShopCart);
    });

    this.resumeList = {
      resume: {
        money: value,
        hyperCoins: 0
      },
      cartItens: this.shopCartFull
    };
    this.onShopCartItems.emit(this.resumeList);
  }
}
