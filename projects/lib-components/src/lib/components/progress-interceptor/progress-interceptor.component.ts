import { Component, OnInit } from '@angular/core';
import { BroadcastEventService } from 'lib-services';

@Component({
  selector: 'lib-components-progress-interceptor',
  templateUrl: './progress-interceptor.component.html',
  styleUrls: ['./progress-interceptor.component.less']
})
export class ProgressInterceptorComponent implements OnInit {

  public showSpinner = false;

  constructor() { }

  ngOnInit() {
    const _self = this;
    BroadcastEventService.event('eventSpinner').subscribe(
      action => {
        setTimeout(() => {
          _self.showSpinner = action;
        });
      }
    );
  }

}
