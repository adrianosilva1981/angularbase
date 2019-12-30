import { Component, OnInit, Input, SimpleChanges, SimpleChange, OnChanges, Output, EventEmitter, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { saveAs } from 'file-saver';
import { CheckoutParameter, HyperToastsService, HyperCookieService, BroadcastEventService } from 'lib-services';
import { SharedService } from '../../services/shared.service';

const REGEX_ONLY_NYMBERS = /^[0-9]*$/;

@Component({
  selector: 'lib-components-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.less']
})
export class CheckoutComponent implements OnInit, OnChanges {

  @Input() checkout_parameter: CheckoutParameter;
  @Output() onCheckoutSuccess: EventEmitter<any> = new EventEmitter();

  private currentYear = (new Date()).getFullYear();

  public _checkout_parameter: CheckoutParameter;
  public userLogged = false;
  public listYears: any = [];
  public paymentMethodSelected;
  public checkoutForm: FormGroup;
  public objView: any;
  public itensLenght = 0;
  public objPlots: any = [];
  public maskCardNumber = [/\d/, /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, /\d/];
  public maskCPF = [/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/];
  public maskCEP = [/\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/];
  public showTooltip = false;
  public months: any;
  public objUserBalance: any = [];
  public objUserBalanceNetmarketing: any;
  public objRequest: any = {
    method_data: {},
    post_data: []
  };
  public objTextSymbol = {
    'BRL': 'Reais',
    'USD': 'Dólar',
    'HCS': 'Hypercoins'
  };

  public methodsPayment: any = [
    {
      type: 'credit_card',
      text: 'Cartão de Crédito',
      icon: 'fa-credit-card',
      disabled: true
    },
    {
      type: 'billet',
      text: 'Boleto Bancário',
      icon: 'fa-barcode',
      disabled: true
    },
    {
      type: 'hjpay',
      text: 'Créditos da Plataforma',
      icon: 'fa-dollar-sign',
      disabled: true
    }
  ];

  public valid = true;
  public loading = false;
  constructor(
    @Inject('environments') private environments: any,
    private _sharedService: SharedService,
    private _hyperToastsService: HyperToastsService,
    private _hyperCookieService: HyperCookieService
  ) {
    this.mountCheckoutForm();
    this.mountYears();
    this.mountMonths();
    this.listenerLogin();
  }

  ngOnInit() {
    this.init();
  }

  ngOnChanges(changes: SimpleChanges) {
    const auxCheckoutParameter: SimpleChange = changes.checkout_parameter;
    if (auxCheckoutParameter) {
      this._checkout_parameter = auxCheckoutParameter.currentValue;
      this.init();
    }
  }

  init() {
    this.checkIsAuthenticated();
    this.mountObjView();
  }

  listenerLogin() {
    BroadcastEventService.event('listenerLoginComponent').subscribe(
      userData => {
        this.checkIsAuthenticated();
      }
    );
  }

  checkIsAuthenticated() {
    const cookieName = this.environments.defaultCookieName;

    const cookie = cookieName ? this._hyperCookieService.getCookie_GENERIC(cookieName) : this._hyperCookieService.getCookie_AUTH();

    if (cookie && Object(cookie).JWT) {
      this.getUserBalance();
      this.methodsPayment.forEach(element => {
        element.disabled = false;
      });
      this.checkMethodDisabled();
      this.userLogged = true;
    } else {
      this.methodsPayment.forEach(element => {
        element.disabled = true;
      });
      this.selectPaymentMethod('none');
      this.userLogged = false;
    }
  }

  checkMethodDisabled() {
    if (this._checkout_parameter.disableMethods) {
      this._checkout_parameter.disableMethods.forEach(element => {
        const pos = this.methodsPayment.findIndex(x => x.type === element);
        if (pos !== -1) {
          this.methodsPayment.splice(pos, 1);
        }
      });
    }
    if (this.methodsPayment) {
      if (this.methodsPayment.length > 0) {
        this.selectPaymentMethod(this.methodsPayment[0].type);
      }
    }
  }

  mountYears() {
    for (let i = 0; i < 10; i++) {
      this.listYears[i] = this.currentYear + i;
    }
  }

