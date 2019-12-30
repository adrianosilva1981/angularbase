import { Component, Inject } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { BroadcastEventService } from 'lib-services';
import { DOCUMENT } from '@angular/platform-browser';

@Component({
  selector: 'app-consultant-adm-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  title = 'app-consultant-adm';
  constructor(
    private _router: Router,
    @Inject(DOCUMENT) private document: Document,
  ) {

    BroadcastEventService.event('listenerLoginComponent').subscribe(userData => {
      this._router.navigate(['']);
    });



    this._router.events.subscribe(event => {
      this.document.scrollingElement.scrollTop = 0;

      if (event instanceof NavigationEnd) {

        BroadcastEventService.event('routerChange').emit(event);

        setTimeout(() => {
          BroadcastEventService.event('onApplicationName').emit({
            name: 'app-consultant-adm',
            group: 'consultant' //to-work | to-hire | consultant
          });
        }, 100);
      }
    });
  }
}
