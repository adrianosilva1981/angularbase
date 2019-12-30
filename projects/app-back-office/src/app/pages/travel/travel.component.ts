import { Component, OnInit } from '@angular/core';
import { HyperToastsService } from 'lib-services';
import { SharedService } from '@app-back-office/services/shared.service';

@Component({
  selector: 'app-back-office-travel',
  templateUrl: './travel.component.html',
  styleUrls: ['./travel.component.less']
})
export class TravelComponent implements OnInit {

  public travel: any = [];
  public porc = 0;

  constructor(
    private _sharedService: SharedService,
    private _hyperToastsService: HyperToastsService,
  ) { }

  ngOnInit() {

    this._sharedService.getTravelPoint().subscribe(response => {
      if (response.return) {
        this.travel = response.data;
        // console.log(response.data);

        let idx = 0;
        this.travel.forEach(element => {
          this.porc = 0;
          this.porc = element.value > 0 ? (element.value * 100) / element.meta : 0;
          this.porc = this.porc > 100 ? 100 : Math.round(this.porc);
          this.travel[idx].value = element.value.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0, currency: 'BRL' });
          this.travel[idx].meta = element.meta.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0, currency: 'BRL' });
          this.travel[idx].porc = this.porc;
          idx++;
        });

        // console.log(this.travel);
      }
    },
      err => {
        this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro inesperado. Atualize a página e tente novamente');
      }
    );

  }

}
