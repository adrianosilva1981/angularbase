import { Component, OnInit, Input } from '@angular/core';
import { SharedService } from '../../services/shared.service';
import { HyperToastsService } from 'lib-services';

@Component({
  selector: 'app-hyper-store-order-info',
  templateUrl: './order-info.component.html',
  styleUrls: ['./order-info.component.less']
})
export class OrderInfoComponent implements OnInit {

  @Input() orderItem: any;
  public rastreamento: any[];
  public objAcompanhamento: any[];
  public finalizado = false;
  public giftCardSerial = 'Aguardando Pagamento';
  public types = {
    product: [
      {
        icon: 'fa-shopping-cart',
        text: 'Pedido',
        step: 1
      },
      {
        icon: 'fa-usd',
        text: 'Pago',
        step: 2
      },
      {
        icon: 'fa-cubes',
        text: 'Preparando',
        step: 3
      },
      {
        icon: 'fa-truck',
        text: 'Transporte',
        step: 4
      },
      {
        icon: 'fa-check',
        text: 'Entregue',
        step: 5
      }
    ],
    service: [
      {
        icon: 'fa-shopping-cart',
        text: 'Pedido',
        step: 1
      },
      {
        icon: 'fa-list-ul',
        text: 'Responder Questionário',
        step: 2
      },
      {
        icon: 'fa-cogs',
        text: 'Trabalhando',
        step: 3
      },
      {
        icon: 'fa-clock-o',
        text: 'Aguardando sua Aprovação',
        step: 4
      },
      {
        icon: 'fa-check',
        text: 'Finalizado',
        step: 5
      }
    ],
    plan: [
      {
        icon: 'fa-shopping-cart',
        text: 'Pedido',
        step: 1
      },
      {
        icon: 'fa-check',
        text: 'Ativado',
        step: 2
      }
    ]
  };

  constructor(
    private _sharedService: SharedService,
    private _hyperToastsService: HyperToastsService,
  ) {

  }

  ngOnInit() {
    if (this.orderItem.type_item === 'product') {

      this.objAcompanhamento = JSON.parse(this.orderItem.tracking);

      // Ordenar para retirar o último status
      const a = this.objAcompanhamento.sort((a, b) => a.acompanhamento - b.acompanhamento);
      if (this.objAcompanhamento[this.objAcompanhamento.length - 1].status == 'FN') {
        // this.objAcompanhamento.splice(this.objAcompanhamento.length - 1, 1);
        this.finalizado = true;
      } else {
        this.finalizado = this.objAcompanhamento[this.objAcompanhamento.length - 1].status == 'C';
      }
    } else if (this.orderItem.type_item === 'gift_code') {
      if (this.orderItem.pay === 'PC') {
        this._sharedService.getCodeGiftCard(this.orderItem.id_detail).subscribe(
          (element: any) => {
            if (element.return) {
              this.giftCardSerial = element.data;
            } else {
              this._hyperToastsService.addToast('warning', 'Atenção', element.msg);
            }
          },
          err => {
            this._hyperToastsService.addToast('error', 'Erro', err);
          }
        );
      }
    } else {
      this.objAcompanhamento = [];
    }
  }

  tracking(data) {
    window.open('https://www.linkcorreios.com.br/' + data, '_blank');
  }

  manager() {
    //window.location.href = 'https://dash.hyper.jobs/job-opportunities/manage';
  }
}
