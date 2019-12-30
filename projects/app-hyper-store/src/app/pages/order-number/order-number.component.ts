import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BroadcastEventService } from 'lib-services';


@Component({
  selector: 'app-hyper-store-order-number',
  templateUrl: './order-number.component.html',
  styleUrls: ['./order-number.component.less']
})
export class OrderNumberComponent implements OnInit {

  public orderNumber = '';
  public orderNumberHJ = '';

  constructor(
    private _route: ActivatedRoute,
    private _router: Router
  ) { }

  ngOnInit() {
    const _self = this;
    this._route.params.subscribe(
      params => {
        _self.orderNumber = params.order;
        _self.orderNumberHJ = params.orderhj;
      }
    );
    BroadcastEventService.event('updateShoppingCart').emit([]);
  }

  gotoOrder(order) {
    this._router.navigate(['/order-details/' + order]);
  }

}
