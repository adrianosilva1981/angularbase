import { Component, OnInit, HostListener } from '@angular/core';
import { BroadcastEventService, HyperToastsService, HyperCookieService } from 'lib-services';
import { Subscription, Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from '@app-hyper-store/services/shared.service';

@Component({
  selector: 'app-hyper-store-detail-guide',
  templateUrl: './detail-guide.component.html',
  styleUrls: ['./detail-guide.component.less']
})
export class DetailGuideComponent implements OnInit {

  public objGuide: any = {};
  public idGuide;
  public gifts;
  public userData: any;
  public listPhotos: any = [];
  public inWishList = false;
  public show = true;
  public animate = false;
  private subscription = new Subscription;
  public maskMoney = { prefix: 'R$ ', thousands: '.', decimal: ',' };
  public valueGift = 0;

  constructor(
    private _sharedService: SharedService,
    private _hyperToastsService: HyperToastsService,
    private _hyperCookieService: HyperCookieService,
    private _activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    const _self = this;

    _self.userData = _self._sharedService.getUserData();

    this._activatedRoute.params.subscribe(
      params => {
        if (params.id) {
          _self.getRangeProducts([params.id]);
        }
      }
    );

    BroadcastEventService.event('listenerLoginComponent').subscribe(evt => {
      if (evt.JWT) {
        this.userData = evt;
        this.checkIsFavorite();
      }
    });

    this._sharedService.addBreadCrumb(
      [
        { 'text': 'Todos os Guias', 'router': '/department/guide' },
        { 'text': 'Detalhes do Guia', 'router': '' }
      ]
    );
  }
  @HostListener('window:resize', ['$event'])
  onResize() {
    if (window.screen.width > 650) {
      this.show = true;
    } else {
      this.show = false;
    }
  }
  mountListPhotos(photos) {
    this.listPhotos = [];
    if (photos && Object(photos.length) > 0) {
      photos.forEach(element => {
        this.listPhotos.push(element.url);
      });
    }
  }

  getRangeProducts(ids) {
    if (ids.length > 0) {
      const filt = { range: ids };

      this._sharedService.listGiftCompany(filt).subscribe(
        (response: any) => {
          if (response.return) {
            this.gifts = response.data;
            this.objGuide = response.data[0];
            this.idGuide = this.objGuide.id;
            this.objGuide.photos = [];
            let aux = true;

            response.data.forEach(element => {
              element.mediasCompanies = JSON.parse(element.mediasCompanies);
              element.mediasCompanies = JSON.parse('[' + element.mediasCompanies.images + ']');
              element.mediasGift = JSON.parse(element.mediasGift);
              element.mediasGift = JSON.parse('[' + element.mediasGift.images + ']');
              element.cellphones = element.cellphones.split(';');
              element.cities = JSON.parse(element.cities);
              element.cities = element.cities[0].split(',');
              if (element.mediasCompanies[0] != null && aux) {
                this.objGuide.photos.push(...element.mediasCompanies);
                aux = false;
              }
              if (element.mediasGift[0] != null) {
                this.objGuide.photos.push(...element.mediasGift);
              }
            });

            this.mountListPhotos(this.objGuide.photos);
            this.checkIsFavorite();
          } else {
            this._hyperToastsService.addToast('error', 'Erro', response.msg);
          }
        },
        err => {
          this._hyperToastsService.addToast('error', 'Erro', err);
        }
      );
    }
  }

  checkIsFavorite() {
    const list = this._hyperCookieService.getCookie_FAVORITES();

    if (list) {
      const exists = list.find(x => x.itemID === this.idGuide && x.itemType === 'guide');
      this.inWishList = exists;
    }
  }

  addToCart(gift) {
    if ((gift.value > Number(gift.value_cash_sale_max) || gift.value < Number(gift.value)) && gift.value_cash_sale_max != null) {
      this._hyperToastsService.addToast('warn', 'Atenção', 'Valor incorreto do Voucher');
      return;
    }
    this.subscription.unsubscribe();

    const timer = Observable.timer(0, 1000);

    this.subscription = timer.subscribe(
      t => {
        if (t >= 0 && t < 2) {
          this.animate = true;
        }
        if (t >= 2) {
          this.animate = false;
          this.subscription.unsubscribe();
        }
      }
    );
    const shopCart = {
      quantity: 1,
      type: 'gift_code',
      id: gift.id,
      value: undefined
    };
    if (gift.type == 'V') {
      shopCart.value = gift.value;
    }

    this._sharedService.addItemOnShopCart(shopCart, gift.maximum_quantity_per_user);
  }

  addToFavorite() {
    this._sharedService.addItemOnWishList(this.objGuide, 'gift_code');
    this.inWishList = true;
  }

  calcPointsPercent(gift) {
    if (gift.type === 'V') {
      const value = gift.discount_resale != null ? gift.discount_resale : gift.discount_net;
      let points = gift.value * value / 100;
      points *= 0.55;
      points = Math.trunc(points);
      if (points > 0) {
        gift.points_value = points;
      } else {
        gift.points_value = 0;
      }
    }
  }
}
