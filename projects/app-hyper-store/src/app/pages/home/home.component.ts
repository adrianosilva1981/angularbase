import { Component, OnInit } from '@angular/core';
import { SharedService } from '@app-hyper-store/services/shared.service';
import { HyperToastsService } from 'lib-services';

@Component({
  selector: 'app-hyper-store-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {
  public hyperServices: any[] = [];
  public hyperProducts: any[] = [];
  public adsProds: any[] = [];

  public spotlightProducts: any[] = [];

  public objUser: any;

  constructor(
    private _sharedService: SharedService,
    private _hyperToastsService: HyperToastsService,
  ) { }

  ngOnInit() {
    // this.getServices(1, 16);
    //this.listProductsAds();
    this.getProducts(1, 32);
    this.objUser = this._sharedService.getUserToken();
  }

  getServices(page, size) {
    const filter = {
      page: page,
      size: size,
      range: []
    };

    this._sharedService.getHyperServices(filter).subscribe(
      (response: any) => {
        if (response.return) {
          this.hyperServices = this.shuffle(response.data);
        } else {
          this._hyperToastsService.addToast('warn', 'Atenção', response.msg);
        }
      },
      err => { this._hyperToastsService.addToast('error', 'Error', err); }
    );
  }

  getProducts(page, size) {
    const filter = {
      page: page,
      size: size,
      range: [],
      order: 'rand'
    };

    this._sharedService.getHyperProducts(filter).subscribe(
      (response: any) => {
        if (response.return) {
          this.spotlightProducts = response.data.filter(x => x.spotlight === 'Y');
          this.hyperProducts = response.data.filter(x => x.spotlight === 'N');
        } else {
          this._hyperToastsService.addToast('warn', 'Atenção', response.msg);
        }
      },
      err => { this._hyperToastsService.addToast('error', 'Error', err); }
    );
  }

  shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  listProductsAds() {
    this._sharedService.listProductsAds(4).subscribe(
      response => {
        if (response.return) {
          this.adsProds = response.data;
        }
      },
      err => { this._hyperToastsService.addToast('error', 'Error', err); }
    );
  }
}
