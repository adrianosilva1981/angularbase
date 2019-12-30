import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { CropperSettings } from 'ng2-img-cropper';
import { ResellerRegister } from '@app-back-office/models/resellerregister';
import { HyperToastsService, HyperCookieService, BroadcastEventService } from 'lib-services';
import { SharedService } from '@app-back-office/services/shared.service';
import { environment } from '@env/app-back-office';

@Component({
  selector: 'app-back-office-register-reseller',
  templateUrl: './register-reseller.component.html',
  styleUrls: ['./register-reseller.component.less']
})
export class RegisterResellerComponent implements OnInit {

  public DATEMASK = [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/];
  public CPFMASK = [/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/];
  public CNPJMASK = [/\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/];
  public PHONEMASK = ['(', /[1-9]/, /[1-9]/, ')', ' ', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  public CELLPHONEMASK = ['(', /[1-9]/, /[1-9]/, ')', ' ', /9/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  public CEPMASK = [/\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/];

  public CPF_REGEX: RegExp = /^[0-9]{3}\.?[0-9]{3}\.?[0-9]{3}\-?[0-9]{2}$/;
  public CNPJ_REGEX: RegExp = /^[0-9]{2}\.?[0-9]{3}\.?[0-9]{3}\/?[0-9]{4}\-?[0-9]{2}$/;
  public DATE_REGEX: RegExp = /^(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.](19|20)\d\d$/;
  public PHONE_REGEX: RegExp = /^(?:\()[0-9]{2}(?:\))\s?9?[0-9]{4}(?:-)[0-9]{4}$/;
  public CELLPHONE_REGEX: RegExp = /^(?:\()[0-9]{2}(?:\))\s?9[0-9]{4}(?:-)[0-9]{4}$/;
  public CEP_REGEX: RegExp = /^[0-9]{5}-[0-9]{3}$/;

  public formAddress = false;
  // public termoValid = false;

  public isLinear = true;
  public formGroup1: FormGroup;
  public formGroup2: FormGroup;
  public formGroup3: FormGroup;
  // public formGroup4: FormGroup;
  public formGroup5: FormGroup;

  public cep = {};
  public userObj: any;
  public userObjid: any;
  public resellerLoading = false;
  public resellerCheck = false;
  public resellerCheckfalse = false;

  public registerok = false;

  public married: string;

  // cropper passo 5
  data: any;
  cropperSettings: CropperSettings;

  public PERSON_TYPE = {
    PF: 'P',
    PJ: 'B'
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

  constructor(
    private _hyperToastsService: HyperToastsService,
    private _sharedService: SharedService,
    private _fb: FormBuilder,
    private _router: Router,
    private _hyperCookieService: HyperCookieService
  ) {
    this.userObjid = this._sharedService.getCookieReseller() || ''; // pega info do reseller
    BroadcastEventService.event('changeLink').emit('register');

    this._sharedService.getinfoResseler().subscribe(response1 => {
      if (response1.return) {
        this.userObj = response1.data;
        // console.log(this.userObj);
      } else {
        this._hyperToastsService.addToast('warn', 'Atenção', response1.msg);
        this._router.navigate(['office/login']); // usuario inválido
      }
    },
      err => {
        this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro inesperado. Atualize a página e tente novamente');
        this._router.navigate(['office/login']); // usuario inválido
      });

  }

  ngOnInit() {

    // ********* step 1 ********* //

    this.formGroup3 = this._fb.group({
      nameknowControl: ['', [Validators.required, , Validators.minLength(6)]],
      phoneControl: ['', [Validators.pattern(this.PHONE_REGEX)]],
      websiteControl: [''],
      typeControl: this._fb.group({
        type: ['', [Validators.required]],
        PF: this._fb.group(this.initPFModel()),
        PJ: this._fb.group(this.initPJModel())
      })
    });
    this.subscribeTypePersonChanges();

    // ********* step 2 ********* //
    this.formGroup5 = this._fb.group({
      cepControl: ['', [Validators.required, Validators.pattern(this.CEP_REGEX)]],
      streetControl: ['', Validators.required],
      numberControl: ['', Validators.required],
      districtControl: ['', Validators.required],
      complementControl: [''],
      cityControl: ['', Validators.required],
      stateControl: ['', Validators.required]
    });

  }

  initPFModel() {
    const model = {
      cpfControl: ['', [Validators.required, , Validators.pattern(this.CPF_REGEX)]],
      dateControl: ['', [Validators.required, , Validators.pattern(this.DATE_REGEX)]],
      rgControl: ['', [Validators.required, , Validators.minLength(6)]],
      genderControl: ['M'],
      marriedControl: ['N'],
      name1Control: ['', [Validators.minLength(6)]],
      cpf1Control: ['', [Validators.pattern(this.CPF_REGEX)]],
    };
    return model;
  }

  initPJModel() {
    const model = {
      nameSocialControl: ['', [Validators.required, , Validators.minLength(6)]],
      cnpjControl: ['', [Validators.required, Validators.pattern(this.CNPJ_REGEX)]],
      ieControl: ['', [Validators.required, , Validators.minLength(6)]],
    };
    return model;
  }

  changeType(type: string) {
    const ctrl: FormControl = (<any>this.formGroup3).controls.typeControl.controls.type;
    ctrl.setValue(type);
  }

  subscribeTypePersonChanges() {
    // controls
    const personCtrl = (<any>this.formGroup3).controls.typeControl;
    const pfCtrl = personCtrl.controls.PF;
    const pjCtrl = personCtrl.controls.PJ;

    // initialize value changes stream
    const changes$ = personCtrl.controls.type.valueChanges;

    // subscribe to the stream
    changes$.subscribe(personType => {
      if (personType === this.PERSON_TYPE.PF) {
        Object.keys(pfCtrl.controls).forEach(key => {
          pfCtrl.controls[key].setValidators(this.initPFModel()[key][1]);
          pfCtrl.controls[key].updateValueAndValidity();
        });
        Object.keys(pjCtrl.controls).forEach(key => {
          pjCtrl.controls[key].setValidators(null);
          pjCtrl.controls[key].updateValueAndValidity();
        });
        pfCtrl.get('cpfControl').setValue(this.userObj.cnpj_cpf); //setar cpf
      }
      if (personType === this.PERSON_TYPE.PJ) {
        Object.keys(pfCtrl.controls).forEach(key => {
          pfCtrl.controls[key].setValidators(null);
          pfCtrl.controls[key].updateValueAndValidity();
        });
        Object.keys(pjCtrl.controls).forEach(key => {
          pjCtrl.controls[key].setValidators(this.initPJModel()[key][1]);
          pjCtrl.controls[key].updateValueAndValidity();
        });
      }
    });
  }

  // *****************************************************************************************

  // ******************** buscar CEP ************************

  getCEP() {
    if (this.formGroup5.controls.cepControl.value !== '' && this.formGroup5.controls.cepControl.valid) {

      this.resellerLoading = true;
      this.resellerCheck = false;
      this.resellerCheckfalse = false;

      this._sharedService.getCEP(this.formGroup5.controls.cepControl.value).subscribe(response => {
        if (response.return) {
          this.formAddress = true;
          this.resellerLoading = false;
          this.resellerCheck = true;
          this.resellerCheckfalse = false;

          this.cep = response.data;

          this.formGroup5.controls.streetControl.setValue(response.data.logradouro);
          this.formGroup5.controls.cityControl.setValue(response.data.localidade);
          this.formGroup5.controls.districtControl.setValue(response.data.bairro);
          this.formGroup5.controls.stateControl.setValue(response.data.uf);
          this.formGroup5.controls.districtControl.updateValueAndValidity();
          this.formGroup5.controls.cityControl.updateValueAndValidity();
          this.formGroup5.controls.streetControl.updateValueAndValidity();
          this.formGroup5.controls.stateControl.updateValueAndValidity();


        } else {
          this._hyperToastsService.addToast('warn', 'Atenção', response.msg);
          this.formAddress = false;
          this.resellerLoading = false;
          this.resellerCheck = false;
          this.resellerCheckfalse = true;
          this.resetForm(this.formGroup5);
        }
      },
        err => {
          this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro inesperado. Atualize a página e tente novamente');
          this.formAddress = false;
          this.resellerLoading = false;
          this.resellerCheck = false;
          this.resellerCheckfalse = true;
          this.resetForm(this.formGroup5);
        }
      );
    } else {
      this.formAddress = false;
      this.resellerLoading = false;
      this.resellerCheck = false;
      this.resellerCheckfalse = true;
      this.resetForm(this.formGroup5);
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

  // estado civil
  setMarried(type) {
    this.married = type;
    // console.log(this.married);
    const ctrlPF: FormGroup = (<any>this.formGroup3).controls.typeControl.controls.PF;

    if (type == 'Y') {
      ctrlPF.controls.name1Control.setValidators([Validators.required, , Validators.minLength(6)]);
      ctrlPF.controls.cpf1Control.setValidators([Validators.required, , Validators.pattern(this.CPF_REGEX)]);
      ctrlPF.controls.name1Control.updateValueAndValidity();
      ctrlPF.controls.cpf1Control.updateValueAndValidity();
    } else if (type == 'N') {
      ctrlPF.controls.name1Control.setValue('');
      ctrlPF.controls.cpf1Control.setValue('');
      ctrlPF.controls.name1Control.setValidators([Validators.minLength(6)]);
      ctrlPF.controls.cpf1Control.setValidators([Validators.pattern(this.CPF_REGEX)]);
      ctrlPF.controls.name1Control.updateValueAndValidity();
      ctrlPF.controls.cpf1Control.updateValueAndValidity();
    }

  }

  // **************** salvar formulario *********************
  saveForm() {

    this.registerok = true;

    const ctrltype: FormControl = (<any>this.formGroup3).controls.typeControl.controls.type;
    const ctrlPF: FormGroup = (<any>this.formGroup3).controls.typeControl.controls.PF;
    const ctrlPJ: FormGroup = (<any>this.formGroup3).controls.typeControl.controls.PJ;

    const resellerUpdate: ResellerRegister = {

      id: +this.userObj.id,
      username: this.userObj.username,

      recognition_name: this.formGroup3.controls.nameknowControl.value,
      phone: this.formGroup3.controls.phoneControl.value,
      website: this.formGroup3.controls.websiteControl.value,

      type: ctrltype.value,

      corporative_name: ctrltype.value == 'B' ? ctrlPJ.controls.nameSocialControl.value : '',
      cnpj_cpf: ctrltype.value == 'B' ? ctrlPJ.controls.cnpjControl.value : ctrlPF.controls.cpfControl.value,
      ie_rg: ctrltype.value == 'B' ? ctrlPJ.controls.ieControl.value : ctrlPF.controls.rgControl.value,
      birthday: ctrltype.value == 'P' ? ctrlPF.controls.dateControl.value : '',
      gender: ctrltype.value == 'P' ? ctrlPF.controls.genderControl.value : 'M',
      married: ctrltype.value == 'P' ? ctrlPF.controls.marriedControl.value : 'N',
      first_holder: ctrltype.value == 'P' ? ctrlPF.controls.name1Control.value : '',
      first_holder_document: ctrltype.value == 'P' ? ctrlPF.controls.cpf1Control.value : '',

      second_holder: '',
      second_holder_document: '',
      // second_holder: this.formGroup4.controls.name2Control.value,
      // second_holder_document: this.formGroup4.controls.cpf2Control.value,

      street: this.formGroup5.controls.streetControl.value,
      number: this.formGroup5.controls.numberControl.value,
      complement: this.formGroup5.controls.complementControl.value,
      neighborhood: this.formGroup5.controls.districtControl.value,
      city: this.formGroup5.controls.cityControl.value,
      state: this.formGroup5.controls.stateControl.value,
      zipcode: this.formGroup5.controls.cepControl.value,

      photo_profile: ''
    };

    // telefone fixo vazio
    if (this.formGroup3.controls.phoneControl.value === '') {
      delete resellerUpdate.phone;
    }
    // web site vazio
    if (this.formGroup3.controls.websiteControl.value === '') {
      delete resellerUpdate.website;
    }
    // complemento de endereço vazio
    if (this.formGroup5.controls.complementControl.value === '') {
      delete resellerUpdate.complement;
    }

    this._sharedService.registerReseller(resellerUpdate).subscribe(
      response => {

        if (response.return) {
          // console.log(response.data);
          this.registerok = false;

          const cookieData = response.data;
          cookieData.JWT = response.JWT;
          this._hyperCookieService.setCookie_GENERIC(cookieData, environment.defaultCookieName);

          BroadcastEventService.event('changestatus').emit(this.userObj.id);

          this._hyperToastsService.addToast('success', 'Sucesso', response.msg);

          this._router.navigate(['office/home']); // home

        } else {
          this.registerok = false;
          this._hyperToastsService.addToast('warn', 'Atenção', response.msg);
        }
      },
      err => {
        this.registerok = false;
        this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro inesperado. Atualize a página e tente novamente');
      }
    );

  }


}
