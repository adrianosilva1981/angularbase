import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from '@app-consultant-shop/services/shared.service';
import { HyperToastsService } from 'lib-services';

@Component({
  selector: 'app-consultant-shop-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.less']
})
export class OrderDetailsComponent implements OnInit {

  public orderNumber = '';
  public objOrderDetails: any;

  constructor(
    private _route: ActivatedRoute,
    private _sharedService: SharedService,
    private _hyperToastsService: HyperToastsService
  ) { }

  ngOnInit() {
    const _self = this;

    this._sharedService.addBreadCrumb(
      [
        { 'text': 'Minha Conta', 'router': this._sharedService.getSubdomainOwnerStore() + '/my-account' },
        { 'text': 'Meus Pedidos', 'router': this._sharedService.getSubdomainOwnerStore() + '/my-requests' },
        { 'text': 'Detalhes do Pedido', 'router': '' }
      ]
    );

    this._route.params.subscribe(
      params => {
        _self.orderNumber = params.order;
        this.getOrderByID(params.order);
      }
    );
  }

  getOrderByID(idOrder) {
    this._sharedService.getHyperOrder(idOrder).subscribe(
      (response: any) => {
        if (response.return) {
          this.objOrderDetails = response.data;
        } else {
          this._hyperToastsService.addToast('error', 'Erro', response.msg);
        }
      },
      err => { this._hyperToastsService.addToast('error', 'Erro', err); }
    );
  }
}