  mountMonths() {
    this.months = [
      { name: 'Janeiro', value: 1 },
      { name: 'Fevereiro', value: 2 },
      { name: 'Março', value: 3 },
      { name: 'Abril', value: 4 },
      { name: 'Maio', value: 5 },
      { name: 'Junho', value: 6 },
      { name: 'Julho', value: 7 },
      { name: 'Agosto', value: 8 },
      { name: 'Setembro', value: 9 },
      { name: 'Outubro', value: 10 },
      { name: 'Novembro', value: 11 },
      { name: 'Dezembro', value: 12 }
    ];
  }

  // mountObjPlots() {
  //   let maxPlots = 0;
  //   this._checkout_parameter.itens_cart.forEach(element => {
  //     maxPlots = element.view.plot > maxPlots ? element.view.plot : maxPlots;
  //   });

  //   for (let i = 0; i < maxPlots; i++) {
  //     this.objPlots[i] = i === 0 ? this.objView.amount_pay : (this.objView.amount_pay / (i + 1));
  //   }
  // }

  mountObjPlots() {
    const juros = [0, 0.0648, 0.1021, 0.1394, 0.1767];

    for (let i = 0; i < juros.length; i++) {
      const value = (1 + juros[i]) * this.objView.amount_pay;
      this.objPlots[i] = value / (i + 1);
    }
  }

  mountObjView() {
    this.itensLenght = 0;
    const objList = this._checkout_parameter.itens_cart;
    this.objView = {
      amount_price: 0,             // Valor Real do produto
      amount_price_virtual: 0,     // Valor Virtual do produto(HyperCoins)
      amount_shipping: 0,          // Valor do Frete
      amount_discount: 0,          // Desconte Real
      amount_discount_virtual: 0,  // Desconto Virtual
      amount_pay: 0,               // Total Real a pagar
      amount_pay_vitual: 0,        // Total Virtual a pagar
      coin: 0                      // Moeda
    };

    objList.forEach(element => {

      if (element.view.type !== 'shipping') {
        this.objView.amount_price += (element.view.price * element.post.qtd);
        this.objView.amount_price_virtual += (element.view.price_virtual * element.post.qtd);
        this.objView.amount_discount += element.view.discount;
        this.objView.amount_discount_virtual += element.view.discount_virtual;

        this.itensLenght++;
      } else {
        this.objView.amount_shipping += element.view.price;
      }
      this.objView.coin = element.view.coin;
    });

    this.objView.amount_pay += this.objView.amount_shipping + this.objView.amount_price - this.objView.amount_discount;
    this.objView.amount_pay_vitual += this.objView.amount_price_virtual - this.objView.amount_discount_virtual;

    this.mountObjPlots();
  }

  mountCheckoutForm() {
    this.checkoutForm = new FormGroup({
      payment_method: new FormControl(
        { value: '', disabled: false }, Validators.compose([Validators.required])
      ),
      plots: new FormControl(
        { value: '', disabled: false }, Validators.compose([Validators.required])
      ),
      card_name: new FormControl(
        { value: '', disabled: false }, Validators.compose([Validators.required])
      ),
      card_number: new FormControl(
        { value: '', disabled: false }, Validators.compose([Validators.required])
      ),
      card_month: new FormControl(
        { value: '', disabled: false }, Validators.compose([Validators.required])
      ),
      card_year: new FormControl(
        { value: '', disabled: false }, Validators.compose([Validators.required])
      ),
      card_cvv: new FormControl(
        { value: '', disabled: false }, Validators.compose([Validators.required, Validators.pattern(REGEX_ONLY_NYMBERS)])
      ),
      document: new FormControl(
        { value: '', disabled: false }, Validators.compose([Validators.required])
      ),
      street: new FormControl(
        { value: '', disabled: false }, Validators.compose([Validators.required])
      ),
      number: new FormControl(
        { value: '', disabled: false }, Validators.compose([Validators.required])
      ),
      zipcode: new FormControl(
        { value: '', disabled: false }, Validators.compose([Validators.required])
      ),
      neighborhood: new FormControl(
        { value: '', disabled: false }, Validators.compose([Validators.required])
      ),
      city: new FormControl(
        { value: '', disabled: false }, Validators.compose([Validators.required])
      ),
      state: new FormControl(
        { value: '', disabled: false }, Validators.compose([Validators.required])
      ),
      country: new FormControl(
        { value: '', disabled: false }, Validators.compose([Validators.required])
      )
    });
  }

  enabledAllControls() {
    Object.keys(this.checkoutForm.controls).forEach(key => {
      this.checkoutForm.get(key).enable();
    });
  }

