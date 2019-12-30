import { NavbarComponent } from '@app-admin-back-office/components/navbar/navbar.component';
import { Component, OnInit } from '@angular/core';
import { HyperCookieService, BroadcastEventService } from 'lib-services';
import { SharedService } from '@app-admin-back-office/services/shared.service';
import { environment } from '@env/app-admin-back-office';

@Component({
  selector: 'app-admin-back-office-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.less']
})
export class DefaultComponent implements OnInit {

  public objCurrentApplication: any;
  public objUserLogged: any;
  constructor(
    private _sharedService: SharedService,
    private _hyperCookieService: HyperCookieService,
    private _navbarComponent: NavbarComponent
  ) { }

  ngOnInit() {
    this.listenerLogin();
    this.listenerAppicationName();
  }

  listenerLogin() {
    this.objUserLogged = this._hyperCookieService.getCookie_GENERIC(environment.nameCookie);
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

  logOut() {
    this._sharedService.logout();
  }

}
