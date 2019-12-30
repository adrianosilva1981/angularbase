import { Component, OnInit } from '@angular/core';

import { CheckoutParameter, HyperCookieService, BroadcastEventService, HyperToastsService } from 'lib-services';
import { SharedService } from '@app-consultant-shop/services/shared.service';
import { Router } from '@angular/router';

declare var require: any;
const jsonSteps = require('global/data/payment-steps.json');

@Component({
  selector: 'app-consultant-shop-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.less']
})
export class CheckoutComponent implements OnInit {

  public shippingSelected: any;
  public shopCartEmpty = true;
  public checkout_parameter;
  public blockCheckout = false;
  public objUserData: any = {};

  public currentStep = 2;
  public steps = jsonSteps;
  public addressSelected: any = {};
  public listItens: any = [];
  public intemsInCart: any = [];
  public objConsultant: any = {};
  public totalPoints = 0;

  private idOwner = 0;

  constructor(
    private _sharedService: SharedService,
    private _route: Router,
    private _hyperCookieService: HyperCookieService,
    private _hyperToastsService: HyperToastsService,
  ) {
    BroadcastEventService.event('onShippingSelect').subscribe(shipping => {
      this.addShippingToCheckout(shipping);
      this.blockCheckout = false;
    });

    BroadcastEventService.event('onValidadeShipping').subscribe(val => {
      if (val) {
        this.blockCheckout = true;
        this.addShippingToCheckout(null);
      }
    });

    BroadcastEventService.event('listenerLoginComponent').subscribe(evt => {
      if (evt.JWT) {
        this.objUserData = evt;
      }
    });
  }

  ngOnInit() {
    this.objUserData = this._sharedService.getUserData();
    this.intemsInCart = this._hyperCookieService.getCookie_SHOPCART(this._sharedService.getSubdomainOwnerStore(false));

    this.idOwner = this._sharedService.getOwnerStore().id;

    this.objConsultant = this._sharedService.getOwnerStore();

    if (this.objUserData) {
      this.currentStep = 3;
    }

    this.listenerLogin();
    this.init(this.intemsInCart);
  }

  listenerLogin() {
    BroadcastEventService.event('listenerLoginComponent').subscribe(evt => {
      if (evt.JWT) {
        this.objUserData = evt;
        this.currentStep = 3;
      }
    });
  }

  init(shopCart) {
    if (shopCart) {
      const listProduct = shopCart.filter(x => x.type === 'product');
      const listService = shopCart.filter(x => x.type === 'service');

      const IDSProduct = listProduct ? Object.keys(listProduct).map(idx => listProduct[idx].id) : [];
      const IDSServices = listService ? Object.keys(listService).map(idx => listService[idx].id) : [];

      this.getRangeProducts(IDSProduct);
      this.getRangeServices(IDSServices);
    }
  }

  onShopCartItems(evt) {
    this.checkout_parameter = new CheckoutParameter;
    if (evt) {
      if (evt.cartItens.length <= 0) {
        this.shopCartEmpty = true;
      } else {
        this.mountCheckout(evt);
        setTimeout(() => {
          BroadcastEventService.event('shopCartListChanged').emit(evt.cartItens);
        }, 250);
      }
    } else {
      this.shopCartEmpty = true;
    }
  }

  getFieldPrice() {
    if (this.objUserData) {
      if (this.objUserData.id_youhub != null) {
        return 'value_associate';
      } else if (this.objUserData.prime === 'Y') {
        return 'value_prime';
      } else {
        return 'value';
      }
    } else {
      return 'value';
    }
  }

  mountCheckout(evt) {
    const postData: any = [];

    this.shopCartEmpty = false;

    evt.cartItens.forEach(element => {

      const price = element.value_associate == 0 ? element.value : element[this.getFieldPrice()];
      const discount = 0.00;
      const discountVirtual = 0.00;

      const aux = {
        'post': {
          'id': element.id,
          'qtd': Number(element.quantityShopCart),
          'hash': element.hash,
          'data': {
            'consultant': this._sharedService.getConsultantID()
          }
        },
        'view': {
          'plot': 1,
          'price': Number(price),
          'price_virtual': 0.00,
          'discount': discount,
          'discount_virtual': discountVirtual,
          'coin': element.coin || 'BRL',
          'type': element.typeShopCart
        }
      };
      postData.push(aux);

    });

    this.checkout_parameter.itens_cart = postData;
    this.checkout_parameter.woner = this.idOwner;
  }

  addShippingToCheckout(shipping) {
    const auxCheckoutParameter = Object.assign({}, this.checkout_parameter); // Assign para nao copiar a referencia
    const pos = auxCheckoutParameter.itens_cart.findIndex(x => x.view.type === 'shipping');
    let aux;

    if (shipping) {
      aux = {
        'post': {
          'id': null,
          'qtd': 1,
          'hash': shipping.hash,
          'data': {
            'consultant': this._sharedService.getConsultantID(),
            'id_delivery_address': shipping.id_delivery_address
          }
        },
        'view': {
          'plot': Number(shipping.plot),
          'price': Number(shipping.price),
          'price_virtual': Number(shipping.price_virtual),
          'discount': Number(shipping.discount),
          'discount_virtual': Number(shipping.discount_virtual),
          'coin': shipping.coin || 'BRL',
          'type': shipping.type
        }
      };
      if (pos !== -1) {
        auxCheckoutParameter.itens_cart[pos] = aux;
      } else {
        auxCheckoutParameter.itens_cart.push(aux);
      }
    }
    if (!shipping && pos !== -1) {
      auxCheckoutParameter.itens_cart.splice(pos, 1);
    }

    this.checkout_parameter = new CheckoutParameter;
    this.checkout_parameter = auxCheckoutParameter;
  }

