import { MatDialog } from '@angular/material';
import { InfoPackComponent } from '@app-back-office/components/modals/info-pack/info-pack.component';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { BroadcastEventService, HyperToastsService, } from 'lib-services';
import { SharedService } from '@app-back-office/services/shared.service';
import { environment } from '@env/app-back-office';

@Component({
  selector: 'app-back-office-resale-products',
  templateUrl: './resale-products.component.html',
  styleUrls: ['./resale-products.component.less']
})
export class ResaleProductsComponent implements OnInit {

  public urlStoreAds = environment.urlShop + 'ads/plans/';
  public pacotes = [];

  public maskotto_capital = 0;
  public maskotto_lucro = 0;
  public maskotto_value_sale = 152.30;
  public maskotto_value_resale = 260.00;

  public maskotto_capital2 = 0;
  public maskotto_lucro2 = 0;
  public maskotto_value_sale2 = 357.32;
  public maskotto_value_resale2 = 600.00;

  public maskotto_capital3 = 0;
  public maskotto_lucro3 = 0;
  public maskotto_value_sale3 = 730;
  public maskotto_value_resale3 = 1200;

  public cria_capital = 0;
  public cria_lucro = 0;
  public cria_value_sale = 239.40;
  public cria_value_resale = 399.00;

  public k18_capital = 0;
  public k18_lucro = 0;
  public k18_value_sale = 731.50;
  public k18_value_resale = 1463.00;

  constructor(
    public _dialog: MatDialog,
    private _router: Router,
    private _sharedService: SharedService,
    private _hyperToastsService: HyperToastsService
  ) {

    BroadcastEventService.event('changeLink').emit('product');

    this.maskotto_lucro = Number(this.maskotto_value_resale) - Number(this.maskotto_value_sale);
    if (Number(this.maskotto_value_sale) > 0) {
      this.maskotto_capital = Math.ceil((this.maskotto_lucro * 100) / Number(this.maskotto_value_sale));
    }
    this.maskotto_lucro2 = Number(this.maskotto_value_resale2) - Number(this.maskotto_value_sale2);
    if (Number(this.maskotto_value_sale2) > 0) {
      this.maskotto_capital2 = Math.ceil((this.maskotto_lucro2 * 100) / Number(this.maskotto_value_sale2));
    }
    this.maskotto_lucro3 = Number(this.maskotto_value_resale3) - Number(this.maskotto_value_sale3);
    if (Number(this.maskotto_value_sale3) > 0) {
      this.maskotto_capital3 = Math.ceil((this.maskotto_lucro3 * 100) / Number(this.maskotto_value_sale3));
    }

    this.cria_lucro = Number(this.cria_value_resale) - Number(this.cria_value_sale);
    if (Number(this.cria_value_sale) > 0) {
      this.cria_capital = Math.ceil((this.cria_lucro * 100) / Number(this.cria_value_sale));
    }

    this.k18_lucro = Number(this.k18_value_resale) - Number(this.k18_value_sale);
    if (Number(this.k18_value_sale) > 0) {
      this.k18_capital = Math.ceil((this.k18_lucro * 100) / Number(this.k18_value_sale));
    }

  }

  ngOnInit() {
  }

  modalPack(imagem) {
    const dialogRef = this._dialog.open(InfoPackComponent, {
      data: { image: imagem },
    });
    dialogRef.afterClosed().subscribe(
      result => { });
  }

  paidPack(id) {
    this._router.navigate(['office/product-checkout'], { queryParams: { idevent: id } });
  }

  myPurchase() {
    this._router.navigate(['office/product-mypurchase']);
  }
}
