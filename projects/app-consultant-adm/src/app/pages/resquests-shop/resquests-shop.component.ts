import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { SharedService } from '@app-consultant-adm/services/shared.service';
import { HyperToastsService } from 'lib-services';

@Component({
  selector: 'app-consultant-adm-resquests-shop',
  templateUrl: './resquests-shop.component.html',
  styleUrls: ['./resquests-shop.component.less']
})
export class ResquestsShopComponent implements OnInit {

  public dataSource: any = [];
  public cols: any = [];

  public amountAll = 0;
  public comissionAll = 0;

  constructor(
    private _sharedService: SharedService,
    private _hyperToastsService: HyperToastsService,
    private _router: Router,
  ) {
    this.cols = [
      { field: 'buyer_name', header: 'Comprador' },
      { field: 'payment_method', header: 'Pagamento' },
      { field: 'amount', header: 'Valor' },
      { field: 'amount_comission', header: 'Comissão' },
      { field: 'date', header: 'Data' },
      { field: 'status', header: 'Status' },
    ];
  }

  ngOnInit() {
    this._sharedService.addBreadCrumb(
      [
        { 'text': 'Dashboard', 'router': '/home' },
        { 'text': 'Minhas Vendas', 'router': '/requests-shop' },
        { 'text': 'Pedidos da Loja', 'router': '' }
      ]
    );
    this.listShopOrders();
  }

  listShopOrders() {
    this._sharedService.listShopOrders().subscribe(
      (response: any) => {
        if (response.return) {
          const aux = response.data;
          aux.forEach(element => {
            element.amount = Number(element.amount);
            element.hcs_amount = Number(element.hcs_amount);
            this.amountAll += Number(element.amount);
            this.comissionAll += Number(element.amount_comission);
          });
          this.dataSource = aux;
        } else {
          this._hyperToastsService.addToast('warn', 'Atenção!', response.msg);
        }
      },
      err => { this._hyperToastsService.addToast('error', 'Erro!', err); }
    );
  }

  onRowSelect(event) {
    this._router.navigate(['/requests-details/' + event.data.id_order]);
    setTimeout(() => {
      this._sharedService.addBreadCrumb(
        [
          { 'text': 'Dashboard', 'router': '/home' },
          { 'text': 'Minhas Vendas', 'router': '/requests-shop' },
          { 'text': 'Pedidos da Loja', 'router': '/requests-shop' },
          { 'text': 'Detalhe do Pedido', 'router': '' }
        ]
      );
    }, 110);
  }

}
