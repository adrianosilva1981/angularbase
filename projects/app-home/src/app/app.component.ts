import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { BroadcastEventService } from 'lib-services';

@Component({
  selector: 'app-home-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  constructor(
    private _router: Router
  ) {
    this._router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        setTimeout(() => {
          BroadcastEventService.event('onApplicationName').emit({
            name: 'app-home',
            group: 'default' //default | to-work | to-hire | consultant
          });
        }, 100);
      }
    });
  }
}
