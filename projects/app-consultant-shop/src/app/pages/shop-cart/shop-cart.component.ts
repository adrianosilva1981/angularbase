import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-consultant-shop-shop-cart',
  templateUrl: './shop-cart.component.html',
  styleUrls: ['./shop-cart.component.less']
})
export class ShopCartComponent implements OnInit {
  public shopCartItems: any = [];

  constructor() { }

  ngOnInit() { }

  onShopCartItems(evt) {
    if (evt) {
      this.shopCartItems = evt.cartItens;
    }
  }
}
