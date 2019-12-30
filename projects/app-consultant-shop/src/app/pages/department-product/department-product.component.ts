import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SharedService } from '@app-consultant-shop/services/shared.service';
import { BroadcastEventService, HyperToastsService } from 'lib-services';

@Component({
  selector: 'app-consultant-shop-department-product',
  templateUrl: './department-product.component.html',
  styleUrls: ['./department-product.component.less']
})
export class DepartmentProductComponent implements OnInit, OnDestroy {

  private currentPage = 1;
  private currentSize = 15;
  public display: any;

  public hyperProducts: any = [];
  public queryParams: any = {};
  public count: Number = 0;

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

    this._sharedService.getHyperProducts(filt).subscribe(
      (response: any) => {
        if (response.return) {
          if (reset) {
            this.hyperProducts = [];
          }
          this.hyperProducts = this.hyperProducts.concat(response.data);
          this.count = response.count;
        } else {
          this._hyperToastsService.addToast('warn', 'Atenção', response.msg);
        }
      },
      err => { this._hyperToastsService.addToast('error', 'Erro', err); }
    );
  }

  loadMoreResults() {
    this.currentPage++;

    this.queryParams.page = this.currentPage;
    this.queryParams.size = this.currentSize;
    this.getProducts([], this.queryParams, false);
  }

  clearFilter() {
    this._router.navigate([]);
  }

  ngOnDestroy() {
    BroadcastEventService.event('onResetBreadCrumbOnRouterChange').emit(true);
  }

}
