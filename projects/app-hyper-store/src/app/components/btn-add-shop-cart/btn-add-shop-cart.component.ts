import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs';
import 'rxjs/add/observable/timer';

@Component({
  selector: 'app-hyper-store-btn-add-shop-cart',
  templateUrl: './btn-add-shop-cart.component.html',
  styleUrls: ['./btn-add-shop-cart.component.less']
})
export class BtnAddShopCartComponent implements OnInit {

  public stage = 'add';
  private subscription = new Subscription;

  @Output() onclick: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  addToCart() {
    this.subscription.unsubscribe();

    this.stage = 'wait';

    const timer = Observable.timer(0, 1000);
    this.subscription = timer.subscribe(
      t => {
        if (t >= 2 && t < 3) {
          this.stage = 'success';
        }
        if (t >= 3) {
          this.stage = 'add';
          this.subscription.unsubscribe();
        }
      });

    this.onclick.emit();
  }
}
