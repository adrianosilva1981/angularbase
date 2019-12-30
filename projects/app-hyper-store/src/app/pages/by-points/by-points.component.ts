import { Component, OnInit, OnDestroy } from '@angular/core';
import { HyperToastsService, BroadcastEventService } from 'lib-services';
import { Router, ActivatedRoute } from '@angular/router';
import { SharedService } from '@app-hyper-store/services/shared.service';

@Component({
  selector: 'app-hyper-store-by-points',
  templateUrl: './by-points.component.html',
  styleUrls: ['./by-points.component.less']
})
export class ByPointsComponent implements OnInit, OnDestroy {

  private currentPage = 1;
  private currentSize = 15;
  public display: any;

  public hyperServices: any = [];
  public hyperProducts: any = [];
  public queryParams: any = {};

  constructor(
    private _sharedService: SharedService,
    private _hyperToastsService: HyperToastsService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit() {

    const _self = this;
    BroadcastEventService.event('onResetBreadCrumbOnRouterChange').emit(false);

    this._activatedRoute.queryParams.subscribe(
      params => {
        _self.queryParams = {
          department: params.dep ? params.dep : null,
          categories: params.cat ? params.cat.split(',') : [],
          search: params.search ? params.search : null,
          order: params.order ? params.order : null
        };

        this.getProducts([], _self.queryParams, true);
        if (this._sharedService.lastProduct.id) {
          setTimeout(() => {
            const elmnt = document.getElementById(this._sharedService.lastProduct.id);
            if (elmnt) {
              elmnt.scrollIntoView();
            }
            this._sharedService.lastProduct = {};
          }, 1250);
        }
        this.getServices([], _self.queryParams, true);

      }
    );
  }

  getProducts(range: any = [], filt: any = {}, reset = true) {
    if (reset) {
      this.currentPage = 1;
      this.currentSize = 15;
    }
    filt.page = this.currentPage;
    filt.size = this.currentSize;
    filt.range = range;
    filt.points = true;
    if (this._sharedService.lastProduct.id) {
      this.currentPage = this._sharedService.lastProduct.page;
      this.currentSize = this._sharedService.lastProduct.size;
      filt.page = this._sharedService.lastProduct.page ? 1 : this.currentPage;
      filt.size = this._sharedService.lastProduct.size ? this._sharedService.lastProduct.size * this._sharedService.lastProduct.page : this.currentSize;
    }

    this._sharedService.getHyperProducts(filt).subscribe(
      (response: any) => {
        if (response.return) {
          if (reset) {
            this.hyperProducts = [];
          }
          this.hyperProducts = this.hyperProducts.concat(response.data);
        } else {
          this._hyperToastsService.addToast('warn', 'Atenção', response.msg);
        }
      },
      err => { this._hyperToastsService.addToast('error', 'Erro', err); }
    );
  }
  getServices(range: any = [], filt: any = {}, reset = true) {
    if (reset) {
      this.currentPage = 1;
      this.currentSize = 15;
    }

    filt.page = this.currentPage;
    filt.size = this.currentSize;
    filt.range = range;
    filt.points = true;

    this._sharedService.getHyperServices(filt).subscribe(
      (response: any) => {
        if (response.return) {
          if (reset) {
            this.hyperServices = [];
          }
          this.hyperServices = this.hyperServices.concat(response.data);
        } else {
          this._hyperToastsService.addToast('warn', 'Atenção', response.msg);
        }
      },
      err => { this._hyperToastsService.addToast('error', 'Erro', err); }
    );
  }
  loadMoreResults() {
    this.currentPage++;

    this.queryParams.page = this._sharedService.lastProduct.page = this.currentPage;
    this.queryParams.size = this._sharedService.lastProduct.size = this.currentSize;
    this.getProducts([], this.queryParams, false);
    this.getServices([], this.queryParams, false);

  }

  clearFilter() {
    this._router.navigate([]);
  }

  ngOnDestroy() {
    BroadcastEventService.event('onResetBreadCrumbOnRouterChange').emit(true);
  }

}
