import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HyperToastsService, HyperCookieService, BroadcastEventService } from 'lib-services';
import { SharedService } from '@app-back-office/services/shared.service';

@Component({
  selector: 'app-back-office-financing-checkout',
  templateUrl: './financing-checkout.component.html',
  styleUrls: ['./financing-checkout.component.less']
})
export class FinancingCheckoutComponent implements OnInit {

  public financingOK = false;
  public objFinance: any = {};
  public objFinancing: any = {};
  public parcels = [];
  public maskMoney = { prefix: 'R$ ', thousands: '.', decimal: ',' };
  public valuePlan = 0;
  public valueMin = 0;
  public valueFinancing = 0;
  public maxPlots = 0;
  public nrPlots = 0;
  public plotsObj = [];

  public liberaBtn = true;

  private currentYear = (new Date()).getFullYear();
  public years: any = [];

  public resellerObj: any = {};
  public financing: any = {};
  public plan: any = '';

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

  public PaymentCard = false;
  public paymentTicket = false;
  public paymentBitcoin = false;
  public paymentTed = false;
  public paymentCredit = false;
  public bitCoin: any = {};

  public creditok = false;
  public credit: any = {};

  public amountPlanParcel = 0;
  public amountPlan = 0;
  public amountBitcoin = 0;
  public amountValue = 0;

  public creditCardGroup: FormGroup;
  public ticketGroup: FormGroup;

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
  ) {
    this.mountYears();

    this._sharedService.getinfoResseler().subscribe(response => {
      if (response.return) {
        this.resellerObj = response.data;
        // console.log(this.resellerObj);
        if (this.resellerObj.foreign_type == 'Y') {
          this.paymentTicket = false;
        }
      } else {
        this.paymentTicket = false;
        this._hyperToastsService.addToast('warn', 'Atenção', response.msg);
        this._router.navigate(['office/login']); // usuario inválido
      }
    },
      err => {
        this.paymentTicket = false;
        this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro inesperado. Atualize a página e tente novamente');
        this._router.navigate(['office/login']); // usuario inválido
      });


    this._sharedService.getInfoPlan('1', 'office', '').subscribe(response1 => {
      if (response1.return) {

        this.plan = response1.data;

        // ***** pegar info geral de financiamento ****/
        this._sharedService.getFinance(this.objFinancing).subscribe(response2 => {
          if (response2.return) {
            // console.log(response2.data);

            this.financingOK = true;
            this.objFinance = response2.data;
            this.valuePlan = response2.data.value;
            this.valueMin = response2.data.min_init;
            this.valueFinancing = this.valuePlan - this.valueMin;
            this.maxPlots = response2.data.max_plots;
            this.nrPlots = response2.data.installment[0].plot;

            let label = '';
            for (let index = 1; index <= this.maxPlots; index++) {
              label = index + 'x ';
              const aux = {
                'value': index,
                'label': label
              };
              this.parcels.push(aux);
            }

            this.plotsObj = [];
            this.plotsObj.push({
              plot: response2.data.installment[0].plot,
              paymentDate: new Date(response2.data.installment[0].paymentdate.replace(' ', 'T')).toLocaleDateString(),
              value: response2.data.installment[0].value
            });
        
            this.paymentTicket = true;
           
            const aux = {
              'value': 1,
              'label': '1x Sem Juros R$' + (+this.valueMin).toFixed(2)
            };
            this.creditCardParcels.push(aux);

          } else {
            this._hyperToastsService.addToast('warn', 'Atenção', response2.msg);
          }
        },
          err => {
            this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro inesperado. Atualize a página e tente novamente');
          }
        );
        /**********************************************/

      } else {
        this._hyperToastsService.addToast('warn', 'Atenção', response1.msg);
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

  changeValueMin() {
    if (+this.valueMin < +this.objFinance.min_init) {
      this.valueMin = this.objFinance.min_init;
    }
    if (+this.valueMin >= +this.valuePlan) {
      this.valueMin = this.valuePlan - 1;
    }
    this.valueFinancing = this.valuePlan - this.valueMin;
    this.mountPlots();

    this.creditCardParcels = [];
    const aux = {
      'value': 1,
      'label': '1x Sem Juros R$' + (+this.valueMin).toFixed(2)
    };
    this.creditCardParcels.push(aux);
  }

  changePlots(value) {
    this.nrPlots = value;
    this.mountPlots();
  }

  mountPlots() {
    this.objFinancing = {
      value: this.valueMin,
      plots: this.nrPlots
    };

    this._sharedService.getFinance(this.objFinancing).subscribe(response3 => {
      if (response3.return) {
        // console.log(response3.data);
        this.plotsObj = [];
        for (let i = 0; i < response3.data.installment.length; i++) {
          this.plotsObj.push({
            plot: response3.data.installment[i].plot,
            paymentDate: new Date(response3.data.installment[i].paymentdate.replace(' ', 'T')).toLocaleDateString(),
            value: response3.data.installment[i].value
          });
        }
      } else {
        this._hyperToastsService.addToast('warn', 'Atenção', response3.msg);
      }
    },
      err => {
        this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro inesperado. Atualize a página e tente novamente');
        this._router.navigate(['office/access']); // plano inválido
      });
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

          // console.log(this.ticketGroup);

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

    this.liberaBtn = false;

    if (!this.resellerObj.zipcode) {
      this._hyperToastsService.addToast('warn', 'Atenção', 'Conclua seu Cadastro com seu endereço no link do menu esquerdo, antes de solicitar o financiamento!');
    } else {

      // console.log(this.ticketGroup);
      const infos = {
        id_plan: 1,
        method: method,
        document: this.resellerObj.cnpj_cpf,
        credit_card: {
          id: '',
          number: this.creditCardGroup.controls.cardNumber.value,
          cvv: this.creditCardGroup.controls.cardCVV.value,
          holder_name: this.creditCardGroup.controls.cardName.value,
          expiration: this.creditCardGroup.controls.cardMonth.value + '/' + this.creditCardGroup.controls.cardYear.value,
        },
        number_plots: this.nrPlots,
        value_init: this.valueMin,

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
  }

  checkout(obj) {
    this._sharedService.accessFinancingCheckout(obj).subscribe(response => {
      if (response.return) {

        this._hyperToastsService.addToast('success', 'Parabéns', response.msg); // pagamento reprovado

        this._router.navigate(['office/checkout/success/'], {
          queryParams: {
            method: obj.method,
            financing: 'Y'
          }
        });

        this.liberaBtn = true;

      } else {
        this.liberaBtn = true;
        this._hyperToastsService.addToast('warn', 'Atenção', response.msg); // pagamento reprovado
      }
    },
      err => {
        this.liberaBtn = true;
        this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro inesperado. Atualize a página e tente novamente');
      }// erro no pagamento
    );
  }




}
