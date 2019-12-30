import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';

import { HyperToastsService } from 'lib-services';
import { SharedService } from '@app-hyper-store/services/shared.service';

@Component({
  selector: 'app-hyper-store-filter-service',
  templateUrl: './filter-service.component.html',
  styleUrls: ['./filter-service.component.less']
})
export class FilterServiceComponent implements OnInit {

  public queryParams: any = {};
  public filters: any = [];
  public catSelected = [];

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _sharedService: SharedService,
    private _hyperToastsService: HyperToastsService
  ) { }

  ngOnInit() {
    const _self = this;

    this.attBreadCrumb();

    this._activatedRoute.queryParams.subscribe(
      params => {
        _self.queryParams = {
          order: params.order ? params.order : null,
          search: params.search ? params.search : null,
          dep: params.dep ? params.dep : null,
          cat: params.cat ? params.cat : null,
        };
        if (params) {
          this.attFilter();
          _self.getFilter(_self.queryParams.dep);
        }
      }
    );
  }

  getFilter(dep) {
    this._sharedService.getFilterServices({ department: dep }).subscribe(
      (response: any) => {
        if (response.return === true) {
          this.filters = dep ? response.data.categories : response.data;
          this.attCategory();
          this.attBreadCrumb(response.data.department);
        } else {
          this._hyperToastsService.addToast('warn', 'Atenção', response.msg);
        }
      },
      err => { this._hyperToastsService.addToast('error', 'Erro', err); }
    );
  }

  attCategory() {
    this.catSelected.forEach(element => {
      const ref = this.filters.find(x => x.id == element);
      if (ref) {
        ref.selected = true;
      }
    });
  }

  attFilter(evt = null) {
    this.catSelected = this.queryParams.cat ? this.queryParams.cat.split(',') : [];

    if (evt) {
      if (!this.queryParams.dep) {
        this.queryParams.dep = evt.id;
        this._router.navigate([], { queryParams: (this.queryParams) });
      } else {
        const pos = this.catSelected.findIndex(x => x == evt.id);

        if (pos !== -1) {
          this.catSelected.splice(pos, 1);
        } else {
          this.catSelected.push(evt.id);
        }

        this.queryParams.cat = this.catSelected.join(',');
        this._router.navigate([], { queryParams: this.objClean(this.queryParams) });
      }
    }
  }

  attBreadCrumb(department = null) {
    let aux = [];

    if (!department) {
      aux = [{ 'text': 'Todos os Serviços', 'router': '' }];
    } else {
      aux = [
        { 'text': 'Departamentos', 'router': '/department/service' },
        { 'text': department.value, 'router': '' }
      ];
    }

    this._sharedService.addBreadCrumb(aux);
  }

  onOrderChange(evt) {
    this.queryParams.order = evt;
    this._router.navigate([], { queryParams: this.objClean(this.queryParams) });
  }

  clearFilter() {
    this._router.navigate([]);
  }

  objClean(obj) {
    return _.pickBy(obj, v => v !== null && v !== undefined && v !== '');
  }
}