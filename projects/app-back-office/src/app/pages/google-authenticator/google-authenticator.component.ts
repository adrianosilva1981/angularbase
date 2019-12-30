import { Component, OnInit } from '@angular/core';
import { SharedService } from '@app-back-office/services/shared.service';
import { HyperToastsService } from 'lib-services';
import { BroadcastEventService } from 'lib-services';

@Component({
  selector: 'app-back-office-google-authenticator',
  templateUrl: './google-authenticator.component.html',
  styleUrls: ['./google-authenticator.component.less']
})
export class GoogleAuthenticatorComponent implements OnInit {

  public qrCode = '';

  constructor(
    private _sharedService: SharedService,
    private _hyperToastsService: HyperToastsService,
  ) { }

  ngOnInit() {

    BroadcastEventService.event('changeLink').emit('googleAuthenticator');

    this._sharedService.getGoogleAuthenticator().subscribe(
      response => {
        if (response.return) {
          this.qrCode = response.data;
        }
      },
      err => {
        this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro inesperado. Atualize a página e tente novamente');
      }
    );
  }
}