  selectPaymentMethod(method) {
    this.paymentMethodSelected = method;
    this.enabledAllControls();

    switch (method) {
      case 'credit_card':
        this.checkoutForm.get('payment_method').setValue('credit_card');
        this.checkoutForm.get('document').disable();
        this.checkoutForm.get('street').disable();
        this.checkoutForm.get('number').disable();
        this.checkoutForm.get('zipcode').disable();
        this.checkoutForm.get('neighborhood').disable();
        this.checkoutForm.get('city').disable();
        this.checkoutForm.get('state').disable();
        this.checkoutForm.get('country').disable();
        this.valid = true;
        break;
      case 'billet':
        this.checkoutForm.get('payment_method').setValue('billet');
        this.checkoutForm.get('plots').setValue(1);
        this.checkoutForm.get('card_name').disable();
        this.checkoutForm.get('card_number').disable();
        this.checkoutForm.get('card_month').disable();
        this.checkoutForm.get('card_year').disable();
        this.checkoutForm.get('card_cvv').disable();
        this.valid = true;
        break;
      case 'hjpay':
        this.checkoutForm.get('payment_method').setValue('hjpay');
        this.checkoutForm.get('plots').setValue(1);
        this.checkoutForm.get('card_name').disable();
        this.checkoutForm.get('card_number').disable();
        this.checkoutForm.get('card_month').disable();
        this.checkoutForm.get('card_year').disable();
        this.checkoutForm.get('card_cvv').disable();
        this.checkoutForm.get('document').disable();
        this.checkoutForm.get('street').disable();
        this.checkoutForm.get('number').disable();
        this.checkoutForm.get('zipcode').disable();
        this.checkoutForm.get('neighborhood').disable();
        this.checkoutForm.get('city').disable();
        this.checkoutForm.get('state').disable();
        this.checkoutForm.get('country').disable();
        this.valid = this.objUserBalance + this.objUserBalanceNetmarketing >= this.objView.amount_pay ? true : false;
        break;
    }
  }

  getUserBalance() {
    this._sharedService.getUserBalance().subscribe(
      (response: any) => {
        if (response.return === true) {
          this.objUserBalance = response.data;
        } else {
          this._hyperToastsService.addToast('warn', 'Atenção', 'Ocorreu um erro ao listar o saldo do usuário');
        }
        this.valid = this.objUserBalance + this.objUserBalanceNetmarketing >= this.objView.amount_pay ? true : false;

      },
      err => { this._hyperToastsService.addToast('error', 'Atenção', 'Ocorreu um erro inesperado. Atualize a página e tente novamente.'); }
    );

    this._sharedService.getBalanceNetMarketing().subscribe(
      response => {
        if (response.return) {
          this.objUserBalanceNetmarketing = response.data;
        } else {
          this.objUserBalanceNetmarketing = 0;
        }
        this.valid = this.objUserBalance + this.objUserBalanceNetmarketing >= this.objView.amount_pay ? true : false;

      }, err => {
        this.objUserBalanceNetmarketing = 0;
      }
    );
  }

  submitCheckout() {
    this.loading = true;
    this.objRequest.method_data = this.checkoutForm.value;

    this.objRequest.post_data = [];

    this._checkout_parameter.itens_cart.forEach(element => {
      this.objRequest.post_data.push(element.post);
    });
    console.log('_checkout_parameter', this._checkout_parameter);
    if (this._checkout_parameter.woner != undefined && this._checkout_parameter.woner != null && this._checkout_parameter.woner > 0) {
      this.objRequest.woner = this._checkout_parameter.woner;
    } else {
      this.objRequest.woner = 0;
    }

    this._sharedService.checkout(this.objRequest).subscribe(
      (response: any) => {
        if (response.return === true) {
          this.onCheckoutSuccess.emit(response.data);
          if (response.data.urlBillet) {
            this.gerarBoleto(response.data.urlBillet, 'YoutHub');
          }
          this._hyperToastsService.addToast('success', 'Parabéns', response.msg);
        } else {
          this._hyperToastsService.addToast('warn', 'Atenção', response.msg);
        }
        this.loading = false;
      },
      err => { this._hyperToastsService.addToast('error', 'Erro', err); this.loading = false; }
    );
  }

  gerarBoleto(url, name = 'YouHub') {
    this._sharedService.downloadBankSlip(url).subscribe(
      (res) => {
        saveAs(res, name + '.pdf');
      }
    );
  }

}
