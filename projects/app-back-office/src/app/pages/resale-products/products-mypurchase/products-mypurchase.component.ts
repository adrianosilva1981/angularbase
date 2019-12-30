import { Component, OnInit } from '@angular/core';
import { BroadcastEventService, HyperToastsService, } from 'lib-services';
import { SharedService } from '@app-back-office/services/shared.service';

@Component({
  selector: 'app-back-office-products-mypurchase',
  templateUrl: './products-mypurchase.component.html',
  styleUrls: ['./products-mypurchase.component.less']
})
export class ProductsMypurchaseComponent implements OnInit {

  public viewpurchase = false;
  public purchase: any;
  public rowsperpage: any = [15, 30, 60, 120];
  public msg = '';

  constructor(
    private _sharedService: SharedService,
    private _hyperToastsService: HyperToastsService

  ) {

    BroadcastEventService.event('changeLink').emit('product');
  }

  ngOnInit() {

    this._sharedService.getPurchase().subscribe(response => {
      // console.log(response);
      if (response.return) {
        this.viewpurchase = true;
        this.purchase = response.data;
        let idx = 0;
        this.purchase.forEach(element => {
          this.purchase[idx].creation_date = new Date(element.creation_date.replace(' ', 'T')).toLocaleDateString();
          this.purchase[idx].payment_date = new Date(element.payment_date.replace(' ', 'T')).toLocaleDateString();
          idx++;
        });
      } else {
        this.msg = response.msg;
      }
    },
      err => {
        this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro inesperado. Atualize a página e tente novamente');
      }
    );

  }

}
