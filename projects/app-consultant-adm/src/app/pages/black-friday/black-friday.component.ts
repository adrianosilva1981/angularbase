import { Component, OnInit } from '@angular/core';
import { SharedService } from '@app-consultant-adm/services/shared.service';
import { HyperToastsService, BroadcastEventService } from 'lib-services';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-consultant-adm-black-friday',
  templateUrl: './black-friday.component.html',
  styleUrls: ['./black-friday.component.less']
})
export class BlackFridayComponent implements OnInit {
  private login = new Subscription();
  constructor(
    private _sharedService: SharedService,
    private _toastHyper: HyperToastsService,
    private _router: Router
  ) {

  }

  ngOnInit() {
    this.login = BroadcastEventService.event('listenerLoginComponent').subscribe(
      response => {
        this.registerBlackFriday();
      }
    );
    const user = this._sharedService.getUserData();
    if (user != undefined) {
      this.registerBlackFriday();
    }
  }

  registerBlackFriday() {
    this._sharedService.blackFridayRegister().subscribe(
      response => {
        if (response.return) {
          this._toastHyper.addToast('success', 'Parabéns', 'Seu registro para participar da promoção Black Friday foi registrada com sucesso.');
        } else {
          this._toastHyper.addToast('warning', 'Atenção', 'Tivemos um problema em registar seu contato, tente novamente ou entre em contato conosco');
        }
        this._router.navigate(['/home']);
      }
    );
    this.login.unsubscribe();
  }

}
