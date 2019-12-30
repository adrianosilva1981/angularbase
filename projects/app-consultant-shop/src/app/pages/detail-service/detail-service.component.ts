import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BroadcastEventService, HyperCookieService, HyperToastsService } from 'lib-services';
import { SharedService } from '@app-consultant-shop/services/shared.service';
import { Subscription, Observable } from 'rxjs';

@Component({
  selector: 'app-consultant-shop-detail-service',
  templateUrl: './detail-service.component.html',
  styleUrls: ['./detail-service.component.less']
})
export class DetailServiceComponent implements OnInit {

  public objService: any = {};
  public idService;
  public userData: any;
  public listPhotos: any = [];
  public inWishList = false;
  public show = true;
  public animate = false;
  private subscription = new Subscription;
  public userLogged: String;
  constructor(
    private _sharedService: SharedService,
    private _hyperToastsService: HyperToastsService,
    private _hyperCookieService: HyperCookieService,
    private _activatedRoute: ActivatedRoute
  ) {
    const logged = this._sharedService.getUserData();
    if (logged) {
      if (logged.id_youhub != null) {
        this.userLogged = 'smart';
      } else if (logged.prime == 'Y') {
        this.userLogged = 'prime';
      }
    }
  }

  ngOnInit() {
    const _self = this;

    _self.userData = _self._sharedService.getUserData();

    this._activatedRoute.params.subscribe(
      params => {
        if (params.id) {
          _self.getRangeServices([params.id]);
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
        { 'text': 'Todos os Serviços', 'router': this._sharedService.getSubdomainOwnerStore() + '/department/service' },
        { 'text': 'Detalhes do Serviço', 'router': '' }
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

  getRangeServices(ids) {
    if (ids.length > 0) {
      const filt = { range: ids };
      this._sharedService.getHyperServices(filt).subscribe(
        (response: any) => {
          if (response.return) {
            this.objService = response.data;
            this.idService = this.objService.id;
            this.mountListPhotos(this.objService.photos);
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
    const list = this._hyperCookieService.getCookie_FAVORITES(this._sharedService.getSubdomainOwnerStore(false));

    if (list) {
      const exists = list.find(x => x.itemID === this.idService && x.itemType === 'service');
      this.inWishList = exists;
    }
  }

  addToCart() {
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
      type: 'service',
      id: String(this.idService)
    };

    this._sharedService.addItemOnShopCart(shopCart, this.objService.maximum_quantity_per_user);
  }

  addToFavorite() {
    this._sharedService.addItemOnWishList(this.objService, 'service');
    this.inWishList = true;
  }
}
