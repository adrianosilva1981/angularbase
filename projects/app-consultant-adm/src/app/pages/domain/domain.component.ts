import { Component, OnInit } from '@angular/core';
import { HyperCookieService, HyperToastsService, BroadcastEventService } from 'lib-services';
import { SharedService } from '@app-consultant-adm/services/shared.service';

@Component({
  selector: 'app-consultant-adm-domain',
  templateUrl: './domain.component.html',
  styleUrls: ['./domain.component.less']
})
export class DomainComponent implements OnInit {

  public username: String;
  constructor(
    private _hyperCookieService: HyperCookieService,
    private _sharedService: SharedService,
    private _hyperToastsService: HyperToastsService
  ) {

    this._sharedService.getConsultants().subscribe(
      response => {
        if (response.return) {
          if (response.data.subDomain !== null && response.data.subDomain !== '') {
            this.username = response.data.subDomain;
          }
        } else {
          this._hyperToastsService.addToast('warn', 'Atenção', response.msg);
        }
      },
      err => { this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro inesperado. Atualize a página e tente novamente'); }
    );
  }

  ngOnInit() {
    this._sharedService.addBreadCrumb(
      [
        { 'text': 'Dashboard', 'router': '/home' },
        { 'text': 'Configurações', 'router': '/settings/domain' },
        { 'text': 'Domínio', 'router': '' }
      ]
    );
  }
  send() {


    const consultUser = {
      subDomain: this.username
    };
    const st = {
      status: 'A'
    };
    this._sharedService.putConsultants(consultUser).subscribe(
      response1 => {
        if (response1.return) {
          const xData: any = response1;
          this._sharedService.getConsultants().subscribe(
            response2 => {
              if (response2.return) {
                const cData: any = response2.data;

                this._sharedService.setOwnerStore(cData);

                if (cData.address_shop.zipCode !== null) {
                  this._sharedService.putConsultants(st).subscribe();
                  this._sharedService.putConsultantHJ('Y').subscribe();
                }
              } else {
                this._hyperToastsService.addToast('warn', 'Atenção', response2.msg);
              }
            },
            err => { this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro inesperado. Atualize a página e tente novamente'); }
          );
          this._hyperToastsService.addToast('success', 'Parabéns', xData.msg);
        } else {
          this._hyperToastsService.addToast('warn', 'Atenção', response1.msg);
        }
      },
      err => { this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro inesperado. Atualize a página e tente novamente'); }
    );
  }
}
