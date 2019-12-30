import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HyperToastsService, HyperCookieService, BroadcastEventService } from 'lib-services';
import { SharedService } from '@app-back-office/services/shared.service';
import { environment } from '@env/app-back-office';
import { debug } from 'util';

@Component({
  selector: 'app-back-office-monthly-checkout',
  templateUrl: './monthly-checkout.component.html',
  styleUrls: ['./monthly-checkout.component.less']
})
export class MonthlyCheckoutComponent implements OnInit {

  private currentYear = (new Date()).getFullYear();
  public years: any = [];

  public voucher = '';
  public userObj: any = {};
  public resellerObj: any = {};
  public plan: any = '';
  public rates: any = {};

  public sendpayOk = true;

  public cep = {};
  public resellerLoading = false;
  public resellerCheck = false;
  public resellerCheckfalse = false;
  public formAddress = false;

  public payment_method: string;
  public coin: string;
  public amount: string;
  public nameCard: string;
  public cardnumber: string;

  public year: string;
  public numberCVV: string;
  public showAllCards = false;
  public saveCard: boolean;
  public urlAssets: string;
  public creditCardParcels = [];
  public juros = '';
  public selectedCard = 0;
  public enableBilletDownloadLink = false;
  public homeUrl = '/login';
  public billetLink = '';
  public _optionsMask = { prefix: 'R$ ', thousands: '.', decimal: ',' };
  public cards = [];
  public params;
  public myCards: any;
  public myCardsOK = false;
  public check = false;
  public delete = false;
  public document = '';

  public paymentCreditCard = false;
  public paymentCredit = false;
  public paymentTicket = false;
  public paymentBitcoin = false;
  public paymentTed = false;
  public paymentFinancing = false;
  public paymentEduzz = false;

  public bitCoin_url = '';
  public eduzz_url = '';

  public creditok = false;
  public credit: any = {};

  public amountPlan = 0;

  public crypto_coins: any = {};
  public transfer_bank: any = {};
  public ticket: any = {};

  public creditCardGroup: FormGroup;
  public ticketGroup: FormGroup;

