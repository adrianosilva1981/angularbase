import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HyperToastsService, HyperCookieService, BroadcastEventService } from 'lib-services';
import { SharedService } from '@app-back-office/services/shared.service';
import { environment } from '@env/app-back-office';

@Component({
  selector: 'app-back-office-upgrade-checkout',
  templateUrl: './upgrade-checkout.component.html',
  styleUrls: ['./upgrade-checkout.component.less']
})
export class UpgradeCheckoutComponent implements OnInit {

  private currentYear = (new Date()).getFullYear();
  public years: any = [];
  public plans: any = [];
  public plan_selected: any = {};

  public userObj: any = {};
  public resellerObj: any = {};
  public rates: any = {};

  public sendpayOk = true;

  public cep = {};
  public resellerLoading = false;
  public resellerCheck = false;
  public resellerCheckfalse = false;
  public formAddress = false;

  public payment_method: string;
  public coin: string;

  public crypto_coins: any = {};
  public transfer_bank: any = {};
  public ticket: any = {};
  public finace: any = {};

  public year: string;
  public creditCardParcels = [];
  public juros = '';
  public _optionsMask = { prefix: 'R$ ', thousands: '.', decimal: ',' };

  public paymentCreditCard = false;
  public paymentTicket = false;
  public paymentBitcoin = false;
  public paymentTed = false;
  public paymentEduzz = false;
  public paymentCredit = false;
  public bitCoin_url = '';
  public eduzz_url = '';
  public eduzz_plots = '';
  public eduzz_plots_value = '';
  public value_credit: number = 0;

  public amountPlan = 0;

  public creditCardGroup: FormGroup;
  public ticketGroup: FormGroup;

  public stage: any = {
    refused: 'Solicitação Recusada',
    toprocess: 'Solicitação a Processar',
    processing: 'Solicitação Processando',
    processed: 'Solicitação Processada',
    reversed: 'Solicitação Revertida',
    requested: 'Solicitado',
    approved: 'Solicitação Aprovada'
  };

