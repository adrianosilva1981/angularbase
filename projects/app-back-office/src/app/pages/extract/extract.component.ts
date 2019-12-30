import { Component, ChangeDetectorRef, AfterViewChecked, OnInit } from '@angular/core';
import { HyperToastsService } from 'lib-services';
import { SharedService } from '@app-back-office/services/shared.service';
import { BroadcastEventService } from 'lib-services';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-back-office-extract-container',
  templateUrl: './extract.component.html',
  styleUrls: ['./extract.component.less']
})
export class ExtractContaienrComponent implements OnInit, AfterViewChecked {

  public status: any = { C: 'Crédito', D: 'Debito' };


  public lines: any = {};
  public table: any = {};
  public aux: any = {};
  public extractData: any = {};

  public total_points = 0;
  public release_points = 0;
  public viewextract = false;
  public viewextractok = false;

  public myline = true;
  public mytable = false;

  public page = 1;
  public rowsperpage = 10;

  public search = '';
  public type_balance = 'all';
  public days_period = 0;
  public type_bonus = 'all';

  private today = new Date();

  public filter = {
    movimentation: '',
    period: 0,
    bonus: '',
    search: ''
  };
  public movimentation = [
    { label: 'Todas as movimentações', value: 'all' },
    { label: 'Entradas', value: 'C' },
    { label: 'Saídas', value: 'D' }
  ];
  public period = [
    { label: 'Todos', value: 0 },
    { label: '5 dias', value: 5 },
    { label: '10 dias', value: 10 },
    { label: '15 dias', value: 15 },
    { label: '30 dias', value: 30 },
    { label: '45 dias', value: 45 },
    { label: '60 dias', value: 60 }
  ];
  public bonus = [
    { label: 'Todos', value: 'all' },
    { label: 'Conexão Direta', value: 'direct' },
    { label: 'Equipe', value: 'team' },
    { label: 'Match', value: 'match' },
    { label: 'Gerente', value: 'manager' },
    { label: 'Diretor', value: 'director' },
    { label: 'Platinum Sapphire ', value: 'sapphire_platinum' },
    { label: 'Fast Start', value: 'fast_start' },
    // { label: 'Platinum', value: 'Platinum' },
    // { label: 'Double', value: 'Double' },
    // { label: 'Double', value: 'Match' },
  ];

  constructor(
    private _sharedService: SharedService,
    private _hyperToastsService: HyperToastsService,
    private changeDetector: ChangeDetectorRef,
    private _router: Router,
    private _route: ActivatedRoute,
  ) {

    BroadcastEventService.event('changeLink').emit('extract');

    this.viewextract = true;

    this._route.parent.queryParams.subscribe(queryparams => { // pega id do plano
      this.type_bonus = queryparams['slug'];
    });

    if (!this.type_bonus) {
      this.type_bonus = 'all';
    }

    this.getextract(this.page, this.rowsperpage, 'all', 0, this.type_bonus);

  }

  ngOnInit() { }

  rescue() {
    this._router.navigate(['office/rescue']);
  }

  card(type) {
    if (type === 'line') {
      this.myline = true;
      this.mytable = false;
    } else {
      this.myline = false;
      this.mytable = true;
    }
  }

  setFilter() {
    window.scrollTo(0, 0);
    this.getextract(this.page, this.rowsperpage, this.type_balance, this.days_period, this.type_bonus);
    // Um dia corresponde a 86.400,000 milisegundos.
    //const oneDay = 86400000;
    //const filterDay = this.today.getTime() - oneDay * this.filter.period;
    //this.lines = this.extractData.filter(x => {
    //let xDate = x.date_created.split('/');
    //xDate = new Date(xDate[1] + '/' + xDate[0] + '/' + xDate[2]);
    // return (x.history.includes(this.filter.search));                                                 ///////// retorno da busca
    // return (x.typeOperation === this.filter.movimentation || this.filter.movimentation === '');      ///////// Retorno das movimentações, credito ou debito em conta
    // return (x.symbol === this.filter.currency || this.filter.currency === '');                       ///////// Retorno da moeda
    // return (xDate.getTime() > filterDay || this.filter.period === '');                               ///////// Retorno do periodo selecionado
    // return (x.bonus_type === this.filter.bonus || this.filter.bonus === '');      ///////// Retorno das bonus
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////// Retorno real de todos interligados
    //return (x.description.toLowerCase().includes(this.filter.search.toLowerCase())) && (xDate.getTime() > filterDay || this.filter.period === 0) && (x.type_operation === this.filter.movimentation || this.filter.movimentation === '') && (x.bonus_type === this.filter.bonus || this.filter.bonus === '');
    //});
  }

  ngAfterViewChecked() {
    this.changeDetector.detectChanges();
  }

  getextract(page, rowsperpage, type_balance, days_period, type_bonus) {
    if (!this.type_balance) {
      this.type_balance = 'all';
    }
    if (!this.days_period) {
      this.days_period = 0;
    }
    this._sharedService.getExtract(page, rowsperpage, type_balance, days_period, type_bonus).subscribe(
      response => {
        if (response.return) {
          // console.log(response.data.list_extract.length );
          this.viewextract = false;
          this.viewextractok = true;

          if (response.data.list_extract.length > 0) {
            this.total_points = +response.data.total_points;
            this.release_points = +response.data.release_points;
          }
          if (page == 1) {

            this.lines = response.data.list_extract;
            this.table = response.data.list_extract;

            let idx = 0;
            this.lines.forEach(element => {
              this.lines[idx].date_created = new Date(element.date_created.replace(' ', 'T')).toLocaleDateString();
              idx++;
            });

          } else if (page > 1) {
            this.aux = response.data.list_extract;
            let idx = 0;
            this.aux.forEach(element => {
              this.aux[idx].date_created = new Date(element.date_created.replace(' ', 'T')).toLocaleDateString();
              idx++;
            });

            this.lines = this.lines.concat(this.aux);
            this.table = this.table.concat(this.aux);
          }
          this.extractData = this.lines;

        } else {
          this._hyperToastsService.addToast('warn', 'Atenção', response.msg);
          this.viewextractok = false;
          this.viewextract = false;
        }
      },
      err => {
        this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro inesperado. Atualize a página e tente novamente');
        this.viewextractok = false;
        this.viewextract = false;
      }
    );
  }

  loadMore() {
    // console.log(window.scrollY);
    this.type_balance = 'all';
    this.days_period = 0;
    this.page++;
    this.getextract(this.page, this.rowsperpage, this.type_balance, this.days_period, this.type_bonus);
    window.scroll(0, window.scrollY - 50);
  }
}
