import { Component, Inject } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { DOCUMENT } from '@angular/platform-browser';
import { BroadcastEventService } from 'lib-services';

@Component({
  selector: 'app-account-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {

  constructor(
    private _router: Router,
    @Inject(DOCUMENT) private document: Document
  ) {

    this._router.events.subscribe(event => {
      this.document.scrollingElement.scrollTop = 0;
      if (event instanceof NavigationEnd) {
        setTimeout(() => {
          BroadcastEventService.event('onApplicationName').emit({
            name: 'app-account',
            group: 'default' //defaul | to-work | to-hire | consultant
          });
        }, 100);
      }
    });


    BroadcastEventService.event('listenerLoginComponent').subscribe(
      userData => {
        console.log(userData);
        this._router.navigate(['/']);
      }
    );
  }
}
