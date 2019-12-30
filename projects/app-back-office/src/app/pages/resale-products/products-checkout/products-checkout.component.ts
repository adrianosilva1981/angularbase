import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedService } from '@app-back-office/services/shared.service';
import { HyperToastsService } from 'lib-services';
import { MatDialog } from '@angular/material';
import { InfoPackComponent } from '@app-back-office/components/modals/info-pack/info-pack.component';


@Component({
  selector: 'app-back-office-products-checkout',
  templateUrl: './products-checkout.component.html',
  styleUrls: ['./products-checkout.component.less']
})
export class ProductsCheckoutComponent implements OnInit {

  public cardMask = [/\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  public CEPMASK = [/\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/];
  public CPFMASK = [/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/];

  public CPF_REGEX: RegExp = /[0-9]{3}\.?[0-9]{3}\.?[0-9]{3}\-?[0-9]{2}/;
  public CEP_REGEX: RegExp = /^[0-9]{5}-[0-9]{3}$/;
  public REGEX_ONLY_NYMBERS: RegExp = /^[0-9]*$/;

  private currentYear = (new Date()).getFullYear();
  public years: any = [];

  public idEvent: string;
  public eventName: string;
  public eventValue: number;
  public eventDescription: string;
  public eventImage: string;

  public creditCardGroup: FormGroup;
  public ticketGroup: FormGroup;

  public event: any = {};

  public resellerObj: any = {};

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

  public paymentCard = true;
  public paymentTicket = false;
  public paymentBitcoin = false;
  public paymentCredit = true;
  public bitCoin: any = {};

  public creditok = false;
  public credit: any = {};

  public rates: any = {};

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
    public _dialog: MatDialog,
    private _route: ActivatedRoute,
    private _sharedService: SharedService,
    private _hyperToastsService: HyperToastsService,
    private _router: Router,
    private _formBuilder: FormBuilder,
    private _formBuilder2: FormBuilder,
  ) {

    this.mountYears();

    this._route.parent.queryParams.subscribe(queryparams => { // pega id do plano
      this.idEvent = queryparams['idevent'];
    });

    this._sharedService.getinfoResseler().subscribe(response1 => {
      if (response1.return) {
        this.resellerObj = response1.data;


        switch (this.idEvent) {
          case '1':
            this.eventName = 'Ingresso para Convenção';
            this.eventValue = 200;
            this.eventDescription = '';
            this.eventImage = '';
            break;
          case '2':
            this.eventName = 'Pack de Produtos Pet Shop';
            this.eventValue = 152.30;
            this.eventDescription = '32 Produtos + Frete Grátis';
            this.eventImage = 'assets/img/PACKMASKOTO.png';
            break;
          case '3':
            this.eventName = 'Pack Livros Infantis';
            this.eventValue = 239.40;
            this.eventDescription = '10 Livros Infantis Personalizados  + Frete Grátis';
            this.eventImage = 'assets/img/livro.jpg';
            break;
          case '4':
            this.eventName = 'Pack de Produtos Pet Shop';
            this.eventValue = 357.32;
            this.eventDescription = '68 Produtos + Frete Grátis';
            this.eventImage = 'assets/img/PACKMASKOTO2.png';
            break;
          case '5':
            this.eventName = 'Pack de Produtos Pet Shop';
            this.eventValue = 730.00;
            this.eventDescription = '136 Produtos + Frete Grátis';
            this.eventImage = 'assets/img/PACKMASKOTO3.png';
            break;
          case '6':
            this.eventName = 'Pack 18K Ronaldinho';
            this.eventValue = 731.50;
            this.eventDescription = '6 Produtos + Frete Grátis';
            this.eventImage = 'assets/img/18kronaldinho.jpg';
            break;
          case '7':
            this.eventName = 'Imersão One Vision';
            this.eventValue = 600.00;
            this.eventDescription = 'Ingresso One Vision = 250 pontos';
            this.eventImage = 'assets/img/imersao_one_vision.png';
            break;
            case '8':
            this.eventName = 'Lançamento Oficial Campus Rainmakers Alfenas';
            this.eventValue = 150.00;
            this.eventDescription = '';
            this.eventImage = 'assets/img/popup_ev_0811.jpg';
            break;
          default:
            this._hyperToastsService.addToast('warn', 'Atenção', 'Produto não encontrado');
            this._router.navigate(['office/product']); // usuario inválido
            break;
        }

        this._sharedService.getInfoPlan(1, 'office', '').subscribe(response2 => {
          if (response2.return) {
            this.rates = JSON.parse(response2.data.rates);

            this.juros = 'Com juros';
            let label = '';
            //const index = 1;
            for (let index = 1; index <= 5; index++) {
              if (index === 1) {
                label = '1x Sem Juros R$' + (+this.eventValue / index).toFixed(2);
              } else {
                label = index + 'x ' + this.juros + ' R$' + ((+this.eventValue + (+this.eventValue * this.rates.find(x => x.plots == index).rate_percentage)) / index).toFixed(2);
              }
              const aux = {
                'value': index,
                'label': label
              };
              this.creditCardParcels.push(aux);
            }

            this.getCredit();

            this.event = {
              name: this.eventName,
              value: this.eventValue,
              description: this.eventDescription,
              image: this.eventImage
            };

            this.createForm();


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
        this._hyperToastsService.addToast('warn', 'Atenção', response1.msg);
        this._router.navigate(['office/login']); // usuario inválido
      }
    },
      err => {
        this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro inesperado. Atualize a página e tente novamente');
        this._router.navigate(['office/login']); // usuario inválido
      });




    // está manual porque nao existe um servico somente para pegar as taxas.
    // this.rates = [{ plots: 1, rate_percentage: 0.000 },
    // { plots: 2, rate_percentage: 0.0648 },
    // { plots: 3, rate_percentage: 0.1021 },
    // { plots: 4, rate_percentage: 0.1394 },
    // { plots: 5, rate_percentage: 0.1767 }
    // ];

  }

  ngOnInit() { }

  getCredit() {
    this.creditok = false;
    this._sharedService.getCredit().subscribe(
      response => {
        // console.log(response);
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

      if (this.resellerObj.cpf !== '' && this.resellerObj.cpf !== null && this.resellerObj.cpf !== undefined) {
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

  modalPack(imagem) {
    const dialogRef = this._dialog.open(InfoPackComponent, {
      data: { image: imagem },
    });
    dialogRef.afterClosed().subscribe(
      result => { });
  }


  sendPay(method) {
    // console.log(this.resellerObj.zipcode);

    if (this.resellerObj.zipcode == '') {
      this._hyperToastsService.addToast('warn', 'Atenção', 'Endereço Inválido!');
    } else {

      // console.log(this.ticketGroup);
      const infos = {
        id_event: this.idEvent,
        qtd: 1,
        method: method,
        number_plots: this.creditCardGroup.controls.numberOfParcels.value,
        credit_card: {
          id: '',
          number: this.creditCardGroup.controls.cardNumber.value,
          cvv: this.creditCardGroup.controls.cardCVV.value,
          holder_name: this.creditCardGroup.controls.cardName.value,
          expiration: this.creditCardGroup.controls.cardMonth.value + '/' + this.creditCardGroup.controls.cardYear.value,
        },
        document: this.resellerObj.cnpj_cpf,
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
    this.check = true;
    this._sharedService.postCheckoutEvent(obj).subscribe(response => {
      // console.log(response);
      if (response.return) {
        this.check = false;
        this._hyperToastsService.addToast('success', 'Sucesso', response.msg);
        this._router.navigate(['office/product-mypurchase'], {
          queryParams: {
            method: response.data.method,
          }
        });
      } else {
        this.check = false;
        this._hyperToastsService.addToast('warn', 'Atenção', response.msg); // pagamento reprovado
      }
    },
      err => {
        this.check = false;
        this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro inesperado. Atualize a página e tente novamente');
      }// erro no pagamento
    );
  }
}
