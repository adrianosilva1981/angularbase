import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from '@app-hyper-opportunity/services/shared.service';
import { HyperToastsService } from 'lib-services';
import { environment } from '@env/app-hyper-opportunity';

@Component({
  selector: 'app-hyper-opportunity-filter-opportunity',
  templateUrl: './filter-opportunity.component.html',
  styleUrls: ['./filter-opportunity.component.less']
})
export class FilterOpportunityComponent implements OnInit {

  @Output() onFilter: EventEmitter<any> = new EventEmitter();
  @Output() onBreadCrumb: EventEmitter<any> = new EventEmitter();

  public queryParams: any = {};
  public filters: any = [];
  public catOrSub = 'cat';
  readonly environment = environment;

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _sharedService: SharedService,
    private _alertsService: HyperToastsService,
    private _router: Router
  ) { }

  ngOnInit() {
    const _self = this;

    this._activatedRoute.queryParams.subscribe(
      params => {
        _self.queryParams = {
          order: params.order ? params.order : 'recentDesc',
          search: params.search ? params.search : null,
          cat: params.cat ? params.cat : null,
          sub: params.sub ? params.sub : null,
        };

        if (_self.queryParams.cat) {
          this.getSubCategories(_self.queryParams.cat);
        } else {
          _self.queryParams.cat = null;
          _self.queryParams.sub = null;
          this._router.navigate([], { queryParams: this.queryParams });
          _self.getCategories();
        }

      }
    );
  }

  getCategories() {
    this._sharedService.getProfessionalCategories().subscribe(
      (response: any) => {
        if (response.return === true) {
          this.filters = response.data;
          this.onFilter.emit(this.queryParams);
          this.onBreadCrumb.emit([{ text: 'Todas Oportunidades ', value: '' }]);
          this.catOrSub = 'cat';
        } else {
          this._alertsService.addToast('warn', '', response.msg);
        }
      },
      err => { this._alertsService.addToast('error', 'Erro', err); }
    );
  }

  getSubCategories(category) {
    const filtSub = this.queryParams.sub ? this.queryParams.sub.split(',') : [];
    this._sharedService.getProfessionalSubCategories(category).subscribe(
      (response: any) => {
        if (response.return === true) {
          this.filters = response.data;
          this.onBreadCrumb.emit([{ text: 'Todas Oportunidades ', value: '' }, { text: this.filters[0].category_name, value: this.filters[0].category_id }]);
          this.attSubCategory(filtSub);
          this.onFilter.emit(this.queryParams);
          this.catOrSub = 'sub';
        } else {
          this._alertsService.addToast('warn', '', response.msg);
        }
      },
      err => { this._alertsService.addToast('error', 'Erro', err); }
    );
  }

  onOrderChange(evt) {
    this.queryParams.order = evt;
    this._router.navigate([], { queryParams: this.queryParams });
  }

  onCategoryChange(category) {
    this.getSubCategories(category.id);
    this.queryParams.cat = category.id;

    this._router.navigate([], { queryParams: this.queryParams });
  }

  onSubCategoryChange(subcategory) {
    let sub = [];
    let pos = -1;
    const auxSub = String(subcategory.id);

    if (this.queryParams.sub) {
      sub = this.queryParams.sub.split(',');
      pos = sub.findIndex(x => x == auxSub);
    }

    if (pos !== -1) {
      sub.splice(pos, 1);
    } else {
      sub.push(auxSub);
    }

    this.attSubCategory(sub);

    this.queryParams.sub = sub.join(',');
    this._router.navigate([], { queryParams: this.queryParams });
  }

  clearFilter() {
    this._router.navigate([]);
  }

  attSubCategory(sub) {
    this.filters.forEach(element => {
      const refsub = sub.find(x => x == element.id);
      if (refsub) {
        element.active = true;
      } else {
        element.active = false;
      }
    });
  }
}
