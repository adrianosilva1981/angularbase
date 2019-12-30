import { Component, OnInit } from '@angular/core';
import { SharedService } from '@app-back-office/services/shared.service';
import { HyperToastsService } from 'lib-services';

@Component({
  selector: 'app-back-office-findersfee',
  templateUrl: './findersfee.component.html',
  styleUrls: ['./findersfee.component.less']
})
export class FindersfeeComponent implements OnInit {

  public page = 1;
  public count = 100;
  public msg = '';
  public findersok = false;
  public finders: any = [];
  public value_received = 0;
  public total = 0;
  public ano = 0;
  public mes = 0;
  public disable = false;

  public month = [
    { label: 'Todos', value: -1 },
    { label: 'Selecione', value: 0 },
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
    { label: 'Todos', value: -1 },
    { label: 'Selecione', value: 0 },
    { label: '2018', value: 2018 },
    { label: '2019', value: 2019 },
    { label: '2020', value: 2020 }
  ];

  constructor(
    private _sharedService: SharedService,
    private _hyperToastsService: HyperToastsService,
  ) { }

  ngOnInit() {
    this.getFinders(this.ano, this.mes, this.page, this.count);

  }

  trocaAno(e) {
    if (e == -1) {
      this.mes = -1;
      this.disable = true;
    } else {
      this.mes = 0;
      this.disable = false;
    }
  }

  filter() {
    const date = new Date();
    if (!this.mes) {
      this.mes = date.getMonth() + 1;
    }
    if (!this.ano) {
      this.ano = date.getFullYear();
    }
    this.getFinders(this.ano, this.mes, this.page, this.count);
  }

  getFinders(ano, mes, page, count) {
    this._sharedService.getFindersFee(ano, mes, page, count).subscribe(
      response => {
        if (response.return) {
          this.findersok = true;
          this.finders = response.data.supplier;
          this.value_received = response.data.value_received;
          this.total = 0;
          //console.log(response.data);
          let idx = 0;
          this.finders.forEach(element => {
            this.total += +element.value;
            idx++;
          });
        } else {
          this.findersok = false;
          this.msg = response.msg;
        }
      },
      err => {
        this.findersok = false;
        this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro inesperado. Atualize a página e tente novamente');
      }
    );
  }
}
