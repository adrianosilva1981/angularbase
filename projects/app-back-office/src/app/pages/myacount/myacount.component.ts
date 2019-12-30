import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { ResellerRegister } from '@app-back-office/models/resellerregister';
import { Router } from '@angular/router';
import { HyperToastsService, HyperCookieService, BroadcastEventService } from 'lib-services';
import { environment } from '@env/app-back-office/';
import { SharedService } from '@app-back-office/services/shared.service';

@Component({
  selector: 'app-back-office-myacount',
  templateUrl: './myacount.component.html',
  styleUrls: ['./myacount.component.less']
})
export class MyacountComponent implements OnInit {

  public DATEMASK = [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/];
  public CPFMASK = [/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/];
  public CNPJMASK = [/\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/];
  public PHONEMASK = ['(', /[1-9]/, /[1-9]/, ')', ' ', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  public CELLPHONEMASK = ['(', /[1-9]/, /[1-9]/, ')', ' ', /9/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  public CEPMASK = [/\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/];

  public DATE_REGEX: RegExp = /^(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.](19|20)\d\d$/;
  public CPF_REGEX: RegExp = /[0-9]{3}\.?[0-9]{3}\.?[0-9]{3}\-?[0-9]{2}/;
  public CNPJ_REGEX: RegExp = /[0-9]{2}\.?[0-9]{3}\.?[0-9]{3}\/?[0-9]{4}\-?[0-9]{2}/;
  public PHONE_REGEX: RegExp = /^(?:\()[0-9]{2}(?:\))\s?9?[0-9]{4}(?:-)[0-9]{4}$/;
  public CELLPHONE_REGEX: RegExp = /^(?:\()[0-9]{2}(?:\))\s?9[0-9]{4}(?:-)[0-9]{4}$/;
  public CEP_REGEX: RegExp = /^[0-9]{5}-[0-9]{3}$/;

  public formGroup: FormGroup;

  public userinfoObj: any = {};
  public userObj: any = {};

  public resellerLoading = false;
  public resellerCheck = false;
  public resellerCheckfalse = false;

  public createform = false;
  public cep = {};
  public created: string;

  public married = '';
  public type = '';
  public convertType = '';

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

  public urlApiImage = environment.apiPhpV2 + 'tools/upload';

  constructor(
    private _router: Router,
    private _fb: FormBuilder,
    private _hyperToastsService: HyperToastsService,
    private _sharedService: SharedService,
    private _hyperCookieService: HyperCookieService
  ) {

    this.userObj = this._sharedService.getCookieReseller() || ''; // pega info do reseller

    this.getinfo();

  }

  ngOnInit() { }

  getinfo() {
    this._sharedService.getinfoResseler().subscribe(
      response => {
        if (response.return) {
          // console.log(response.data);
          this.userinfoObj = response.data;
          this.married = response.data.married;
          this.type = response.data.type;
          this.convertType = response.data.type;
          this.creatForm(this.userinfoObj);
          if (this.userinfoObj !== '') {
            this.created = this.convert_created(this.userinfoObj.created);
            this.createform = true;
          }
        } else {
          this._hyperToastsService.addToast('warn', 'Atenção', response.msg);
        }
      },
      err => {
        this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro inesperado. Atualize a página e tente novamente');
      }
    );
  }
  convert() {
    if (this.convertType == 'P') {
      this.convertType = 'B';
      this.formGroup.controls.typeControl.setValue('Pessoa Jurídica');

      this.formGroup.controls.nameSocialControl.setValidators([Validators.required]);
      this.formGroup.controls.cnpjControl.setValidators([Validators.required, Validators.pattern(this.CNPJ_REGEX)]);
      this.formGroup.controls.ieControl.setValidators([Validators.required, , Validators.minLength(6)]);

      this.formGroup.controls.name1Control.setValidators(null);
      this.formGroup.controls.cpf1Control.setValidators(null);
      this.formGroup.controls.rgControl.setValidators(null);
      this.formGroup.controls.dateControl.setValidators(null);

      this.formGroup.controls.name1Control.updateValueAndValidity();
      this.formGroup.controls.cpf1Control.updateValueAndValidity();
      this.formGroup.controls.rgControl.updateValueAndValidity();
      this.formGroup.controls.dateControl.updateValueAndValidity();
      this.formGroup.controls.nameSocialControl.updateValueAndValidity();
      this.formGroup.controls.cnpjControl.updateValueAndValidity();
      this.formGroup.controls.ieControl.updateValueAndValidity();

    } else {

      this.convertType = 'P';
      this.formGroup.controls.typeControl.setValue('Pessoa Física');

      this.formGroup.controls.rgControl.setValidators([Validators.required, , Validators.minLength(6)]);
      this.formGroup.controls.dateControl.setValidators([Validators.required, Validators.pattern(this.DATE_REGEX)]);

      if (this.formGroup.controls.marriedControl.value == 'N') {
        this.formGroup.controls.name1Control.setValidators([Validators.minLength(6)]);
        this.formGroup.controls.cpf1Control.setValidators([Validators.pattern(this.CPF_REGEX)]);
      } else {
        this.formGroup.controls.name1Control.setValidators([Validators.required, Validators.minLength(6)]);
        this.formGroup.controls.cpf1Control.setValidators([Validators.required, Validators.pattern(this.CPF_REGEX)]);
      }

      this.formGroup.controls.nameSocialControl.setValidators(null);
      this.formGroup.controls.cnpjControl.setValidators(null);
      this.formGroup.controls.ieControl.setValidators(null);

      this.formGroup.controls.name1Control.updateValueAndValidity();
      this.formGroup.controls.cpf1Control.updateValueAndValidity();
      this.formGroup.controls.rgControl.updateValueAndValidity();
      this.formGroup.controls.dateControl.updateValueAndValidity();
      this.formGroup.controls.nameSocialControl.updateValueAndValidity();
      this.formGroup.controls.cnpjControl.updateValueAndValidity();
      this.formGroup.controls.ieControl.updateValueAndValidity();
    }

    // console.log(this.convertType);
  }

  changeImageProfile(evt) {
    if (evt) {
      this.validateImageProfile(evt);
    } else {
      this._hyperToastsService.addToast('warn', 'Atenção', 'Não foi possivel realizar o upload da imagem');
    }
  }

  validateImageProfile(url) {
    const objPhoto = {
      urlImage: '//' + url
    };
    this._sharedService.updatePhotoProfile(objPhoto).subscribe(
      response => {
        if (response.return) {
          this._hyperToastsService.addToast('success', 'Sucesso', response.msg);
          this.userinfoObj.photo_profile = objPhoto.urlImage;
          BroadcastEventService.event('changestatus').emit(this.userObj.id);
          this.getinfo();
        } else {
          this._hyperToastsService.addToast('warn', 'Atenção', response.msg);
        }
      },
      err => {
        this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro inesperado. Atualize a página e tente novamente');
      }
    );
  }

  changeImageDocumentCpf(url) {
    // console.log(evt);
    if (url) {
      this.validateImageDocument(url, 'cpf');
    } else {
      this._hyperToastsService.addToast('warn', 'Atenção', 'Não foi possivel realizar o upload da imagem');
    }
  }

  changeImageDocumentCnpj(url) {
    // console.log(evt);
    if (url) {
      this.validateImageDocument(url, 'cnpj');
    } else {
      this._hyperToastsService.addToast('warn', 'Atenção', 'Não foi possivel realizar o upload da imagem');
    }
  }

  validateImageDocument(url, type) {
    const objPhoto = {
      type_document: type,
      url: '//' + url
    };
    // console.log(objPhoto);
    this._sharedService.validateImageDocument(objPhoto).subscribe(
      response => {
        if (response.return) {
          this._hyperToastsService.addToast('success', 'Sucesso', response.msg);
          BroadcastEventService.event('changestatus').emit(this.userObj.id);
          this.getinfo();
        } else {
          this._hyperToastsService.addToast('warn', 'Atenção', response.msg);
        }
      },
      err => {
        this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro inesperado. Atualize a página e tente novamente');
      }
    );
  }

  convert_created(date) {
    let texto = '';
    const mes = date.split('/');
    switch (mes[0]) {
      case '01': {
        texto = 'Janeiro';
        break;
      }
      case '02': {
        texto = 'Fevereiro';
        break;
      }
      case '03': {
        texto = 'Março';
        break;
      }
      case '04': {
        texto = 'Abril';
        break;
      }
      case '05': {
        texto = 'Maio';
        break;
      }
      case '06': {
        texto = 'Junho';
        break;
      }
      case '07': {
        texto = 'Julho';
        break;
      }
      case '08': {
        texto = 'Agosto';
        break;
      }
      case '09': {
        texto = 'Setembro';
        break;
      }
      case '10': {
        texto = 'Outubro';
        break;
      }
      case '11': {
        texto = 'Novembro';
        break;
      }
      case '12': {
        texto = 'Dezembro';
        break;
      }
    }
    return texto + ' de ' + mes[1];
  }


  // estado civil
  setMarried(type) {
    this.married = type;
    if (type == 'Y') {
      this.formGroup.controls.name1Control.setValidators([Validators.required, , Validators.minLength(6)]);
      this.formGroup.controls.cpf1Control.setValidators([Validators.required, , Validators.pattern(this.CPF_REGEX)]);
      this.formGroup.controls.name1Control.updateValueAndValidity();
      this.formGroup.controls.cpf1Control.updateValueAndValidity();
    } else if (type == 'N') {
      // form.controls.name1Control.setValue('');
      // form.controls.cpf1Control.setValue('');
      this.formGroup.controls.name1Control.setValidators([Validators.minLength(6)]);
      this.formGroup.controls.cpf1Control.setValidators([Validators.pattern(this.CPF_REGEX)]);
      this.formGroup.controls.name1Control.updateValueAndValidity();
      this.formGroup.controls.cpf1Control.updateValueAndValidity();
    }

  }

  creatForm(user) {
    this.formGroup = this._fb.group({
      nameControl: [user.name, [Validators.required, , Validators.minLength(6)]],
      phoneControl: [user.phone, [Validators.pattern(this.PHONE_REGEX)]],
      celularControl: [user.cellphone, [Validators.required, Validators.pattern(this.CELLPHONE_REGEX)]],
      emailControl: [user.email, [Validators.required, Validators.email]],

      nameknowControl: [user.recognition_name, [Validators.required, , Validators.minLength(6)]],
      genderControl: [user.gender, null],
      websiteControl: [user.website, null],

      typeControl: ['', null],
      cpfControl: ['', [Validators.required, Validators.pattern(this.CPF_REGEX)]],
      rgControl: ['', [Validators.required, , Validators.minLength(6)]],
      dateControl: ['', [Validators.required, Validators.pattern(this.DATE_REGEX)]],

      nameSocialControl: ['', Validators.required],
      cnpjControl: ['', [Validators.required, Validators.pattern(this.CNPJ_REGEX)]],
      ieControl: ['', [Validators.required, , Validators.minLength(6)]],

      marriedControl: [user.married],
      name1Control: [user.first_holder, [Validators.minLength(6)]],
      cpf1Control: [user.first_holder_document, [Validators.pattern(this.CPF_REGEX)]],

      // name2Control: [user.second_holder, null],
      // cpf2Control: [user.second_holder_document, null],

      cepControl: [user.zipcode, [Validators.required, Validators.pattern(this.CEP_REGEX)]],
      streetControl: [user.street, Validators.required],
      numberControl: [user.number, Validators.required],
      districtControl: [user.neighborhood, Validators.required],
      complementControl: [user.complement, null],
      cityControl: [user.city, Validators.required],
      stateControl: [user.state, Validators.required]

    });

    this.gettype(user);
  }

  gettype(user) {
    if (user.type === 'P') {
      this.formGroup.controls.typeControl.setValue('Pessoa Física');
      this.formGroup.controls.cpfControl.setValue(user.cnpj_cpf);
      this.formGroup.controls.rgControl.setValue(user.ie_rg);
      this.formGroup.controls.dateControl.setValue(user.birthday);

      this.formGroup.controls.cnpjControl.setValue('');
      this.formGroup.controls.nameSocialControl.setValue('');
      this.formGroup.controls.ieControl.setValue('');

      this.formGroup.controls.nameSocialControl.setValidators(null);
      this.formGroup.controls.nameSocialControl.updateValueAndValidity();
      this.formGroup.controls.cnpjControl.setValidators(null);
      this.formGroup.controls.cnpjControl.updateValueAndValidity();
      this.formGroup.controls.ieControl.setValidators(null);
      this.formGroup.controls.ieControl.updateValueAndValidity();

    } else {
      this.formGroup.controls.typeControl.setValue('Pessoa Jurídica');
      this.formGroup.controls.nameSocialControl.setValue(user.corporative_name);
      this.formGroup.controls.cnpjControl.setValue(user.cnpj_cpf);
      this.formGroup.controls.ieControl.setValue(user.ie_rg);

      this.formGroup.controls.cpfControl.setValue('');
      this.formGroup.controls.rgControl.setValue('');
      this.formGroup.controls.dateControl.setValue('');

      this.formGroup.controls.cpfControl.setValidators(null);
      this.formGroup.controls.cpfControl.updateValueAndValidity();
      this.formGroup.controls.rgControl.setValidators(null);
      this.formGroup.controls.rgControl.updateValueAndValidity();
      this.formGroup.controls.dateControl.setValidators(null);
      this.formGroup.controls.dateControl.updateValueAndValidity();

    }
  }

  getCEP() {
    if (this.formGroup.controls.cepControl.value !== '' && this.formGroup.controls.cepControl.valid) {
      this.resellerLoading = true;
      this.resellerCheck = false;
      this.resellerCheckfalse = false;
      this._sharedService.getCEP(this.formGroup.controls.cepControl.value).subscribe(response => {
        if (response.return) {

          this.cep = response.data;

          this.resellerLoading = false;
          this.resellerCheck = true;
          this.resellerCheckfalse = false;
          this.formGroup.controls.streetControl.setValue(response.data.logradouro);
          this.formGroup.controls.cityControl.setValue(response.data.localidade);
          this.formGroup.controls.districtControl.setValue(response.data.bairro);
          this.formGroup.controls.stateControl.setValue(response.data.uf);
          this.formGroup.controls.districtControl.updateValueAndValidity();
          this.formGroup.controls.cityControl.updateValueAndValidity();
          this.formGroup.controls.streetControl.updateValueAndValidity();
          this.formGroup.controls.stateControl.updateValueAndValidity();
        } else {
          this._hyperToastsService.addToast('warn', 'Atenção', response.msg);
          this.resellerLoading = false;
          this.resellerCheck = false;
          this.resellerCheckfalse = true;
          this.resetForm(this.formGroup);
        }
      },
        err => {
          this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro inesperado. Atualize a página e tente novamente');
          this.resellerLoading = false;
          this.resellerCheck = false;
          this.resellerCheckfalse = true;
          this.resetForm(this.formGroup);
        }
      );
    } else {
      this.resellerLoading = false;
      this.resellerCheck = false;
      this.resellerCheckfalse = true;
      this.resetForm(this.formGroup);
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

  countersign() {

    const obj = {
      email: this.userinfoObj.email
    };

    this._sharedService.forgotCounterSign(obj).subscribe(
      response => {
        if (response.return) {
          this._hyperToastsService.addToast('success', 'Sucesso', response.msg);
        } else {
          this._hyperToastsService.addToast('warn', 'Atenção', response.msg);
        }
      },
      err => {
        this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro inesperado. Atualize a página e tente novamente');
      }
    );
  }

  saveForm() {
    const resellerUpdate: ResellerRegister = {
      id: +this.userinfoObj.id,
      id_address: +this.userinfoObj.id_address,
      username: this.userinfoObj.username,

      name: this.userinfoObj.name, // nao altera
      recognition_name: this.formGroup.controls.nameknowControl.value,
      email: this.userinfoObj.email, // nao altera
      type: this.convertType,

      corporative_name: this.convertType == 'B' ? this.formGroup.controls.nameSocialControl.value : '',
      cnpj_cpf: this.convertType == 'P' ? this.formGroup.controls.cpfControl.value : this.formGroup.controls.cnpjControl.value,
      ie_rg: this.convertType == 'P' ? this.formGroup.controls.rgControl.value : this.formGroup.controls.ieControl.value,

      birthday: this.convertType == 'P' ? this.formGroup.controls.dateControl.value : '',
      gender: this.formGroup.controls.genderControl.value,
      married: this.convertType == 'P' ? this.formGroup.controls.marriedControl.value : 'N',
      first_holder: this.convertType == 'P' ? this.formGroup.controls.name1Control.value : '',
      first_holder_document: this.convertType == 'P' ? this.formGroup.controls.cpf1Control.value : '',

      phone: this.formGroup.controls.phoneControl.value,
      cellphone: this.formGroup.controls.celularControl.value,
      website: this.formGroup.controls.websiteControl.value,

      // second_holder: this.formGroup.controls.name2Control.value,
      // second_holder_document: this.formGroup.controls.cpf2Control.value,

      zipcode: this.formGroup.controls.cepControl.value,
      street: this.formGroup.controls.streetControl.value,
      number: this.formGroup.controls.numberControl.value,
      complement: this.formGroup.controls.complementControl.value,
      neighborhood: this.formGroup.controls.districtControl.value,
      city: this.formGroup.controls.cityControl.value,
      state: this.formGroup.controls.stateControl.value
    };

    // telefone fixo vazio
    if (this.formGroup.controls.phoneControl.value === '') {
      delete resellerUpdate.phone;
    }
    // web site vazio
    if (this.formGroup.controls.websiteControl.value === '') {
      delete resellerUpdate.website;
    }
    // complemento de endereço vazio
    if (this.formGroup.controls.complementControl.value === '') {
      delete resellerUpdate.complement;
    }

    // console.log(resellerUpdate);

    this._sharedService.updateReseller(resellerUpdate).subscribe(
      response => {
        if (response.return) {
          this._hyperToastsService.addToast('success', 'Sucesso', response.msg);
          // console.log(response.data);
          const cookieData = response.data;
          cookieData.JWT = response.JWT;
          this._hyperCookieService.setCookie_GENERIC(cookieData, environment.defaultCookieName);

          BroadcastEventService.event('changestatus').emit(this.userObj.id);

          this._router.navigate(['office/home']); // home

        } else {
          this._hyperToastsService.addToast('warn', 'Atenção', response.msg);
        }
      },
      err => {
        this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro inesperado. Atualize a página e tente novamente');
      }
    );

  }

}
