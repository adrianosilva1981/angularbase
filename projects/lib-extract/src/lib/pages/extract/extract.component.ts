import { Component, OnInit, ChangeDetectorRef, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';
import { NguCarousel } from '@ngu/carousel';
import { SharedService } from '../../services/shared.service';
import { CheckoutParameter } from 'lib-services';
import { Router } from '@angular/router';

@Component({
  selector: 'lib-extract-extract',
  templateUrl: './extract.component.html',
  styleUrls: ['./extract.component.less']
})
export class ExtractComponent implements OnInit, AfterViewChecked {

  public checkout_parameter = new CheckoutParameter;
  public scrollTop = 0;
  private today = new Date();
  public extractData: any = [];
  public extractDataFiltered: any = [];
  public carouselOne: NguCarousel;
  public openAdd: Boolean = false;
  public insertValue: number;
  @ViewChild('addCredit') firstNameElement: ElementRef;

  public filter = {
    movimentation: '',
    period: 0,
    currency: '',
    search: ''
  };
  public movimentation = [
    { label: 'Todas as movimentações', value: '' },
    { label: 'Entradas', value: 'C' },
    { label: 'Saídas', value: 'D' }
  ];
  public period = [
    { label: 'Todos', value: 0 },
    { label: '15 dias', value: 15 },
    { label: '30 dias', value: 30 },
    { label: '45 dias', value: 45 },
    { label: '60 dias', value: 60 },
    { label: '90 dias', value: 90 }
  ];
  public currency = [
    { label: 'Todas', value: '' },
    { label: 'Real', value: 'R$' },
    { label: 'Dollár', value: 'U$' },
    { label: 'Hyper Coin', value: 'H$' }
  ];

  constructor(
    private _Services: SharedService,
    private changeDetector: ChangeDetectorRef,
    private router: Router
  ) {
    this._Services.getUserExtract().subscribe(x => {
      this.extractData = x;
      let idx = 0;
      this.extractData.amount.forEach(element => {
        let aux = element.balance;
        aux = aux.replace(/\./g, '');
        aux = aux.replace(/\,/g, '.');
        this.extractData.amount[idx].balance = Number(aux);
        idx++;
      });
      idx = 0;
      this.extractData.history.forEach(element => {
        this.extractData.history[idx].date = new Date(element.date).toLocaleDateString();
        idx++;
      });
      this.extractDataFiltered = this.extractData.history;
    });
  }

  ngOnInit() {
    this.carouselOne = {
      grid: { xs: 1, sm: 1, md: 1, lg: 1, all: 0 },
      slide: 1,
      speed: 400,
      interval: 4000,
      point: {
        visible: true,
        pointStyles: `
        .ngucarouselPoint {
          list-style-type: none;
          text-align: center;
          padding: 12px;
          margin: 0;
          white-space: nowrap;
          overflow: auto;
          position: absolute;
          width: 100%;
          bottom: -25px;
          left: 0;
          box-sizing: border-box;
        }
        .ngucarouselPoint li {
          display: inline-block;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.55);
          padding: 3px;
          margin: 0 3px;
          transition: .4s ease all;
          cursor: pointer;
        }
        .ngucarouselPoint li.active {
            background: white;
            width: 5px;
        }
      `
      },
      load: 2,
      touch: true,
      loop: false,
      custom: 'banner'
    };
  }
  openInput() {
    this.openAdd = true;
    this.firstNameElement.nativeElement.focus();
  }
  openCheckout() {
    this.checkout_parameter.itens_cart = [
      {
        'post': {
          'id': null,
          'qtd': 1,
          'hash': 'RG55RGGH55RGHGHH5554HGGF5',
          'data': {
            'credit_value': this.insertValue
          }
        },
        'view': {
          'plot': 1,
          'price': this.insertValue,
          'price_virtual': 0.00,
          'discount': 0.00,
          'discount_virtual': 0.00,
          'coin': 'BRL',
          'type': 'insert-credit'
        }
      }
    ];
    this.checkout_parameter.disableMethods = ['hjpay'];
    this._Services.setCheckoutParameter(this.checkout_parameter);
    this.router.navigate(['/add-credit'], { skipLocationChange: true });
  }
  openWithdraw() {
    this.router.navigate(['/withdraw']);
  }
  setFilter() {
    window.scrollTo(0, 0);
    // Um dia corresponde a 86.400,000 milisegundos.
    const oneDay = 86400000;
    const filterDay = this.today.getTime() - oneDay * this.filter.period;
    this.extractDataFiltered = this.extractData.history.filter(x => {
      let xDate = x.date.split('/');
      xDate = new Date(xDate[1] + '/' + xDate[0] + '/' + xDate[2]);
      // return (x.history.includes(this.filter.search));                                                 ///////// retorno da busca
      // return (x.typeOperation === this.filter.movimentation || this.filter.movimentation === '');      ///////// Retorno das movimentações, credito ou debito em conta
      // return (x.symbol === this.filter.currency || this.filter.currency === '');                       ///////// Retorno da moeda
      // return (xDate.getTime() > filterDay || this.filter.period === '');                               ///////// Retorno do periodo selecionado
      ///////////////////////////////////////////////////////////////////////////////////////////////////////////// Retorno real de todos interligados
      return (x.history.toLowerCase().includes(this.filter.search.toLowerCase())) && (xDate.getTime() > filterDay || this.filter.period === 0) && (x.typeOperation === this.filter.movimentation || this.filter.movimentation === '') && (x.symbol === this.filter.currency || this.filter.currency === '');
    });
  }
  ngAfterViewChecked() {
    this.changeDetector.detectChanges();
  }
}
