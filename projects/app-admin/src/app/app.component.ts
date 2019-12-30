import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { BroadcastEventService } from 'lib-services';

@Component({
  selector: 'app-admin-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  constructor(
    private _router: Router
  ) {
    BroadcastEventService.event('listenerLoginComponent').subscribe(
      userData => {
        this._router.navigate(['/']);
      }
    );

    this._router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        setTimeout(() => {
          BroadcastEventService.event('onApplicationName').emit({
            name: 'app-admin',
            group: 'default' //default | to-work | to-hire | consultant
          });
        }, 100);
      }
    });
  }
}
