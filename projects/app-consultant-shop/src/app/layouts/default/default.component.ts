import { Component, OnInit, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { HyperToastsService, BroadcastEventService } from 'lib-services';
import { SharedService } from '@app-consultant-shop/services/shared.service';

@Component({
  selector: 'app-consultant-shop-defaut',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.less']
})
export class DefaultComponent implements OnInit, AfterViewChecked {

  public clientHeight: number;
  public objUserConsultant: any;
  public sideNavAction = 'close';

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _sharedService: SharedService,
    private _hyperToastsService: HyperToastsService,
    private _router: Router,
    private cdRef: ChangeDetectorRef
  ) {
    this.clientHeight = window.innerHeight;
  }

  ngOnInit() {
    this.listenerRouter();
    this.listenerNavFixed();
  }

  listenerRouter() {
    const _self = this;
    this._activatedRoute.params.subscribe(params => {
      if (params.consultant) {
        _self.getConsultantData(params.consultant);
      } else {
        this._router.navigate(['not-found']);
      }
    });
  }

  listenerNavFixed() {
    BroadcastEventService.event('onNavFixed').subscribe(
      action => {
        this.sideNavAction = action;
      }
    );
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  getConsultantData(subdomain) {
    this._sharedService.getConsultantData(subdomain).subscribe(
      (response: any) => {
        if (response.data.subDomain) {
          if (response.data.status === 'A') {
            this.objUserConsultant = response.data;
            this._sharedService.setOwnerStore(response.data);
          } else {
            this._router.navigate(['']);
            this._hyperToastsService.addToast('warn', 'Atenção', 'Não foi possível acessar a loja deste associado. Entre em contato com a YouHub');
          }

        } else {
          this._router.navigate(['']);
          this._hyperToastsService.addToast('warn', 'Atenção', 'Loja inexistente. Verifique os dados e tente novamente');
        }
      },
      err => { this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro inesperado. Atualize a página e tente novamente'); }
    );
  }

}
