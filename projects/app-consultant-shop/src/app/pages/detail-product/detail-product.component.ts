import { Component, OnInit, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HyperToastsService, HyperCookieService, BroadcastEventService } from 'lib-services';
import { SharedService } from '@app-consultant-shop/services/shared.service';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-consultant-shop-detail-product',
  templateUrl: './detail-product.component.html',
  styleUrls: ['./detail-product.component.less']
})
export class DetailProductComponent implements OnInit {

  public objProduct: any = {};
  public idProduct;
  public userData: any;
  public listPhotos: any = [];
  public inWishList = false;
  public show = true;
  public animate = false;
  private subscription = new Subscription;
  public selected = [];
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
        { 'text': 'Todos os Produto', 'router': this._sharedService.getSubdomainOwnerStore() + '/department/product' },
        { 'text': 'Detalhes do Produto', 'router': '' }
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
      this._sharedService.getHyperProducts(filt).subscribe(
        (response: any) => {
          if (response.return) {
            const aux = [];
            response.data.features.forEach(element => {
              if (aux.length == 0) {
                aux.push([element]);
                this.selected.push(element.type + ': Aleatório');
              } else {
                const indexAux = aux.findIndex((el, i) => {
                  const found = el.find(x => x.type == element.type);
                  if (found != undefined) {
                    return true;
                  }
                });
                if (indexAux != -1) {
                  aux[indexAux].push(element);
                } else {
                  this.selected.push(element.type + ': Aleatório');
                  aux.push([element]);
                }
              }
            });
            response.data.features = aux;
            this.objProduct = response.data;
            this.idProduct = this.objProduct.id;
            this.mountListPhotos(this.objProduct.photos);
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
      const exists = list.find(x => x.itemID === this.idProduct && x.itemType === 'product');
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
      type: 'product',
      id: String(this.idProduct),
      features: this.selected
    };

    this._sharedService.addItemOnShopCart(shopCart, this.objProduct.maximum_quantity_per_user);
  }

  addToFavorite() {
    this._sharedService.addItemOnWishList(this.objProduct, 'product');
    this.inWishList = true;
  }
}
