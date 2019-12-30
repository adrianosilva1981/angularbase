import { Component, OnInit, Inject } from '@angular/core';
import { SharedService } from '@app-consultant-adm/services/shared.service';
import { HyperToastsService, CheckoutParameter } from 'lib-services';
import { Router } from '@angular/router';
import { environment } from '@env/app-consultant-adm';

@Component({
  selector: 'app-consultant-adm-pack',
  templateUrl: './pack.component.html',
  styleUrls: ['./pack.component.less']
})
export class PackComponent implements OnInit {
  public quantity = 1;
  public pack: any;
  public checkout_parameter: any;

  public cols = [
    { field: 'name', header: 'Nome' },
    { field: 'serial', header: 'Voucher Smart' },
    { field: 'statusGift', header: 'Status' },
    { field: 'activation_date', header: 'Data ativação' },
    { field: 'id', header: 'N. Pedido' }
  ];
  public objPacks = [

  ];
  constructor(
    private _sharedService: SharedService,
    private _hyperToastsService: HyperToastsService,
    private _router: Router,
  ) { }

  ngOnInit() {
    this._sharedService.addBreadCrumb(
      [
        { 'text': 'Dashboard', 'router': '/home' },
        { 'text': 'Comprar Voucher Smart', 'router': '' }
      ]
    );
    this.getPack();
    this.getPacksPurchased();
  }

  getPack() {
    this._sharedService.getHyperProducts({ idProduct: environment.idPackEstabelecimentos }).subscribe(
      (response: any) => {
        if (response.return) {
          this.pack = response.data[0];
          this.mountCheckout();
        } else {
          this._hyperToastsService.addToast('warn', 'Atenção', response.msg);
        }
      },
      err => { this._hyperToastsService.addToast('error', 'Erro', err); }
    );
  }

  changeQuantity(qtd) {
    this.quantity += qtd;
    if (this.quantity < 1) {
      this.quantity = 1;
    }
    this.mountCheckout();
  }

  mountCheckout() {
    this.checkout_parameter = new CheckoutParameter;
    // this.checkout_parameter.disableMethods = ['hjpay'];

    this.checkout_parameter.itens_cart = [
      {
        'post': {
          'id': this.pack.id,
          'qtd': this.quantity,
          'hash': this.pack.hash,
          'data': {
            'price': this.pack.value,
            'type': this.pack.type,
            'features': this.pack.features
          }
        },
        'view': {
          'plot': 1,
          'price': this.pack.value,
          'price_virtual': 0.00,
          'discount': 0.00,
          'discount_virtual': 0.00,
          'coin': 'BRL',
          'type': 'product'
        }
      }
    ];
  }

  onCheckoutSuccess() {

  }

  getPacksPurchased() {
    this._sharedService.getVoucherPack().subscribe(
      response => {
        if (response.return) {
          this.objPacks = response.data;
        }
      }
    );
  }
}
