import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';

@Component({
  selector: 'lib-components-select-input-search',
  templateUrl: './select-input-search.component.html',
  styleUrls: ['./select-input-search.component.less']
})
export class SelectInputSearchComponent implements OnInit {

  @Input() objOptions: any;
  public objSelected: any;

  public searchValue: '';
  public queryParams: any = {};

  constructor(
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.listemQueryParams();

    if (this.objOptions) {
      const ref = this.objOptions.config.find(x => x.value.id === this.objOptions.id_default);
      if (ref) {
        this.objSelected = ref.value;
      }
    }
  }

  search() {
    const newQuery = this.objClean({ ...this.queryParams, search: this.searchValue });

    if (this.objSelected.type === 'router') {
      this._router.navigate([this.objSelected.redirect], { queryParams: newQuery });
    } else {
      location.href = this.objSelected.redirect + '?search=' + this.searchValue;
    }
  }

  listemQueryParams() {
    const _self = this;
    this._activatedRoute.queryParams.subscribe(
      params => {
        _self.queryParams = params;
      }
    );
  }

  objClean(obj) {
    return _.pickBy(obj, v => v !== null && v !== undefined && v !== '');
  }
}
