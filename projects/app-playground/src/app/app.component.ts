import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { BroadcastEventService } from 'lib-services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {

  public socketNode: any;

  constructor(
    private _router: Router
  ) {

    this._router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        setTimeout(() => {
          BroadcastEventService.event('onApplicationName').emit({
            name: 'app-playground',
            group: 'to-hire' //to-work | to-hire | consultant
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

  ngOnInit() { }
}
