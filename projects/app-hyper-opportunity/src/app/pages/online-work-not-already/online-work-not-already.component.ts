import { Component, OnInit } from '@angular/core';
import { SharedService } from '@app-hyper-opportunity/services/shared.service';
import { HyperToastsService, HyperCookieService } from 'lib-services';

@Component({
  selector: 'app-hyper-opportunity-online-work-not-already',
  templateUrl: './online-work-not-already.component.html',
  styleUrls: ['./online-work-not-already.component.less']
})
export class OnlineWorkNotAlreadyComponent implements OnInit {

  public planSelected: any = {};

  constructor(
    private _sharedService: SharedService,
    private _alertsService: HyperToastsService,
    private _shopCookieService: HyperCookieService,
  ) { }

  ngOnInit() {
    this.getPlan();
    const bread = [
      { 'text': 'TRABALHAR Online', 'router': '/online-work' },
      { 'text': 'Para você que nunca trabalhou online', 'router': '' }
    ];
    this._sharedService.breadCrumb(bread);
  }

  onAnchorClick() {
    const element: any = document.querySelector('#contentPlan');
    if (element) { element.scrollIntoView(element); }
  }

  getPlan() {
    this._sharedService.getPlanHomeWorker().subscribe(
      (response: any) => {
        if (response.return === true) {
          this.planSelected = response.data;
        } else {
          this._alertsService.addToast('warn', 'Atenção', response.msg);
          this._shopCookieService.deleteCookie_AFFILIATED();
        }
      },
      err => {
        this._alertsService.addToast('error', 'Erro', err);
        this._shopCookieService.deleteCookie_AFFILIATED();
      }
    );
  }
}
