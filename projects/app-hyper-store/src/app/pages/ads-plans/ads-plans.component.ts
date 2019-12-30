import { Component, OnInit } from '@angular/core';
import { BroadcastEventService, CheckoutParameter, HyperToastsService } from 'lib-services';
import { SharedService } from '@app-hyper-store/services/shared.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-hyper-store-ads-plans',
  templateUrl: './ads-plans.component.html',
  styleUrls: ['./ads-plans.component.less']
})
export class AdsPlansComponent implements OnInit {

  public plans: any;

  constructor(
    private _sharedService: SharedService,
    private _activatedRoute: ActivatedRoute,
    private _hyperToastsService: HyperToastsService,
    private _router: Router
  ) {
    this._sharedService.listAdsPlans().subscribe(
      response => {
        if (response.return) {
          const data = response.data;
          data.forEach(element => {
            element.actions = JSON.parse('[' + element.actions + ']');
          });


          this._activatedRoute.params.subscribe(
            params => {
              if (params.idPlan !== undefined) {
                data.forEach(element => {
                  if (element.id === params.idPlan) {
                    this.addToCart(params.idPlan);
                    this._router.navigate(['/shop-cart']);
                  }
                });
              }
            }
          );

          this.plans = data;
        } else {
          this._hyperToastsService.addToast('warn', 'Atenção', response.msg);
        }
      },
      err => { this._hyperToastsService.addToast('error', 'Erro', err); }
    );
  }

  ngOnInit() {
  }

  addToCart(id) {
    const shopCart = {
      quantity: 1,
      type: 'product',
      id: id,
      features: []
    };
    this._sharedService.addItemOnShopCart(shopCart, 1);
  }
}
