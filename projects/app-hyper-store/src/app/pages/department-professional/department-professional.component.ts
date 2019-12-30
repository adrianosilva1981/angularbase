import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SharedService } from '@app-hyper-store/services/shared.service';
import { BroadcastEventService, HyperToastsService } from 'lib-services';

@Component({
  selector: 'app-hyper-store-department-professional',
  templateUrl: './department-professional.component.html',
  styleUrls: ['./department-professional.component.less']
})
export class DepartmentProfessionalComponent implements OnInit, OnDestroy {

  private currentPage = 1;
  private currentSize = 15;
  public display: any;

  public objProfessional: any = [];
  public queryParams: any = {};

  constructor(
    private _sharedService: SharedService,
    private _hyperToastsService: HyperToastsService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    const _self = this;
    BroadcastEventService.event('onResetBreadCrumbOnRouterChange').emit(false);

    this._activatedRoute.queryParams.subscribe(
      params => {
        _self.queryParams = {
          search: params.search ? params.search : null,
          order: params.order ? params.order : null,
          city: params.city ? params.city : null,
          ocup: params.ocup ? params.ocup : null
        };

        this.getProfessionals([], _self.queryParams, true);

      }
    );
  }

  getProfessionals(range: any = [], filt: any = {}, reset = true) {
    if (reset) {
      this.currentPage = 1;
      this.currentSize = 15;
    }

    filt.page = this.currentPage;
    filt.size = this.currentSize;
    filt.range = range;

    this._sharedService.getProfessional(filt).subscribe(
      (response: any) => {
        if (response.return) {
          if (reset) {
            this.objProfessional = [];
          }
          this.objProfessional = this.objProfessional.concat(response.data);
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
    this.getProfessionals([], this.queryParams, false);
  }

  clearFilter() {
    this._router.navigate([]);
  }

  ngOnDestroy() {
    BroadcastEventService.event('onResetBreadCrumbOnRouterChange').emit(true);
  }

}
