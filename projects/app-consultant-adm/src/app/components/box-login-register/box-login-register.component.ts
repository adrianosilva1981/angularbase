import { Component, OnInit, AfterViewChecked, ChangeDetectorRef } from '@angular/core';

import { BroadcastEventService } from 'lib-services';
import { SharedService } from '@app-consultant-adm/services/shared.service';


@Component({
  selector: 'app-consultant-adm-box-login-register',
  templateUrl: './box-login-register.component.html',
  styleUrls: ['./box-login-register.component.less']
})
export class BoxLoginRegisterComponent implements OnInit, AfterViewChecked {

  public userData: any;

  constructor(
    private changeDetector: ChangeDetectorRef,
    private _sharedService: SharedService
  ) {


    this.userData = this._sharedService.getUserData();
    if (this.userData == undefined) {
      this.openLogin();
    }
  }

  ngOnInit() {

  }
  ngAfterViewChecked() {
    this.changeDetector.detectChanges();
  }
  openLogin() {
    BroadcastEventService.event('openLoginModal').emit(true);
  }


}
