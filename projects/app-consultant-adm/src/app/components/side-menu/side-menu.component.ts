import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { HyperCookieService } from 'lib-services';

@Component({
  selector: 'app-consultant-adm-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.less']
})
export class SideMenuComponent implements OnInit {
  @Input() objMenu: any;
  constructor(
    private _router: Router,
    private _HyperCookieService: HyperCookieService
  ) { }

  ngOnInit() {
  }
  redirect(redirect) {
    if (redirect.logout) {
      this._HyperCookieService.deleteAllCookies();
    }
    if (redirect.link.indexOf('http') === -1) {
      this._router.navigate([redirect.link]);
    } else {
      window.open(redirect.link, '_blank');
    }
  }
}
