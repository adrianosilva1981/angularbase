import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ShippingModalComponent } from '@app-consultant-shop/components/shipping-modal/shipping-modal.component';
import { SharedService } from '@app-consultant-shop/services/shared.service';
import { HyperToastsService, HyperCookieService } from 'lib-services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-consultant-shop-list-shipping',
  templateUrl: './list-shipping.component.html',
  styleUrls: ['./list-shipping.component.less']
})
export class ListShippingComponent implements OnInit {

  public loading = true;
  public objShippings: any = [];
  public amountShipping = 0;

  @Input() zipcode = '';
  @Output() onShippingSelected: EventEmitter<any> = new EventEmitter();

  constructor(
    private _sharedService: SharedService,
    private _hyperToastsService: HyperToastsService,
    private _hyperCookieService: HyperCookieService,
    public _dialog: MatDialog,
    public _router: Router
  ) { }

  ngOnInit() {
    this.getListShipping();
  }

  getListShipping() {
    const obj = {
      zipcode: this.zipcode,
      items: this._hyperCookieService.getCookie_SHOPCART(this._sharedService.getSubdomainOwnerStore(false))
    };
    this._sharedService.getShippingPrice(obj).subscribe(
      (response: any) => {
        if (response.return === true) {
          this.mountObjShipping(response.data);
        } else {
          this._hyperToastsService.addToast('warn', 'Atenção', response.msg);
        }
        this.loading = false;
      },
      err => {
        this._hyperToastsService.addToast('error', 'Erro', err);
        this.loading = false;
      }
    );
  }

  mountObjShipping(list) {
    const address = { street: '', neighborhood: '', city: '', state: '' };
    list.forEach(sup => {
      let minorShipping: number = null;
      if (sup.shipping.length == 0) {
        this._hyperToastsService.addToast('warn', 'Atenção', 'Um ou mais itens do carrinho não pode ser enviado no momento, remova-o ou tente novamente mais tarde');
        this._router.navigate(['/shop-cart']);
      }
      sup.shipping.forEach((ship, index) => {
        if ((Number(ship.price) < minorShipping && Number(ship.price) != 0) || !minorShipping) {

          minorShipping = Number(ship.price);
          sup.shipping_selected = index;
        }
        if (ship.slug === 'RetirarNoLocal') {
          this._sharedService.getAddresByCEP(ship.cepRetirada).subscribe(
            (response: any) => {
              address.street = response.logradouro;
              address.neighborhood = response.bairro;
              address.city = response.localidade;
              address.state = response.uf;
            });
        }
      });
      sup.address = address;

    });

    this.objShippings = list;

    this.getAmountShipping();
  }

  getAmountShipping() {
    const objToEmit = {
      shippings: [],
      amount: 0
    };

    this.amountShipping = 0;
    this.objShippings.forEach(element => {
      this.amountShipping += Number(element.shipping[element.shipping_selected].price);

      const listIds = [];
      element.items.forEach(el => { listIds.push(el.id); });

      objToEmit.shippings.push(
        {
          hash: element.hash,
          slug: element.shipping[element.shipping_selected].slug
        }
      );
    });

    objToEmit.amount = this.amountShipping;

    this.onShippingSelected.emit(objToEmit);
  }

  openModalShipping(data) {
    const dialogRef = this._dialog.open(ShippingModalComponent, {
      data: data,
      panelClass: 'globalModalHJ'
    });

    dialogRef.afterClosed().subscribe(
      result => {
        if (result) {
          this.getAmountShipping();
        }
      }
    );
  }
}

