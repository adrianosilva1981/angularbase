import { Component, OnInit } from '@angular/core';

import { HyperCookieService, BroadcastEventService } from 'lib-services';

@Component({
  selector: 'lib-navbar-nav-top',
  templateUrl: './nav-top.component.html',
  styleUrls: ['./nav-top.component.less']
})
export class NavTopComponent implements OnInit {

  public objUserLogged: any;
  public objCurrentApplication: any;

  constructor(
    private _hyperCookieService: HyperCookieService
  ) { }

  ngOnInit() {
    this.listenerLogin();
    this.listenerAppicationName();
  }

  redirectTo(router) {
    let navigate = '';

    switch (router) {
      case 'to-hire':
        navigate = 'https://store.youhub.com.br/';
        break;
      case 'to-work':
        navigate = 'https://opportunity.youhub.com.br';
        break;
      case 'consultant':
        navigate = 'https://consultant.youhub.com.br/';
        break;
    }

    window.location.href = navigate;
  }

  listenerLogin() {
    this.objUserLogged = this._hyperCookieService.getCookie_AUTH();
    BroadcastEventService.event('listenerLoginComponent').subscribe(
      userData => {
        this.objUserLogged = userData;
      }
    );
  }

  listenerAppicationName() {
    BroadcastEventService.event('onApplicationName').subscribe(
      objApp => {
        this.objCurrentApplication = objApp;
      }
    );
  }

  signIn() {
    BroadcastEventService.event('openLoginModal').emit(true);
  }

  signOut() {
    BroadcastEventService.event('logout').emit(true);
  }

}
