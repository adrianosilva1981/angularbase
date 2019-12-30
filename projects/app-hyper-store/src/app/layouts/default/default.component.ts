import { Component, OnInit, ChangeDetectorRef, PLATFORM_ID, Inject, AfterViewChecked } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BroadcastEventService } from 'lib-services';
declare var require: any;
const jsonSearch = require('global/data/search-store.json');

@Component({
  selector: 'app-hyper-store-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.less']
})
export class DefaultComponent implements OnInit, AfterViewChecked {

  public clientHeight: number;
  public sideNavAction = 'close';
  public objOptonsSearch: any;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private cdRef: ChangeDetectorRef
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.clientHeight = window.innerHeight;
    }

    BroadcastEventService.event('changeNavFixed').subscribe(
      action => {
        this.sideNavAction = action;
      }
    );
  }

  ngOnInit() {
    this.objOptonsSearch = jsonSearch;

  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

}
