import { Component, OnInit } from '@angular/core';
import { BroadcastEventService, CheckoutParameter, HyperToastsService } from 'lib-services';
import { SharedService } from '@app-hyper-store/services/shared.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hyper-store-be-prime',
  templateUrl: './be-prime.component.html',
  styleUrls: ['./be-prime.component.less']
})
export class BePrimeComponent implements OnInit {

  public objUserData: any = {};
  public checkout_parameter = new CheckoutParameter;

  constructor(
    private _sharedService: SharedService,
    private _hyperToastsService: HyperToastsService,
    private _router: Router
  ) {
    BroadcastEventService.event('listenerLoginComponent').subscribe(evt => {
      if (evt.JWT) {
        this.objUserData = evt;
      }
    });
  }

  ngOnInit() {
    this.objUserData = this._sharedService.getUserData();
    this.checkout_parameter.disableMethods = ['hjpay'];

    this.checkout_parameter.itens_cart = [
      {
        'post': {
          'id': null,
          'qtd': 1,
          'hash': '2UnT3M3bl5Udx55R43E12P31Y8H5.3S2B1O1J3L4BzKn1GMEhVR2RUMFF2YP5mZjRFeLJ3RwZWVWJUdrZ3MXtiYzgldXl0M4hUZINERqNmSrIFUpZGONRnMSZ255S43B12O31J8.5R3E2P1Y1HJFm55S43B12O31J8.5R3E2P1Y1H0Mn55S43B12O31J8.5R3E2P1Y1HvEWdzhTOYRlT4omSJZzUU92UN9UYD5meOJ0TMljZiBVZCl055S43B12O31J8.5R3E2P1Y1HmdzM3EHUqN1QVJEVIVkW1VlMVV2chVzRHVWZTtmeFZHcm90SH5UYE9yYYBHb290TXtWVTd0MBVFStB1b5kXUGFEZXdTRGVnQTtWW',
          'data': {}
        },
        'view': {
          'plot': 1,
          'price': 49.90,
          'price_virtual': 0.00,
          'discount': 0.00,
          'discount_virtual': 0.00,
          'coin': 'BRL',
          'type': 'plan_prime'
        }
      }
    ];

  }

  onCheckoutSuccess(evt) {
    if (evt) {
      this._hyperToastsService.addToast('success', 'Sucesso', 'Pagamento realizado com sucesso!');
      this._router.navigate(['/department/product']);
    }
  }

}