  public cardMask = [/\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  public CEPMASK = [/\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/];
  public CPFMASK = [/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/];

  public CPF_REGEX: RegExp = /[0-9]{3}\.?[0-9]{3}\.?[0-9]{3}\-?[0-9]{2}/;
  public CEP_REGEX: RegExp = /^[0-9]{5}-[0-9]{3}$/;
  public REGEX_ONLY_NYMBERS: RegExp = /^[0-9]*$/;

  public states = [
    { value: 'AC', label: 'Acre' },
    { value: 'AL', label: 'Alagoas' },
    { value: 'AP', label: 'Amapá' },
    { value: 'AM', label: 'Amazonas' },
    { value: 'BA', label: 'Bahia' },
    { value: 'CE', label: 'Ceará' },
    { value: 'DF', label: 'Distrito Federal' },
    { value: 'ES', label: 'Espírito Santo' },
    { value: 'GO', label: 'Goiás' },
    { value: 'MA', label: 'Maranhão' },
    { value: 'MT', label: 'Mato Grosso' },
    { value: 'MS', label: 'Mato Grosso do Sul' },
    { value: 'MG', label: 'Minas Gerais' },
    { value: 'PA', label: 'Pará' },
    { value: 'PB', label: 'Paraíba' },
    { value: 'PR', label: 'Paraná' },
    { value: 'PE', label: 'Pernambuco' },
    { value: 'PI', label: 'Piauí' },
    { value: 'RJ', label: 'Rio de Janeiro' },
    { value: 'RN', label: 'Rio Grande do Norte' },
    { value: 'RS', label: 'Rio Grande do Sul' },
    { value: 'RO', label: 'Rondônia' },
    { value: 'RR', label: 'Roraima' },
    { value: 'SC', label: 'Santa Catarina' },
    { value: 'SP', label: 'São Paulo' },
    { value: 'SE', label: 'Sergipe' },
    { value: 'TO', label: 'Tocantins' }
  ];

  public months: any = [
    { label: 'Jan', value: '01' },
    { label: 'Fev', value: '02' },
    { label: 'Mar', value: '03' },
    { label: 'Abr', value: '04' },
    { label: 'Mai', value: '05' },
    { label: 'Jun', value: '06' },
    { label: 'Jul', value: '07' },
    { label: 'Ago', value: '08' },
    { label: 'Set', value: '09' },
    { label: 'Out', value: '10' },
    { label: 'Nov', value: '11' },
    { label: 'Dez', value: '12' }
  ];

  constructor(
    private _sharedService: SharedService,
    private _hyperToastsService: HyperToastsService,
    private _router: Router,
    private _hyperCookieService: HyperCookieService,
    private _formBuilder: FormBuilder,
    private _formBuilder2: FormBuilder
  ) {

    this.mountYears();

    this.userObj = this._sharedService.getCookieReseller() || ''; // pega info do reseller

    this._sharedService.getCredit().subscribe(
      response => {
        if (response.return) {
          this.value_credit = response.data.release_points;
        }
      },
      err => {
        console.log(err);
      }
    );

    this._sharedService.getinfoResseler().subscribe(response1 => {
      if (response1.return) {
        this.resellerObj = response1.data;
        if (this.resellerObj.cnpj_cpf === null || this.resellerObj.cnpj_cpf === undefined) {
          this.resellerObj.cnpj_cpf = '';
        }
      } else {
        this.paymentTicket = false;
        this._hyperToastsService.addToast('warn', 'Atenção', response1.msg);
        this._router.navigate(['office/login']); // usuario inválido
      }
    },
      err => {
        this.paymentTicket = false;
        this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro inesperado. Atualize a página e tente novamente');
        this._router.navigate(['office/login']); // usuario inválido
      });

    this._sharedService.getPlansUpgrade('office').subscribe(response2 => {
      if (response2.return) {
        for (let i = 0; i < response2.data.length; i++) {
          response2.data[i].selected = false;
        }
        this.plans = response2.data;

        if (this.plans.length == 1) {
          this.selectPlan(this.plans[0]);
        }
      } else {
        this._router.navigate(['office/home']);
      }
    },
      err => {
        this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro inesperado. Atualize a página e tente novamente');
        this._router.navigate(['office/home']);
      });
  }

  ngOnInit() {
    this.createForm();
  }

  selectPlan(plan) {
    this.plans.filter((element) => {
      if (element.id == plan.id) {
        element.selected = true;
      } else {
        element.selected = false;
      }
    });
    this.plan_selected = plan;
    this.amountPlan = this.plan_selected.value;
    this.rates = plan.rates;
    this.mountPlotsCard(plan.value);
    this.plan_selected.accession_methods.forEach(item => {
      switch (item.method) {
        case 'credit_card':
          this.paymentCreditCard = true;
          break;
        case 'ticket':
          this.paymentTicket = true;
          break;
        case 'crypto_coins':
          this.paymentBitcoin = true;
          this.bitCoin_url = item.url;
          break;
        case 'transfer_bank':
          this.paymentTed = true;
          break;
        case 'platform_credit':
          this.paymentCredit = true;
          break;
        case 'eduzz':
          this.paymentEduzz = true;
          this.eduzz_url = item.url;
          this.eduzz_plots = item.info.plots;
          this.eduzz_plots_value = item.info.value_plots;
          break;
      }
    });
    this.loadPayment();
  }

  loadPayment() {
    //pega valores bitcoins mensal
    if (this.paymentBitcoin) {
      this._sharedService.getInfoPayments('crypto_coins', 'upgrade').subscribe(response7 => {
        if (response7.return) {
          this.crypto_coins = response7.data;
          let idx = 0;
          this.crypto_coins.forEach(element => {
            this.crypto_coins[idx].created = new Date(element.created.replace(' ', 'T')).toLocaleDateString();
            idx++;
          });
        } else {
          console.log('nenhuma Bitcoin');
        }
      },
        err => {
          this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro inesperado. Atualize a página e tente novamente');
        }
      );
    }

    //pega valores TED mensal
    if (this.paymentTed) {
      this._sharedService.getInfoPayments('transfer_bank', 'upgrade').subscribe(response8 => {
        if (response8.return) {
          this.transfer_bank = response8.data;
          let idx = 0;
          this.transfer_bank.forEach(element => {
            this.transfer_bank[idx].created = new Date(element.created.replace(' ', 'T')).toLocaleDateString();
            idx++;
          });
        } else {
          console.log('nenhuma TED');
        }
      },
        err => {
          this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro inesperado. Atualize a página e tente novamente');
        }
      );
    }
    //pega valores Boleto mensal
    if (this.paymentTicket) {
      this._sharedService.getInfoPayments('ticket', 'upgrade').subscribe(response9 => {
        if (response9.return) {
          this.ticket = response9.data;
          let idx = 0;
          this.ticket.forEach(element => {
            this.ticket[idx].created = new Date(element.created.replace(' ', 'T')).toLocaleDateString();
            idx++;
          });
        } else {
          console.log('nenhum boleto');
        }
      },
        err => {
          this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro inesperado. Atualize a página e tente novamente');
        }
      );
    }
  }

  mountYears() {
    for (let i = 0; i < 15; i++) {
      this.years[i] = { label: this.currentYear + i, value: this.currentYear + i };
    }
  }

  getCEP() {
    if (this.ticketGroup.controls.cepControl.value !== '' && this.ticketGroup.controls.cepControl.valid) {
      this.resellerLoading = true;
      this.resellerCheck = false;
      this.resellerCheckfalse = false;

      if (this.resellerObj.cnpj_cpf !== '' && this.resellerObj.cnpj_cpf !== null && this.resellerObj.cnpj_cpf !== undefined) {
        this.ticketGroup.controls.cpfControl.setValidators(null);
        this.ticketGroup.controls.cpfControl.updateValueAndValidity();
      }

      this._sharedService.getCEP(this.ticketGroup.controls.cepControl.value).subscribe(response => {
        if (response.return) {
          this.formAddress = true;
          this.resellerLoading = false;
          this.resellerCheck = true;
          this.resellerCheckfalse = false;

          this.cep = response.data;

          this.ticketGroup.controls.streetControl.setValue(response.data.logradouro);
          this.ticketGroup.controls.cityControl.setValue(response.data.localidade);
          this.ticketGroup.controls.districtControl.setValue(response.data.bairro);
          this.ticketGroup.controls.stateControl.setValue(response.data.uf);
          this.ticketGroup.controls.districtControl.updateValueAndValidity();
          this.ticketGroup.controls.cityControl.updateValueAndValidity();
          this.ticketGroup.controls.streetControl.updateValueAndValidity();
          this.ticketGroup.controls.stateControl.updateValueAndValidity();

        } else {
          this._hyperToastsService.addToast('warn', 'Atenção', response.msg);
          this.formAddress = false;
          this.resellerLoading = false;
          this.resellerCheck = false;
          this.resellerCheckfalse = true;
          this.resetForm(this.ticketGroup);
        }
      },
        err => {
          this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro inesperado. Atualize a página e tente novamente');
          this.formAddress = false;
          this.resellerLoading = false;
          this.resellerCheck = false;
          this.resellerCheckfalse = true;
          this.resetForm(this.ticketGroup);
        }
      );
    } else {
      this.formAddress = false;
      this.resellerLoading = false;
      this.resellerCheck = false;
      this.resellerCheckfalse = true;
      this.resetForm(this.ticketGroup);
    }

  }

  // limpa o form
  resetForm(form) {
    form.controls.streetControl.setValue('');
    form.controls.cityControl.setValue('');
    form.controls.districtControl.setValue('');
    form.controls.stateControl.setValue('');
    form.controls.districtControl.updateValueAndValidity();
    form.controls.cityControl.updateValueAndValidity();
    form.controls.streetControl.updateValueAndValidity();
    form.controls.stateControl.updateValueAndValidity();
  }

  initializeVariables() {
    this.coin = 'BRL';
    this.payment_method = 'credit_card';
  }

  mountPlotsCard(totalplano) {
    this.creditCardParcels = [];
    let label = '';
    for (let index = 1; index <= +this.plan_selected.credit_card_max_plots; index++) {
      if (index === 1) {
        label = '1x Sem Juros ' + this.plan_selected.symbol + (+totalplano / index).toFixed(2);
      } else {
        label = index + 'x ' + this.juros + ' ' + this.plan_selected.symbol + ((+totalplano + (+totalplano * this.rates.find(x => x.plots == index).rate_percentage)) / index).toFixed(2);
      }
      const aux = {
        'value': index,
        'label': label
      };
      this.creditCardParcels.push(aux);
    }
  }

  sendPay(method) {
    this.sendpayOk = false;
    const infos = {
      id_plan: this.plan_selected.id,
      method: method,
      document: this.resellerObj.cnpj_cpf || this.ticketGroup.controls.cpfControl.value,
      credit_card: {
        id: '',
        number: this.creditCardGroup.controls.cardNumber.value,
        cvv: this.creditCardGroup.controls.cardCVV.value,
        holder_name: this.creditCardGroup.controls.cardName.value,
        expiration: this.creditCardGroup.controls.cardMonth.value + '/' + this.creditCardGroup.controls.cardYear.value,
      },
      number_plots: this.creditCardGroup.controls.numberOfParcels.value,
      street: this.ticketGroup.controls.streetControl.value,
      number: this.ticketGroup.controls.numberControl.value,
      zipcode: this.ticketGroup.controls.cepControl.value,
      neighborhood: this.ticketGroup.controls.districtControl.value,
      city: this.ticketGroup.controls.cityControl.value,
      state: this.ticketGroup.controls.stateControl.value,
      country: 'BR'
    };

    this._sharedService.upgradePlanCheckout(infos).subscribe(response => {
      if (response.return) {
        this.sendpayOk = true;
        const cookieData = response.data;
        cookieData.JWT = response.JWT;
        this._hyperCookieService.setCookie_GENERIC(cookieData, environment.defaultCookieName);
        this._hyperToastsService.addToast('success', 'Sucesso', response.msg);

        if (method === 'platform_credit' || method === 'credit_card') {
          this._router.navigate(['office/home']);
        } else {
          this.loadPayment();
          this._router.navigate(['office/upgrade']);
        }

        BroadcastEventService.event('changestatus').emit(response.data.id);

        if (method === 'crypto_coins') {
          window.open(this.bitCoin_url, '_blank');
        }

      } else {
        this.sendpayOk = true;
        this._hyperToastsService.addToast('warn', 'Atenção', response.msg);
      }
    },
      err => {
        this.sendpayOk = true;
        this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro inesperado. Atualize a página e tente novamente');
      }
    );
  }

  createForm() {
    this.creditCardGroup = this._formBuilder.group({
      cardNumber: ['', Validators.required],
      cardName: ['', Validators.required],
      cardMonth: ['01', Validators.required],
      cardYear: ['2019', Validators.required],
      cardCVV: ['', [Validators.required, Validators.pattern(this.REGEX_ONLY_NYMBERS), Validators.minLength(3)]],
      numberOfParcels: [1, Validators.required]
    });

    this.ticketGroup = this._formBuilder2.group({
      cpfControl: ['', [Validators.required, Validators.pattern(this.CPF_REGEX)]],
      cepControl: ['', [Validators.required, Validators.pattern(this.CEP_REGEX)]],
      streetControl: ['', Validators.required],
      numberControl: ['', Validators.required],
      districtControl: ['', Validators.required],
      cityControl: ['', Validators.required],
      stateControl: ['', Validators.required]
    });
  }
}