  public cardMask = [/\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  public CEPMASK = [/\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/];
  public CPFMASK = [/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/];

  public CPF_REGEX: RegExp = /[0-9]{3}\.?[0-9]{3}\.?[0-9]{3}\-?[0-9]{2}/;
  public CEP_REGEX: RegExp = /^[0-9]{5}-[0-9]{3}$/;
  public REGEX_ONLY_NYMBERS: RegExp = /^[0-9]*$/;

  public stage: any = {
    refused: 'Solicitação Recusada',
    toprocess: 'Solicitação a Processar',
    processing: 'Solicitação Processando',
    processed: 'Solicitação Processada',
    reversed: 'Solicitação Revertida',
  };

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
    private route: ActivatedRoute,
    private _sharedService: SharedService,
    private _hyperToastsService: HyperToastsService,
    private _router: Router,
    private _hyperCookieService: HyperCookieService,
    private _formBuilder: FormBuilder,
    private _formBuilder2: FormBuilder,
  ) {

    this.mountYears();

    this.userObj = this._sharedService.getCookieReseller() || ''; // pega info do reseller

    this._sharedService.getinfoResseler().subscribe(response1 => {
      if (response1.return) {
        this.resellerObj = response1.data;
        if (this.resellerObj.foreign_type == 'Y') {
          this.paymentTicket = false;
        }

        this._sharedService.getInfoPlan(this.resellerObj.id_plan, 'office', this.voucher).subscribe(response2 => {
          if (response2.return) {
            this.plan = response2.data;
            this.amountPlan = this.plan.monthly_value;

            const aux = {
              'value': 1,
              'label': '1x Sem Juros ' + this.plan.symbol + (+this.plan.monthly_value).toFixed(2)
            };

            this.creditCardParcels.push(aux);

            this.carregaPayment();

            this.plan.monthly_methods.forEach(element => {
              switch (element.method) {
                case 'credit_card':
                  this.paymentCreditCard = true;
                  break;
                case 'platform_credit':
                  this.paymentCredit = true;
                  break;
                case 'ticket':
                  this.paymentTicket = true;
                  break;
                case 'crypto_coins':
                  this.paymentBitcoin = true;
                  this.bitCoin_url = element.url;
                  break;
                case 'transfer_bank':
                  this.paymentTed = true;
                  break;
                case 'eduzz':
                  this.paymentEduzz = true;
                  this.eduzz_url = element.url;
                  break;
                case 'Financing':
                  this.paymentFinancing = true;
                  break;
              }
            });

            // verificar pacotes de bitcoins ***************************************************************
            // this._sharedService.getpackages('mensal').subscribe(response6 => {
            //   if (response6.return) {

            //     this.paymentBitcoin = true;
            //     this.paymentTed = true;
            //     this.paymentCredit = true;
            //     this.amountValue = 130.00;

            //     this.bitCoin = response6.data[0];
            //     this.amountBitcoin = this.bitCoin.value;
            //     // console.log(this.bitCoin);
            //   } else {
            //     this.paymentBitcoin = false;
            //     this.paymentTed = false;
            //     this.paymentCredit = false;
            //   }
            // },
            //   err => {
            //     this.paymentBitcoin = false;
            //     this.paymentTed = false;
            //     this.paymentCredit = false;
            //     this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro inesperado. Atualize a página e tente novamente');
            //   }
            // );
            // **********************************************************************************************

          } else {
            this._hyperToastsService.addToast('warn', 'Atenção', response2.msg);
            this._router.navigate(['office/access']); // plano inválido
          }
        },
          err => {
            this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro inesperado. Atualize a página e tente novamente');
            this._router.navigate(['office/access']); // plano inválido
          });

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
  }

  ngOnInit() {
    this.createForm();
    this.getCredit();
  }

  carregaPayment() {
    //pega valores bitcoins mensal
    if (this.paymentBitcoin) {
      this._sharedService.getInfoPayments('crypto_coins', 'monthly').subscribe(response7 => {
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
      this._sharedService.getInfoPayments('transfer_bank', 'monthly').subscribe(response8 => {
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
      this._sharedService.getInfoPayments('ticket', 'monthly').subscribe(response9 => {
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

  getCredit() {
    this.creditok = false;
    this._sharedService.getCredit().subscribe(
      response => {
        if (response.return) {
          this.creditok = true;
          this.credit = response.data.release_points;
        }
      },
      err => {
        this.creditok = false;
        this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro inesperado. Atualize a página e tente novamente');
      }
    );
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

  sendPay(method) {
    this.sendpayOk = false;
    const sub = 'N';
    const infos = {
      subscriber: sub,
      id_plan: this.plan.id,
      method: method,
      document: this.resellerObj.cnpj_cpf,
      credit_card: {
        id: '',
        number: this.creditCardGroup.controls.cardNumber.value,
        cvv: this.creditCardGroup.controls.cardCVV.value,
        holder_name: this.creditCardGroup.controls.cardName.value,
        expiration: this.creditCardGroup.controls.cardMonth.value + '/' + this.creditCardGroup.controls.cardYear.value,
      },
      street: this.ticketGroup.controls.streetControl.value,
      number: this.ticketGroup.controls.numberControl.value,
      zipcode: this.ticketGroup.controls.cepControl.value,
      neighborhood: this.ticketGroup.controls.districtControl.value,
      city: this.ticketGroup.controls.cityControl.value,
      state: this.ticketGroup.controls.stateControl.value,
      country: 'BR'
    };
    this.checkout(infos);
  }

  checkout(obj) {

    this._sharedService.monthlyCheckout(obj).subscribe(response => {
      if (response.return) {
        BroadcastEventService.event('changestatus').emit(response.data.id);
        this.sendpayOk = true;
        this._hyperToastsService.addToast('success', 'Parabéns', response.msg); // pagamento reprovado
        if (obj.method === 'crypto_coins') {
          window.open(this.bitCoin_url, '_blank');
        }
        this.carregaPayment();
        if (obj.method === 'platform_credit' || obj.method === 'credit_card') {
          this._router.navigate(['office/home']);
        } else {
          this._router.navigate(['office/monthly']);
        }
      } else {
        this.sendpayOk = true;
        this._hyperToastsService.addToast('warn', 'Atenção', response.msg); // pagamento reprovado
      }
    },
      err => {
        this.sendpayOk = true;
        this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro inesperado. Atualize a página e tente novamente');
      }// erro no pagamento
    );
  }

  createForm() {
    this.creditCardGroup = this._formBuilder.group({
      autorized: ['Y'],
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
