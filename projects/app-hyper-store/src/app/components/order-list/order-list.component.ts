import { Component, OnInit, Input } from '@angular/core';

import { HyperToastsService } from 'lib-services';
import { SharedService } from '@app-hyper-store/services/shared.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hyper-store-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.less']
})
export class OrderListComponent implements OnInit {

  @Input() orderList: any = [];
  public cols: any[];
  public status = [];
  private obj = [];

  public statusPayment = {
    'AP': 'Aguardando Pagamento',
    'PC': 'Pagamento Confirmado',
    'C': 'Cancelado',
    'G': 'Gerado',
    'PE': 'Pedido Efetuado',
    'PA': 'Pedido Autorizado',
    'NF': 'Nota Fiscal Emitida',
    'ET': 'Em Transito',
    'FE': 'Entregue',
    'RT': 'Retornado',
    'AG': 'Aguardando',
    'FN': 'Finalizado',
    'ES': 'Estorno',
    'PR': 'Pagamento não liberado'
  };

  constructor(
    private _router: Router,
    private _sharedService: SharedService,
    private _hyperToastsService: HyperToastsService
  ) { }

  ngOnInit() {

    this.cols = [
      { field: 'date_creation', header: 'Data' },
      { field: 'id', header: 'Código' },
      { field: 'value', header: 'Valor' },
      { field: 'status', header: 'Status' },
      { field: 'action', header: 'Ações' },
      { field: 'url_document', header: 'Documento' }
    ];

    const statusArray = Object.entries(this.statusPayment);
    this.status.push({ label: 'Todos', value: null });
    statusArray.forEach(element => {
      this.status.push({ label: element[1], value: element[1] });
    });

    this.orderList.forEach(element => {

      const obj = {
        'date_creation': element.date_creation,
        'id': element.id,
        'value': element.value,
        'status': this.statusPayment[element.status],
        'url_document': element.url_document
      };

      this.obj.push(obj);
    });

    this.orderList = this.obj;

  }

  viewDetails(item) {
    this._router.navigate(['/order-details/', item]);
  }

  openBillet(url) {
    window.open(url, '_blank');
  }
}
