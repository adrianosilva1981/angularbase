import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HyperToastsService, HyperCookieService, BroadcastEventService } from 'lib-services';
import { SharedService } from '@app-back-office/services/shared.service';
import { environment } from '@env/app-back-office';
import { MatDialog } from '@angular/material';
import { RequestFinancingComponent } from '@app-back-office/components/request-financing/request-financing.component';

@Component({
  selector: 'app-back-office-access-checkout',
  templateUrl: './access-checkout.component.html',
  styleUrls: ['./access-checkout.component.less']
})
export class AccessCheckoutComponent implements OnInit {

  private currentYear = (new Date()).getFullYear();
  public years: any = [];

  public idPlan: number;
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

  public crypto_coins: any = {};
  public transfer_bank: any = {};
  public ticket: any = {};
  public finace: any = {};

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

  public ticketChecked = [];
  public maskotoChecked = [];
  public livrosChecked = [];
  public k18Checked = [];

  public paymentCreditCard = false;
  public paymentCreditCardLink = false;
  public paymentTicket = false;
  public paymentBitcoin = false;
  public paymentTed = false;
  public paymentFinancing = false;
  public paymentEduzz = false;

  public bitCoin_url = '';
  public eduzz_url = '';
  public eduzz_plots = '';
  public eduzz_plots_value = '';

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
    private route: ActivatedRoute,
    private _sharedService: SharedService,
    private _hyperToastsService: HyperToastsService,
    private _router: Router,
    private _hyperCookieService: HyperCookieService,
    private _formBuilder: FormBuilder,
    private _formBuilder2: FormBuilder,
    private _dialog: MatDialog
  ) {

    this.mountYears();

    this.userObj = this._sharedService.getCookieReseller() || ''; // pega info do reseller

    this._sharedService.getinfoResseler().subscribe(response1 => {
      if (response1.return) {
        this.resellerObj = response1.data;
        if (this.resellerObj.cnpj_cpf === null || this.resellerObj.cnpj_cpf === undefined) {
          this.resellerObj.cnpj_cpf = '';
        }
        if (this.resellerObj.foreign_type == 'Y') {
          this.paymentTicket = false;
        }
        if (this.resellerObj.status == 'A') {
          this._sharedService.deleteAllCookies();
          this._router.navigate(['office/login']);
        }
        // console.log(this.resellerObj);
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


    this.route.parent.queryParams.subscribe(queryparams => { // pega id do plano
      this.idPlan = queryparams['plan'];
      // this.voucher = queryparams['voucher'];
    });

    this._sharedService.getInfoPlan(this.idPlan, 'office', this.voucher).subscribe(response2 => {
      if (response2.return) {

        this.plan = response2.data;
        this.amountPlan = this.plan.value;
        this.rates = JSON.parse(this.plan.rates);

        //console.log(this.plan.payment_methods);

        this.plan.accession_methods.forEach(element => {
          switch (element.method) {
            case 'credit_card':
              this.paymentCreditCard = true;
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
              this.eduzz_plots = element.info.plots;
              this.eduzz_plots_value = element.info.value_plots;
              break;
            case 'Financing':
              this.paymentFinancing = true;
              break;
          }
        });

        this.carregaPayment();

        //this.juros = 'Com juros'; // comentado a pedido do denis no skype dia 08/10/2018
        let label = '';
        const index = 1;
        for (let index = 1; index <= +this.plan.credit_card_max_plots; index++) {
          if (index === 1) {
            label = '1x Sem Juros ' + this.plan.symbol + (+this.plan.value / index).toFixed(2);
          } else {
            label = index + 'x ' + this.juros + ' ' + this.plan.symbol + ((+this.plan.value + (+this.plan.value * this.rates.find(x => x.plots == index).rate_percentage)) / index).toFixed(2);
          }
          const aux = {
            'value': index,
            'label': label
          };
          this.creditCardParcels.push(aux);
        }

        this.myCardsOK = true;
        this._sharedService.getMyCards().subscribe(response3 => {
          if (response3.return) {
            this.myCards = response3.data;
            this.myCardsOK = false;
          } else {
            this.myCards = {};
            this.myCardsOK = false;
          }
        },
          err => {
            this.myCardsOK = false;
            this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro inesperado. Atualize a página e tente novamente');
          });

        // if (this.paymentBitcoin) {
        //   // verificar pacotes de bitcoins ***************************************************************
        //   this._sharedService.getpackages('accession').subscribe(response6 => {
        //     if (response6.return) {
        //       this.paymentBitcoin = true;
        //       this.bitCoin = response6.data[0];
        //       this.amountBitcoin = this.bitCoin.value;
        //       // console.log(this.bitCoin);
        //     } else {
        //       this.paymentBitcoin = false;
        //     }
        //   },
        //     err => {
        //       this.paymentBitcoin = false;
        //       this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro inesperado. Atualize a página e tente novamente');
        //     }
        //   );
        //   // **********************************************************************************************
        // }

      } else {
        this._hyperToastsService.addToast('warn', 'Atenção', response2.msg);
        this._router.navigate(['office/access']); // plano inválido
      }
    },
      err => {
        this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro inesperado. Atualize a página e tente novamente');
        this._router.navigate(['office/access']); // plano inválido
      });


  }

  ngOnInit() {
    this.createForm();
  }

  carregaPayment() {
    //pega valores bitcoins mensal
    if (this.paymentBitcoin) {
      this._sharedService.getInfoPayments('crypto_coins', 'accession').subscribe(response7 => {
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
      this._sharedService.getInfoPayments('transfer_bank', 'accession').subscribe(response8 => {
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
      this._sharedService.getInfoPayments('ticket', 'accession').subscribe(response9 => {
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
    //pega financiamentos
    if (this.paymentFinancing) {
      this._sharedService.getInfoFinance().subscribe(response10 => {
        if (response10.return) {
          this.finace = response10.data;
          let idx = 0;
          this.finace.forEach(element => {
            this.finace[idx].request_date = new Date(element.request_date.replace(' ', 'T')).toLocaleDateString();
            idx++;
          });
          console.log(this.finace);
        } else {
          console.log('nenhum financiamento');
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

  addTicket() {
    if (this.ticketChecked.length > 0) {
      this.amountPlan = +this.amountPlan + 100;
      this.validabitcoin();
    } else if (this.ticketChecked.length <= 0) {
      this.validabitcoin();
      this.amountPlan = +this.amountPlan - 100;
    }
    this.monta_parcelamento_cartao(this.amountPlan);
  }

  addMaskoto() {
    if (this.maskotoChecked.length > 0) {
      this.amountPlan = +this.amountPlan + 152.30;
      this.validabitcoin();
    } else if (this.maskotoChecked.length <= 0) {
      this.amountPlan = +this.amountPlan - 152.30;
      this.validabitcoin();
    }
    this.monta_parcelamento_cartao(this.amountPlan);
  }

  addlivros() {
    if (this.livrosChecked.length > 0) {
      this.amountPlan = +this.amountPlan + 239.40;
      this.validabitcoin();
    } else if (this.livrosChecked.length <= 0) {
      this.amountPlan = +this.amountPlan - 239.40;
      this.validabitcoin();
    }
    this.monta_parcelamento_cartao(this.amountPlan);
  }

  add18k() {
    if (this.k18Checked.length > 0) {
      this.amountPlan = +this.amountPlan + 751.50;
      this.validabitcoin();
    } else if (this.k18Checked.length <= 0) {
      this.amountPlan = +this.amountPlan - 751.50;
      this.validabitcoin();
    }
    this.monta_parcelamento_cartao(this.amountPlan);
  }


  validabitcoin() {
    if (this.ticketChecked.length > 0 || this.maskotoChecked.length > 0 || this.livrosChecked.length > 0 || this.k18Checked.length > 0) {
      this.paymentBitcoin = false;
      this.paymentFinancing = false;
      this.paymentTicket = false;
    }
    if (this.ticketChecked.length <= 0 && this.maskotoChecked.length <= 0 && this.livrosChecked.length <= 0 && this.k18Checked.length <= 0) {
      this.paymentBitcoin = true;
      this.paymentFinancing = false;
      this.paymentTicket = true;
    }
  }

  monta_parcelamento_cartao(totalplano) {
    this.creditCardParcels = [];
    //this.juros = 'Com juros';
    let label = '';
    const index = 1;
    for (let index = 1; index <= +this.plan.credit_card_max_plots; index++) {
      if (index === 1) {
        label = '1x Sem Juros ' + this.plan.symbol + (+totalplano / index).toFixed(2);
      } else {
        label = index + 'x ' + this.juros + ' ' + this.plan.symbol + ((+totalplano + (+totalplano * this.rates.find(x => x.plots == index).rate_percentage)) / index).toFixed(2);
      }
      const aux = {
        'value': index,
        'label': label
      };
      this.creditCardParcels.push(aux);
    }
  }

  sendCard(obj) {
    const infos = {
      id: this.userObj.id,
      username: this.userObj.username,
      slug: 'office',
      id_plan: this.idPlan,
      // voucher: this.voucher,
      method: 'credit_card',
      document: this.resellerObj.cnpj_cpf,
      credit_card: {
        id: obj.id
      },
      number_plots: this.creditCardGroup.controls.numberOfParcels.value
    };
    this.checkout(infos);
  }

  sendPay(method) {

    // console.log(this.ticketGroup);

    this.sendpayOk = false;

    const infos = {
      id: this.userObj.id,
      username: this.userObj.username,
      slug: 'office',
      id_plan: this.idPlan,
      events: [...this.ticketChecked, ...this.maskotoChecked, ...this.livrosChecked, ...this.k18Checked],
      // voucher: this.voucher,
      method: method,
      document: this.resellerObj.cnpj_cpf,
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
    this.checkout(infos);
    // console.log(infos);
  }

  checkout(obj) {

    this._sharedService.accessPlanCheckout(obj).subscribe(response => {
      if (response.return) {
        this.sendpayOk = true;

        const cookieData = response.data;
        cookieData.JWT = response.JWT;
        this._hyperCookieService.setCookie_GENERIC(cookieData, environment.defaultCookieName);

        this._hyperToastsService.addToast('success', 'Sucesso', response.msg);

        BroadcastEventService.event('changestatus').emit(response.data.id);

        // console.log(response.data);

        if (obj.method === 'crypto_coins') {
          window.open(this.bitCoin_url, '_blank');
        }

        this._router.navigate(['office/checkout/success/'], {
          queryParams: {
            method: response.data.method,
          }
        });

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

  removeCard(obj) {
    this.delete = true;
    this._sharedService.removeCard(obj.id).subscribe(response => {
      if (response.return) {
        this.delete = false;
        if (obj.position !== -1) {
          this.myCards.splice(obj.position, 1); // retira do array
        }
        this._hyperToastsService.addToast('success', 'Sucesso', response.msg);
      } else {
        this.delete = false;
        this._hyperToastsService.addToast('warn', 'Atenção', response.msg);
      }
    },
      err => {
        this.delete = false;
        this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro inesperado. Atualize a página e tente novamente');
      }
    );
  }

  openModalFinancing() {

    if (!this.resellerObj.zipcode) {
      this._hyperToastsService.addToast('warn', 'Atenção', 'Conclua seu Cadastro com seu endereço no link do menu esquerdo, antes de solicitar o financiamento!');
    } else {
      this._router.navigate(['office/financing']);
    }

    // console.log(this.resellerObj);
    // if (!this.resellerObj.zipcode) {
    //   this._hyperToastsService.addToast('warn', 'Atenção', 'Conclua seu Cadastro com seu endereço no link do menu esquerdo, antes de solicitar o financiamento!');
    // } else {
    //   const dialogRef = this._dialog.open(RequestFinancingComponent,
    //     {
    //       panelClass: 'custom-dialog-container',
    //       data: {
    //         price: this.amountBitcoin,
    //         valueMin: 657
    //       }
    //     });
    //   dialogRef.afterClosed().subscribe(result => {
    //     if (result) {
    //       const obj = {
    //         name: this.resellerObj.name,
    //         email: this.resellerObj.email,
    //         cnpj_cpf: this.resellerObj.cnpj_cpf,
    //         value_buy: this.amountBitcoin,

    //         value_init: result.value_init,
    //         value_financing: result.value_financing,
    //         plots: result.plots,
    //         plotsObj: result.plotsObj
    //       };

    //       this._sharedService.solicitationFinancing(obj).subscribe(response => {
    //         if (response.return) {

    //           this._router.navigate(['office/financing'], {
    //             queryParams: {
    //               id_financing: response.data
    //             }
    //           });

    //         } else {
    //           this.check = false;
    //           this._hyperToastsService.addToast('warn', 'Atenção', response.msg); // pagamento reprovado
    //         }
    //       },
    //         err => {
    //           this.check = false;
    //           this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro inesperado. Atualize a página e tente novamente');
    //         }
    //       );
    //     }
    //   });
    // }
  }
}
