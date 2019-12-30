import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';

@Component({
  selector: 'app-hyper-store-filter-professional',
  templateUrl: './filter-professional.component.html',
  styleUrls: ['./filter-professional.component.less']
})
export class FilterProfessionalComponent implements OnInit {

  public queryParams: any = {};
  public srcCity;
  public srcOcupation;

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _router: Router
  ) { }

  ngOnInit() {
    const _self = this;

    this._activatedRoute.queryParams.subscribe(
      params => {
        _self.queryParams = {
          order: params.order ? params.order : null,
          search: params.search ? params.search : null,
          city: params.city ? params.city : null,
          ocup: params.ocup ? params.ocup : '',
        };

        this.srcCity = _self.queryParams.city;
        this.srcOcupation = _self.queryParams.ocup;
      }
    );
  }

  onOrderChange(evt) {
    this.queryParams.order = evt;
    this._router.navigate([], { queryParams: this.objClean(this.queryParams) });
  }

  clearFilter() {
    this._router.navigate([]);
  }

  searchCity() {
    this.queryParams.city = this.srcCity;
    this._router.navigate([], { queryParams: this.objClean(this.queryParams) });
  }

  searchOcupation() {
    this.queryParams.ocup = this.srcOcupation;
    this._router.navigate([], { queryParams: this.objClean(this.queryParams) });
  }

  objClean(obj) {
    return _.pickBy(obj, v => v !== null && v !== undefined && v !== '');
  }
}
