import { Component, OnInit } from '@angular/core';

import { CheckoutParameter, HyperToastsService } from 'lib-services';
import { SharedService } from '@app-hyper-opportunity/services/shared.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-hyper-opportunity-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.less']
})
export class CheckoutComponent implements OnInit {

  public shippingSelected: any;
  public checkout_parameter;
  public objPlan: any;

  private postData: any = {};

  constructor(
    private _sharedService: SharedService,
    private _hyperToastService: HyperToastsService,
    private _activatedRoute: ActivatedRoute
  ) {

  }

  ngOnInit() {

    this._activatedRoute.params.subscribe(
      params => {
        if (params.id) {
          this.getPlan(params.id);
        }
      }
    );
  }

  getPlan(plan) {
    this._sharedService.getSpecificPlan(plan).subscribe(
      (response: any) => {
        if (response.return === true) {
          this.checkout_parameter = new CheckoutParameter;
          this.objPlan = response.data;
          this.mountData();
          this.checkout_parameter.disableMethods = ['hjpay'];
        } else {
          this._hyperToastService.addToast('warm', 'Atenção', response.msg);
        }
      },
      err => { this._hyperToastService.addToast('error', 'Erro', 'Ocorreu um erro inesperado'); }
    );
  }

  mountData() {
    const postData: any = [];

    const aux = {
      'post': {
        'id': 32,
        'qtd': 1,
        'hash': 'T441U98O55K43C12E31H8C5R3E2P1Y1H8mTJtSUyE2SRdnZmJHSnJTOCpUYzcWN55S43B12O31J8.5R3E2P1Y1HZzQwg1cwNGVIJ3NihEOrRVbYhUWrQEOPZFN4kVdWhHb3ljSxkDcKxWZ55S43B12O31J8.5R3E2P1Y1HdTS1NWSjVGV2Yke2VUZrVFZM5kcKRnYit2d0hkZpZme1w0RQhWQ252K5g2dJR3cPdkePhzdiNVQzYkTrcjb',
        'data': {}
      },
      'view': {
        'plot': 1,
        'price': Number(this.objPlan.price),
        'price_virtual': 0.00,
        'discount': 0.00,
        'discount_virtual': 0.00,
        'coin': 'BRL',
        'type': 'plan'
      }
    };

    postData.push(aux);


    this.checkout_parameter.itens_cart = postData;
  }

  //Provisorio*************************
  onSubmitCheckout(evt) {
    this.postData = {
      id_plan: this.objPlan.id,
      months: evt.checkoutForm.card_month,
      nameCard: evt.checkoutForm.card_name,
      numberCVV: evt.checkoutForm.card_cvv,
      numberCard: evt.checkoutForm.card_number,
      year: evt.checkoutForm.card_year,
      paymentMethod: evt.checkoutForm.payment_method.replace('_', '-'),
      plots: evt.checkoutForm.plots
    };

    this._sharedService.createSignature(this.postData).subscribe(
      (response: any) => {
        if (response.return === true) {
          this._hyperToastService.addToast('success', 'Sucesso', 'Adesão efetuada com sucesso!');
        } else {
          this._hyperToastService.addToast('warn', 'Atenção', response.msg);
        }
      },
      err => { this._hyperToastService.addToast('error', 'Erro', err); }
    );
  }

}
