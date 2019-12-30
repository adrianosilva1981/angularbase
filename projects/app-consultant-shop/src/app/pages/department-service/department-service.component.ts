import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BroadcastEventService, HyperToastsService } from 'lib-services';
import { SharedService } from '@app-consultant-shop/services/shared.service';

@Component({
  selector: 'app-consultant-shop-department-service',
  templateUrl: './department-service.component.html',
  styleUrls: ['./department-service.component.less']
})
export class DepartmentServiceComponent implements OnInit, OnDestroy {

  private currentPage = 1;
  private currentSize = 15;
  public display: any;

  public hyperServices: any = [];
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
          order: params.order ? params.order : null,
          type: 'Job'
        };

        this.getServices([], _self.queryParams, true);

      }
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

    this._sharedService.getHyperServices(filt).subscribe(
      (response: any) => {
        if (response.return) {
          if (reset) {
            this.hyperServices = [];
          }
          this.hyperServices = this.hyperServices.concat(response.data);
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
    this.getServices([], this.queryParams, false);
  }

  clearFilter() {
    this._router.navigate([]);
  }

  ngOnDestroy() {
    BroadcastEventService.event('onResetBreadCrumbOnRouterChange').emit(true);
  }
}
