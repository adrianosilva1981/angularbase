import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from '@app-hyper-store/services/shared.service';
import { HyperToastsService } from 'lib-services';

@Component({
  selector: 'app-hyper-store-order-details',
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
        { 'text': 'Minha Conta', 'router': '/my-account' },
        { 'text': 'Meus Pedidos', 'router': '/my-requests' },
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
          this.objOrderDetails.forEach(element => {
            element.extraInfo = (element.extraInfo == null || element.extraInfo == '') ? '[]' : element.extraInfo;
            element.extraInfo = JSON.parse(element.extraInfo);
          });
        } else {
          this._hyperToastsService.addToast('error', 'Erro', response.msg);
        }
      },
      err => { this._hyperToastsService.addToast('error', 'Erro', err); }
    );
  }
}
