import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { BroadcastEventService, HyperCookieService } from 'lib-services';

@Component({
  selector: 'app-back-office-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {


  constructor(
    private _router: Router,
    private _hyperCookieService: HyperCookieService
  ) { }

  ngOnInit() {

    this._hyperCookieService.deleteCookie_GENERIC('CK_RESELLER');
    this._hyperCookieService.deleteCookie_GENERIC('JWT');
    this._hyperCookieService.deleteCookie_GENERIC('CK_BUSINESS');

    BroadcastEventService.event('listenerLoginComponent').subscribe(
      userData => {
        this._router.navigate(['/']);
      }
    );

    this._router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
      setTimeout(() => {
          BroadcastEventService.event('onApplicationName').emit({
          name: 'app-back-office',
          group: 'default' //default | to-work | to-hire | consultant
          });
      }, 100);
      }
  });
  }
}
