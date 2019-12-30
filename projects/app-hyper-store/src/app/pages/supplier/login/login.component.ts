import { Component, OnInit } from '@angular/core';
import { SharedService } from '@app-hyper-store/services/shared.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hyper-store-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginPackComponent implements OnInit {

  constructor(
    private _sharedService: SharedService,
    private _router: Router
  ) { }

  ngOnInit() {
    const user = this._sharedService.getUserData();
    if (Object(user).reseller_parent != null) {
      this._router.navigate(['/supplier/dash']);
    }
  }

}
