import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BroadcastEventService, CheckoutParameter, HyperCookieService, HyperToastsService } from 'lib-services';
import { SharedService } from '@app-hyper-store/services/shared.service';

declare var require: any;
const jsonSteps = require('global/data/payment-steps.json');

@Component({
  selector: 'app-hyper-store-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.less']
})
export class CheckoutComponent implements OnInit {
  public currentStep = 2;
  public steps = jsonSteps;
  public objUserData: any = {};
  public addressSelected: any = {};
  public checkout_parameter;
  public listItens: any = [];
  public shippingSelected: any = [];
  public intemsInCart: any = [];
  public totalPoints = 0;

  constructor(
    private _sharedService: SharedService,
    private _hyperCookieService: HyperCookieService,
    private _hyperToastsService: HyperToastsService,
    private _router: Router
  ) { }

  ngOnInit() {
    this.objUserData = this._sharedService.getUserData();
    this.intemsInCart = this._hyperCookieService.getCookie_SHOPCART();

    if (this.objUserData) {
      this.currentStep = 3;
    }
    this.listenerLogin();
    this.init(this.intemsInCart);
  }

  init(shopCart) {
    if (shopCart) {
      const listProduct = shopCart.filter(x => x.type === 'product');
      const listService = shopCart.filter(x => x.type === 'service');
      const listGuides = shopCart.filter(x => x.type === 'gift_code');

      const IDSProduct = listProduct ? Object.keys(listProduct).map(idx => listProduct[idx].id) : [];
      const IDSServices = listService ? Object.keys(listService).map(idx => listService[idx].id) : [];
      const IDSGuides = listGuides ? Object.keys(listGuides).map(idx => listGuides[idx].id) : [];

      this.getRangeProducts(IDSProduct);
      this.getRangeServices(IDSServices);
      this.getRangeGuides(IDSGuides);
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

  mountCheckoutParameters() {
    this.checkout_parameter = new CheckoutParameter;
    // this.checkout_parameter.disableMethods = ['hjpay'];
    const postData: any = [];

    this.listItens.forEach(element => {
      element.points_value != null ? this.totalPoints += Number(element.points_value) * Number(element._qty) : element.points_value = 0;

      const price = element.value_associate == 0 ? element.value : element[this.getFieldPrice()];
      const aux = {
        'post': {
          'id': element.id,
          'qtd': Number(element._qty),
          'hash': element.hash,
          'data': {
            'price': Number(price),
            'type': element._type,
            'features': element.features
          }
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

  listenerLogin() {
    BroadcastEventService.event('listenerLoginComponent').subscribe(evt => {
      if (evt.JWT) {
        this.objUserData = evt;
        this.currentStep = 3;
      }
    });
  }

  onStepClick(stp) {
    this.currentStep = stp.step;

    if (this.currentStep === 1) {
      this._router.navigate(['/shop-cart']);
    }
  }

  onAddressSelected(evt) {
    this.addressSelected = evt;
  }

  onShippingSelected(evt) {
    this.shippingSelected = evt;
  }

  onCheckoutSuccess(checkoutData) {
    this._router.navigate(['/my-requests']);
    this._hyperCookieService.deleteCookie_SHOPCART();
    //location.reload();
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
                element.features = refItem.features;
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

  getRangeGuides(ids) {
    if (ids.length > 0) {
      const filt = { range: ids };
      this._sharedService.listGiftId(filt).subscribe(
        (response: any) => {
          if (response.return) {
            const auxResponse = Array.isArray(response.data) ? response.data : [response.data];

            auxResponse.forEach(element => {
              const refItem = this.intemsInCart.find(x => x.id == element.id && x.type === 'gift_code');
              if (refItem) {
                element._type = refItem.type;
                element._qty = refItem.quantity;
                element.value_associate = 0;
                element.value = element.type == 'V' && refItem.value > element.value ? refItem.value : element.value;
                element.points_value = element.type == 'V' ? this.calcPointsPercent(element) : element.points_value;
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

  calcPointsPercent(gift) {
    if (gift.type === 'V' && gift.discount_net) {
      let points = gift.value * gift.discount_net / 100;
      points *= 0.55;
      points = Math.trunc(points);
      if (points > 0) {
        return points;
      } else {
        return 0;
      }
    }
  }
}
