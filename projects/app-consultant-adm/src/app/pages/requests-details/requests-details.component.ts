import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from '@app-consultant-adm/services/shared.service';
import { HyperToastsService } from 'lib-services';

@Component({
  selector: 'app-consultant-adm-requests-details',
  templateUrl: './requests-details.component.html',
  styleUrls: ['./requests-details.component.less']
})
export class RequestsDetailsComponent implements OnInit {

  public objOrder: any = [];
  public dataSource: any = [];
  public cols: any = [];

  public amountComission = 0;

  constructor(
    private _sharedService: SharedService,
    private _activatedRoute: ActivatedRoute,
    private _hyperToastsService: HyperToastsService,
  ) {
    this.cols = [
      { field: 'unit_name', header: 'Item' },
      { field: 'unit_quantity', header: 'Quantidade' },
      { field: 'unit_brl', header: 'Unitário' },
      { field: 'unit_amount_brl', header: 'SubTotal' },
      { field: 'comission_value', header: 'Comissão' }
    ];

  }

  ngOnInit() {
    this._activatedRoute.params.subscribe(params => {
      if (params['id_order'] && params['id_order'] !== '0') {
        this.detailsOrder(params['id_order']);
      }
    });
  }

  detailsOrder(order) {
    this._sharedService.getBuyerOrderDetails(order).subscribe(
      (response: any) => {
        if (response.return) {
          this.objOrder = response.data;

          this.objOrder.forEach(element => {
            element.order_brl = Number(element.order_brl);
            element.order_hcs = Number(element.order_hcs);
            element.order_shipping = Number(element.order_shipping);
            element.unit_amount_brl = Number(element.unit_amount_brl);
            element.unit_amount_hcs = Number(element.unit_amount_hcs);
            element.unit_brl = Number(element.unit_brl);
            element.unit_hcs = Number(element.unit_hcs);
            element.comission = Number(element.comission);
            element.comission_value = Number(element.comission_value);

            this.amountComission += Number(element.comission_value);
          });
          this.dataSource = this.objOrder;
        } else {

          this._hyperToastsService.addToast('warn', 'Atenção!', response.msg);
        }
      },
      err => { this._hyperToastsService.addToast('error', 'Erro!', err); }
    );
  }

}
