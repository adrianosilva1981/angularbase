import { Component, OnInit, Output, EventEmitter, Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';

import { HyperToastsService, BroadcastEventService } from 'lib-services';
import { SharedService } from '@app-hyper-store/services/shared.service';
@Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'app-hyper-store-filter-guide',
  templateUrl: './filter-guide.component.html',
  styleUrls: ['./filter-guide.component.less']
})
export class FilterGuideComponent implements OnInit {

  public search = '';
  @Output() result = new EventEmitter();

  constructor(
    private _router: Router,
    private _sharedService: SharedService,
    private _hyperToastsService: HyperToastsService
  ) { }

  ngOnInit() {
    this.getGift();
  }

  filter() {
    this.getGift();
  }

  getGift() {

    this._sharedService.listGiftSearch({ search: this.search }).subscribe(
      (res: any) => {
        if (res.return) {
          res.data.forEach(element => {
            element.mediasCompanies = JSON.parse(element.mediasCompanies);
            element.mediasCompanies = JSON.parse('[' + element.mediasCompanies.images + ']');
            // element.mediasGift = JSON.parse(element.mediasGift);
            // element.mediasGift = JSON.parse('[' + element.mediasGift.images + ']');
          });
        }
        res.data === '' ? this.result.emit([]) : this.result.emit([...res.data]);
        this._sharedService.filterGuide.search = [...res.data];
      }
    );

  }

}