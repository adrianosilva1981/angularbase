import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from '@app-hyper-store/services/shared.service';

@Component({
  selector: 'app-hyper-store-thumbnail-guide',
  templateUrl: './thumbnail-guide.component.html',
  styleUrls: ['./thumbnail-guide.component.less']
})
export class ThumbnailGuideComponent implements OnInit {
  @Input() itemObject: any;
  constructor(
    private _route: Router,
    private _sharedService: SharedService,
  ) { }

  ngOnInit() {
  }
  viewDetails() {
    this._route.navigate(['/department/guide/' + this.itemObject.id]);
  }

  // addToCart() {
  //   console.log(this.itemObject);
  //   const shopCart = {
  //     quantity: 1,
  //     type: 'guide',
  //     id: this.itemObject.id
  //   };
  //   this._sharedService.addItemOnShopCart(shopCart, this.itemObject.maximum_quantity_per_user);
  // }
}
