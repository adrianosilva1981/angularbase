import { Component, OnInit, Input } from '@angular/core';
import { SharedService } from '@app-back-office/services/shared.service';
import { HyperToastsService } from 'lib-services';

@Component({
  selector: 'app-back-office-team-manager',
  templateUrl: './team-manager.component.html',
  styleUrls: ['./team-manager.component.less']
})
export class TeamManagerComponent implements OnInit {

  @Input() typeManager: string;
  public table: any = [];
  public totalDevido = 0;
  public totalReceber = 0;

  constructor(
    private _sharedService: SharedService,
    private _hyperToastsService: HyperToastsService
  ) { }

  ngOnInit() {
    // console.log(this.typeManager);
    this._sharedService.getOverdueParcel(this.typeManager).subscribe(
      response => {
        if (response.return) {
          //console.log(response.data);
          this.totalDevido = 0;
          this.totalReceber = 0;
          this.table = response.data;
          let idx = 0;
          this.table.forEach(element => {
            this.totalDevido += +element.vencida;
            this.totalReceber += +element.apagar;
            idx++;
          });
          //console.log(this.totalDevido);
        } else {
          this.table = [];
        }
      },
      err => {
        this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro inesperado. Atualize a página e tente novamente');
      }
    );
  }

}
