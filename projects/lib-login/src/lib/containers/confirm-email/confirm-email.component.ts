import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { LoginService } from '../../services/login.service';

@Component({
  selector: 'lib-login-confirm-email',
  templateUrl: './confirm-email.component.html',
  styleUrls: ['./confirm-email.component.less']
})
export class ConfirmEmailComponent implements OnInit {

  public status = 'loading';

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _loginService: LoginService
  ) { }

  ngOnInit() {
    this._activatedRoute.params.subscribe((params: any) => {
      if (params['user'] && params['hash']) {
        const obj = {
          user: params['user'],
          hash: params['hash']
        };

        this._loginService.receiverMailConfirmation(obj).subscribe(
          (response: any) => {
            this.status = response.return === true ? 'success' : 'error';
          },
          err => {
            this.status = 'error';
          }
        );
      }
    });
  }

}
