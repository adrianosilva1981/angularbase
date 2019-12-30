import { Component, OnInit } from '@angular/core';

import { BroadcastEventService, CheckoutParameter } from 'lib-services';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.less']
})
export class AboutComponent implements OnInit {

  public checkout_parameter = new CheckoutParameter;

  constructor() { }

  ngOnInit() {
    BroadcastEventService.event('onBreadCrumb').emit([{ 'text': 'Minha Conta', 'router': '/my-account' }, { 'text': 'Pedidos da Loja', 'router': '' }]);
    this.checkout_parameter.itens_cart = [
      {
        'post': {
          'id': 'id product',
          'qtd': 2,
          'hash': 'RG55RGGH55RGHGHH5554HGGF5',
          'data': {}
        },
        'view': {
          'plot': 1,
          'price': 10.56,
          'price_virtual': 4.00,
          'discount': 0.00,
          'discount_virtual': 0.00,
          'coin': 'BRL',
          'type': 'product'
        }
      },
      {
        'post': {
          'id': 'id service',
          'qtd': 1,
          'hash': 'RG55RGGH55RGHGHH5554HGGF5',
          'data': {}
        },
        'view': {
          'plot': 3,
          'price': 10.56,
          'price_virtual': 0.00,
          'discount': 0.00,
          'discount_virtual': 0.00,
          'coin': 'BRL',
          'type': 'service'
        }
      },
      {
        'post': {
          'id': null,
          'qtd': 1,
          'hash': 'RG55RGGH55RGHGHH5554HGGF5',
          'data': {
            'address': 'id address'
          }
        },
        'view': {
          'plot': 1,
          'price': 11.91,
          'price_virtual': 0.00,
          'discount': 0.00,
          'discount_virtual': 0.00,
          'coin': 'BRL',
          'type': 'shipping'
        }
      },
      {
        'post': {
          'id': 'id plano consultor',
          'qtd': 1,
          'hash': 'RG55RGGH55RGHGHH5554HGGF5',
          'data': {}
        },
        'view': {
          'plot': 2,
          'price': 39.90,
          'price_virtual': 0.00,
          'discount': 0.00,
          'discount_virtual': 0.00,
          'coin': 'BRL',
          'type': 'be-consultant'
        }
      },
      {
        'post': {
          'id': 'id serviço',
          'qtd': 1,
          'hash': 'RG55RGGH55RGHGHH5554HGGF5',
          'data': {
            'consultant': 'id consultor'
          }
        },
        'view': {
          'plot': 1,
          'price': 20.00,
          'price_virtual': 0.00,
          'discount': 0.00,
          'discount_virtual': 0.00,
          'coin': 'BRL',
          'type': 'consultant-service'
        }
      },
      {
        'post': {
          'id': null,
          'qtd': 1,
          'hash': 'RG55RGGH55RGHGHH5554HGGF5',
          'data': {
            'credit_value': 120.50
          }
        },
        'view': {
          'plot': 5,
          'price': 120.50,
          'price_virtual': 0.00,
          'discount': 0.00,
          'discount_virtual': 0.00,
          'coin': 'BRL',
          'type': 'insert-credit'
        }
      }
    ];
    this.checkout_parameter.disableMethods = ['hjpay'];
  }

  openLogin() {
    BroadcastEventService.event('openLoginModal').emit(true);
  }

}
