import { Component, OnInit } from '@angular/core';
import { HyperToastsService } from 'lib-services';
import { SharedService } from '@app-back-office/services/shared.service';

@Component({
  selector: 'app-back-office-team-inactive',
  templateUrl: './team-inactive.component.html',
  styleUrls: ['./team-inactive.component.less']
})
export class TeamInactiveComponent implements OnInit {

  public inactive: any = [];

  constructor(
    private _sharedService: SharedService,
    private _hyperToastsService: HyperToastsService,
  ) { }

  ngOnInit() {
    this.getListInactive();
  }

  getListInactive() {
    this._sharedService.getListInactive().subscribe(
      response => {
        if (response.return) {
          this.inactive = response.data;
        } else {
          this._hyperToastsService.addToast('warn', 'Atenção', response.msg);
        }
      },
      err => {
        this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro inesperado. Atualize a página e tente novamente');
      }
    );
  }

}
