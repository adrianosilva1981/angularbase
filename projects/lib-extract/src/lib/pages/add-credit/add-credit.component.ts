import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../services/shared.service';
import { CheckoutParameter, BroadcastEventService } from 'lib-services';

@Component({
  selector: 'lib-extract-add-credit',
  templateUrl: './add-credit.component.html',
  styleUrls: ['./add-credit.component.less']
})
export class AddCreditComponent implements OnInit {

  public checkout_parameter = new CheckoutParameter;
  constructor(
    private _Services: SharedService,
  ) {

  }

  ngOnInit() {
    BroadcastEventService.event('onBreadCrumb').emit([
      { 'text': 'Meu saldo', 'router': '/extract' },
      { 'text': 'Adicionar crédito', 'router': '' }
    ]);
    this.checkout_parameter = this._Services.getCheckoutParameter();
  }
  checkout(evt) {
    console.log(evt);
    const methodData = evt.checkoutForm;
    const add = {
      payment_method: methodData.payment_method,
      coin: 'BRL',
      document: methodData.document || '',
      amount: evt.parameters.itens_cart[0].post.data.credit_value || '',
      numberCard: methodData.card_number || '',
      numberCVV: methodData.card_cvv || '',
      nameCard: methodData.card_name || '',
      months: methodData.card_month || '',
      year: methodData.card_year || ''
    };
    this._Services.postInsertCredit(add);
  }
}
