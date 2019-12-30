import { Component, Inject } from '@angular/core';
import { BroadcastEventService, HyperCookieService } from 'lib-services';
import { NavigationEnd, Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-hyper-opportunity-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  title = 'app-hyper-opportunity';

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private _hyperCookieService: HyperCookieService,
    private _router: Router
  ) {

    BroadcastEventService.event('listenerLoginComponent').subscribe(userData => {
      // this._router.navigate(['']);
    });

    this._router.events.subscribe(event => {
      this.document.scrollingElement.scrollTop = 0;
      if (event instanceof NavigationEnd) {
        setTimeout(() => {
          BroadcastEventService.event('onApplicationName').emit({
            name: 'app-hyper-opportunity',
            group: 'to-work' //to-work | to-hire | consultant
          });
        }, 100);
      }
    });

    this._hyperCookieService.setCookie_GENERIC('toWork', 'hyper-jobs-type');
  }
}