import { MatDialog } from '@angular/material';
import { InfoPackComponent } from '@app-back-office/components/modals/info-pack/info-pack.component';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { BroadcastEventService, HyperToastsService, } from 'lib-services';
import { SharedService } from '@app-back-office/services/shared.service';
import { environment } from '@env/app-back-office';


@Component({
  selector: 'app-back-office-publicity',
  templateUrl: './publicity.component.html',
  styleUrls: ['./publicity.component.less']
})
export class PublicityComponent implements OnInit {

  public urlStoreAds = environment.urlShop + 'ads/plans/';
  public pacotes = [];

  constructor(
    public _dialog: MatDialog,
    private _router: Router,
    private _sharedService: SharedService,
    private _hyperToastsService: HyperToastsService
  ) { }

  ngOnInit() {
    BroadcastEventService.event('changeLink').emit('product');

    this._sharedService.getAdsPlans().subscribe(response => {
      // console.log(response);
      if (response.return) {
        response.data.forEach(element => {
          this.pacotes.push({
            id: element.id,
            title: element.title,
            value: element.value,
            hubmix: element.print_cpm,
            email: element.email_mkt,
            social: element.share,
            Instagran: element.post_instagram,
            facebook: element.post_facebook,
            currency: 'BRL'
          });
        });
      } else {
      }
    },
      err => { this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro inesperado. Atualize a página e tente novamente'); }
    );
  }

  publisher() {
    this._router.navigate(['office/register-publisher']);
  }

}
