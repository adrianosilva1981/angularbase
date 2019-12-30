import { Component, OnInit } from '@angular/core';
import { HyperCookieService, BroadcastEventService } from 'lib-services';
import { environment } from '@env/app-admin';

@Component({
  selector: 'app-admin-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.less']
})
export class NavbarComponent implements OnInit {
  public objUserLogged: any;
  public showSideMenu = false;
  public domain = environment.domain;

  constructor(
    private _hyperCookieService: HyperCookieService
  ) { }

  ngOnInit() {
    this.listenerLogin();
  }

  listenerLogin() {
    this.objUserLogged = this._hyperCookieService.getCookie_AUTH();
    BroadcastEventService.event('listenerLoginComponent').subscribe(
      userData => {
        this.objUserLogged = userData;
      }
    );
  }

  teste() {
    alert('fabio');
  }

  signIn() {
    BroadcastEventService.event('openLoginModal').emit(true);
  }

  signOut() {
    BroadcastEventService.event('logout').emit(true);
  }

}
