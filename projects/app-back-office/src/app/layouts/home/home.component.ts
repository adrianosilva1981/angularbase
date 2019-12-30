import { Component, OnInit } from '@angular/core';

import { HyperToastsService, BroadcastEventService } from 'lib-services';
import { SharedService } from '@app-back-office/services/shared.service';
import { environment } from '@env/app-back-office';

@Component({
  selector: 'app-back-office-home-layout',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeLayoutComponent implements OnInit {

  public visibleSidebar = false;

  constructor(
  ) { }

  ngOnInit() {
    BroadcastEventService.event('sidebarMenu').subscribe(
      response => {
        this.visibleSidebar = response;
      });
  }
}