  onCheckoutSuccess(checkoutData) {
    this._hyperCookieService.deleteCookie_SHOPCART(this._sharedService.getSubdomainOwnerStore(false));
    const url = this._sharedService.getSubdomainOwnerStore();
    this._route.navigate([url + '/my-requests']);
  }

  onAddressSelected(evt) {
    this.addressSelected = evt;
  }

  onShippingSelected(evt) {
    this.shippingSelected = evt;
  }

  mountCheckoutParameters() {
    this.checkout_parameter = new CheckoutParameter;
    // this.checkout_parameter.disableMethods = ['hjpay'];

    const postData: any = [];

    this.listItens.forEach(element => {

      this.totalPoints += Number(element.points_value) * Number(element._qty);

      const price = element.value_associate == 0 ? element.value : element[this.getFieldPrice()];

      const aux = {
        'post': {
          'id': element.id,
          'qtd': Number(element._qty),
          'hash': element.hash,
          'data': {}
        },
        'view': {
          'plot': 1, // Máximo de vezes que este item pode ser dividido
          'price': Number(price),
          'price_virtual': 0.00,
          'discount': 0.00,
          'discount_virtual': 0.00,
          'coin': element.coin || 'BRL',
          'type': element._type
        }
      };
      postData.push(aux);

    });

    this.checkout_parameter.itens_cart = postData;
    this.checkout_parameter.woner = this.idOwner;

    this.shippingSelected.id_delivery_address = this.addressSelected.id;

    if (this.shippingSelected.amount > -1) {
      this.checkout_parameter.itens_cart.push(
        {
          post: {
            id: null,
            qtd: 1,
            hash: 'T441U98O55K43C12E31H8C5R3E2P1Y1H0TPBVjQYRTdy8SY350RyVEeiJzQzY1Lyg255S43B12O31J8.5R3E2P1Y1HKdVc3h1c3R2LpNV55S43B12O31J8.5R3E2P1Y1HG9CdtZETyVDU34UMJRjMtNVQQREeIhkQDtkdjBFc2Y0QThnMuZG55S43B12O31J8.5R3E2P1Y1HsFzRwMje2k2cvQmdjxEeqVkMMZFc1MEZr55R43E12P31Y8H5.3S2B1O1JlR4Zl55S43B12O31J8.5R3E2P1Y1HQd3d3QVVlhVOtdkcz4mW5YmWMh2QzVWO5g2dJR3cPdkePhzdiNVQzYkTrcjb',
            data: this.shippingSelected
          },
          view: {
            plot: 1, // Máximo de vezes que este item pode ser dividido
            price: this.shippingSelected.amount,
            price_virtual: 0.00,
            discount: 0.00,
            discount_virtual: 0.00,
            coin: 'BRL',
            type: 'shipping'
          }
        }
      );
    }
  }

  getRangeServices(ids) {
    if (ids.length > 0) {
      const filt = { range: ids };
      this._sharedService.getHyperServices(filt).subscribe(
        (response: any) => {
          if (response.return === true) {
            const auxResponse = Array.isArray(response.data) ? response.data : [response.data];

            auxResponse.forEach(element => {
              const refItem = this.intemsInCart.find(x => x.id == element.id && x.type === 'service');
              if (refItem) {
                element._type = refItem.type;
                element._qty = refItem.quantity;
              }
            });

            this.listItens = this.listItens.concat(auxResponse);
          }
        },
        err => {
          this._hyperToastsService.addToast('error', 'Erro', err);
        }
      );
    }
  }

  getRangeProducts(ids) {
    if (ids.length > 0) {
      const filt = { range: ids };
      this._sharedService.getHyperProducts(filt).subscribe(
        (response: any) => {
          if (response.return) {
            const auxResponse = Array.isArray(response.data) ? response.data : [response.data];

            auxResponse.forEach(element => {
              const refItem = this.intemsInCart.find(x => x.id == element.id && x.type === 'product');
              if (refItem) {
                element._type = refItem.type;
                element._qty = refItem.quantity;
              }
            });

            this.listItens = this.listItens.concat(auxResponse);
          }
        },
        err => {
          this._hyperToastsService.addToast('error', 'Erro', err);
        }
      );
    }
  }

  onStepClick(stp) {
    this.currentStep = stp.step;

    if (this.currentStep === 1) {
      this._route.navigate([this._sharedService.getSubdomainOwnerStore() + '/shop-cart']);
    }
  }

  goHome() {
    this._route.navigate([this._sharedService.getSubdomainOwnerStore() + '/home']);
  }
}
