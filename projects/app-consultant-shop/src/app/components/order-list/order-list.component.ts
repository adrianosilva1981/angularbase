import { Component, OnInit, Input } from '@angular/core';

import { HyperToastsService } from 'lib-services';
import { SharedService } from '@app-consultant-shop/services/shared.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-consultant-shop-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.less']
})
export class OrderListComponent implements OnInit {

  @Input() orderList: any = [];

  constructor(
    private _router: Router,
    private _sharedService: SharedService,
    private _hyperToastsService: HyperToastsService
  ) { }

  ngOnInit() {
    //this.formatDate();
    this.getAllOrderDetails();
  }

  formatDate() {
    if (this.orderList) {
      this.orderList.forEach(element => {
        const date = new Date(element.createDate);

        element.createDate = {
          day: date.getDate() < 10 ? '0' + date.getDate() : date.getDate(),
          month: (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1),
          year: date.getFullYear(),
          hour: date.getHours() < 10 ? '0' + date.getHours() : date.getHours(),
          minute: date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes(),
          second: date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
        };
      });
    }
  }

  getAllOrderDetails() {
    this._sharedService.getAllHyperOrder().subscribe(
      (response: any) => {
        if (response.return === true) {
          this.addAmountInorderList(response.data);
        } else {
          this._hyperToastsService.addToast('warn', 'Atenção', response.msg);
        }
      },
      err => { this._hyperToastsService.addToast('error', 'Error', err); }
    );
  }

  addAmountInorderList(listHJ) {
    this.orderList.forEach(element => {
      const aux = listHJ.find(x => Number(x.id) === Number(element.orderHJ));
      if (aux) {
        element.amount = aux.amount;
        element.status = aux.status;
      }
    });
  }

  viewDetails(item) {
    this._router.navigate([this._sharedService.getSubdomainOwnerStore() + '/order-details/', item]);
  }

  openBillet(url) {
    window.open(url, '_blank');
  }
}
