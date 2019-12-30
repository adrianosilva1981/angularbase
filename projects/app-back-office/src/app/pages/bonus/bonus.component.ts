import { Component, OnInit } from '@angular/core';
import { SharedService } from '@app-back-office/services/shared.service';
import { HyperToastsService } from 'lib-services';
import { BroadcastEventService } from 'lib-services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-back-office-bonus',
  templateUrl: './bonus.component.html',
  styleUrls: ['./bonus.component.less']
})
export class BonusComponent implements OnInit {

  public bonus: any = {};
  public table: any = {};
  public table_prevision: any = {};
  public flagView = false;
  public period: any;
  public periodYear: any;

  public month = [
    { label: 'Selecione', value: -1 },
    { label: 'Janeiro', value: 1 },
    { label: 'Fevereiro', value: 2 },
    { label: 'Março', value: 3 },
    { label: 'Abril', value: 4 },
    { label: 'Maio', value: 5 },
    { label: 'Junho', value: 6 },
    { label: 'Julho', value: 7 },
    { label: 'Agosto', value: 8 },
    { label: 'Setembro', value: 9 },
    { label: 'Outubro', value: 10 },
    { label: 'Novembro', value: 11 },
    { label: 'Dezembro', value: 12 }
  ];

  public year = [
    { label: 'Selecione', value: -1 },
    { label: '2018', value: 2018 },
    { label: '2019', value: 2019 },
    { label: '2020', value: 2020 }
  ];

  constructor(
    private _sharedService: SharedService,
    private _hyperToastsService: HyperToastsService,
    private _router: Router
  ) {
    BroadcastEventService.event('changeLink').emit('bonus');
    this.filter();
  }

  ngOnInit() {
  }

  rescue() {
    this._router.navigate(['office/rescue']);
  }

  filter() {
    //console.log(this.period);
    const date = new Date();
    if (!this.period) {
      this.period = date.getMonth() + 1;
    }
    if (!this.periodYear) {
      this.periodYear = date.getFullYear();
    }
    this._sharedService.getbonus(this.period, this.periodYear).subscribe(
      response => {
        if (response.return) {
          this.bonus = response.data;
          this.table = response.data.table;
          this.table_prevision = response.data.table_prevision;
          //console.log(this.bonus);
        } else {
          this._hyperToastsService.addToast('warn', 'Atenção', response.msg);
        }
      },
      err => {
        this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro inesperado. Atualize a página e tente novamente');
      }
    );
  }

  selectBonus(data) {
    this._router.navigate(['office/extract'], { queryParams: { 'slug': data.slug } });
  }

  view(flag) {
    this.flagView = !flag;
  }

  setFilter() {

  }
}
