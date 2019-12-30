import { Component, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { BroadcastEventService, HyperCookieService } from 'lib-services';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-hyper-store-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  constructor(
    private _router: Router,
    private _hyperCookieService: HyperCookieService,
    @Inject(DOCUMENT) private document: Document
  ) {

    BroadcastEventService.event('listenerLoginComponent').subscribe(userData => {
      // if (this._router.url.includes('/supplier/login')) {
      //   this._router.navigate(['/supplier/dash']);
      // }
      location.reload();
      // this._router.navigate(['']);
    });

    this._router.events.subscribe(event => {
      this.document.scrollingElement.scrollTop = 0;

      if (event instanceof NavigationEnd) {
        setTimeout(() => {
          BroadcastEventService.event('onApplicationName').emit({
            name: 'app-hyper-store',
            group: 'to-hire' //to-work | to-hire | consultant
          });
        }, 100);
      }
    });

    this._hyperCookieService.setCookie_GENERIC('toHire', 'hyper-jobs-type');
  }
}
