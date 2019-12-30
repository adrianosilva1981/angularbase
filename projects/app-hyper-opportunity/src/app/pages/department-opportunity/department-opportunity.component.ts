import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from '@app-hyper-opportunity/services/shared.service';
import { HyperToastsService } from 'lib-services';

@Component({
  selector: 'app-hyper-opportunity-department-opportunity',
  templateUrl: './department-opportunity.component.html',
  styleUrls: ['./department-opportunity.component.less']
})
export class DepartmentOpportunityComponent implements OnInit {

  private currentPage = 1;
  private currentSize = 15;
  public display: any;

  public objOpportunity: any = [];
  public breadCrumb: any = [];
  public currentViewType = 'grid';
  public objFilter: any = {
    order: 'recentDesc',
    page: this.currentPage,
    size: this.currentSize,
    filter: {
      city: '',
      category: '',
      subcategory: '',
      ocupation: '',
      search: ''
    }
  };

  constructor(
    private _sharedService: SharedService,
    private _alertsService: HyperToastsService,
    private _router: Router
  ) {

  }

  ngOnInit() {
  }

  getOpportunities(range = [], filt = {}, reset = true) {
    if (reset) {
      this.currentPage = 1;
      this.currentSize = 15;
    }
    this._sharedService.getOpportunities(range, filt).subscribe(
      (response: any) => {
        if (response.return) {
          if (reset) {
            this.currentPage = 1;
            this.currentSize = 15;
            this.objOpportunity = [];
          }
          this.objOpportunity = this.objOpportunity.concat(response.data);
        } else {
          this._alertsService.addToast('warn', '', response.msg);
        }
      },
      err => { this._alertsService.addToast('error', 'Erro', err); }
    );
  }

  onFilter(evt) {
    this.objFilter = {
      order: evt.order,
      page: this.currentPage,
      size: this.currentSize,
      filter: {
        city: evt.city,
        category: evt.cat,
        subcategory: evt.sub,
        ocupation: evt.ocup,
        search: evt.search
      }
    };
    this.getOpportunities([], this.objFilter, true);
  }

  onBreadCrumb(evt) {
    this.breadCrumb = evt;
  }

  clearFilter() {
    this._router.navigate([]);
  }

  viewType(type) {
    this.currentViewType = type;
  }

  loadMoreResults() {
    this.currentPage++;

    this.objFilter.page = this.currentPage;
    this.objFilter.size = this.currentSize;
    this.getOpportunities([], this.objFilter, false);
  }

}
