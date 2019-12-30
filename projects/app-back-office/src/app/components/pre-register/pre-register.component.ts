import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { PasswordValidation } from '@app-back-office/validator/password-validator';
import { ResellerRegister } from '@app-back-office/models/resellerregister';
import { ChangeDetectorRef } from '@angular/core';
import { environment } from '@env/app-back-office';
import { HyperToastsService, HyperCookieService } from 'lib-services';
import { SharedService } from '@app-back-office/services/shared.service';

@Component({
  selector: 'app-back-office-pre-register',
  templateUrl: './pre-register.component.html',
  styleUrls: ['./pre-register.component.less']
})
export class PreRegisterComponent implements OnInit {

  @Input() idParent: string;
  @Input() idParentName: string;
  @Input() idHost: string;
  @Input() resellerRequired: number;

  public DATEMASK = [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/];
  public CPFMASK = [/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/];
  public CELLPHONEMASK = ['(', /[1-9]/, /[1-9]/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];

  public DATE_REGEX: RegExp = /^(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.](19|20)\d\d$/;
  public CPF_REGEX: RegExp = /[0-9]{3}\.?[0-9]{3}\.?[0-9]{3}\-?[0-9]{2}/;
  public CELLPHONE_REGEX: RegExp = /^(?:\()[0-9]{2}(?:\))\s?9[0-9]{4}(?:-)[0-9]{4}$/;
  public EMAIL_REGEX: RegExp = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

  public formGroup1: FormGroup;
  public id_Parent = '';
  public id_Parent_name = '';

  // valida reseller
  public resellerLoading = false;
  public resellerCheck = false;
  public resellerCheckfalse = false;

  public validator = false;
  public registerok = false;

  public hide = false;
  public hide1 = false;

  public enableSend = false;
  public siteKey = environment.captcha_site_key;
  public secretKey = environment.captcha_secret_key;

  public isForeign = false;

  constructor(
    private _sharedService: SharedService,
    private _hyperToastsService: HyperToastsService,
    private _router: Router,
    private _fb: FormBuilder,
    private _hyperCookieService: HyperCookieService,
    private _ref: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.formGroup1 = this._fb.group({
      userResselerControl: ['', Validators.required],
      nameControl: ['', [Validators.required, Validators.minLength(6)]],
      cpfControl: ['', [Validators.required, Validators.pattern(this.CPF_REGEX)]],
      // dateControl: ['', [Validators.pattern(this.DATE_REGEX)]],
      //celularControl: ['', [Validators.required, Validators.pattern(this.CELLPHONE_REGEX)]],
      celularControl: ['', [Validators.required]],
      emailControl: ['', [Validators.required, Validators.pattern(this.EMAIL_REGEX)]],
      passControl: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassControl: ['', [Validators.required, Validators.minLength(6)]],
      ageValid: [false, [Validators.requiredTrue]],
      termoValid: [false, [Validators.requiredTrue]],
      foreignTypeDocumentControl: ['', [Validators.required]],
      foreignNumberDocument: ['', [Validators.required]],
    }, {
        validator: PasswordValidation.MatchPassword
      });

    if (this.resellerRequired !== 1) {
      this.formGroup1.controls.userResselerControl.setValidators(null);
      this.formGroup1.controls.userResselerControl.updateValueAndValidity();
    }

    if (this.idParent !== '') {
      this.id_Parent_name = this.idParentName;
      this.formGroup1.controls.userResselerControl.setValidators(null);
      this.formGroup1.controls.userResselerControl.updateValueAndValidity();
    }

    this.onForeign(false);
  }

  // validacao do reseller patrocinador
  resellerValidator() {
    if (this.formGroup1.controls.userResselerControl.value !== '') {
      this.resellerLoading = true;
      this.resellerCheck = false;
      this.resellerCheckfalse = false;

      this._sharedService.validadeReseller(this.formGroup1.controls.userResselerControl.value, 'office').subscribe(response => {
        if (response.return) {
          this.id_Parent = response.data.id;
          this.id_Parent_name = response.data.apelido ? response.data.apelido : response.data.name;
          this.resellerLoading = false;
          this.resellerCheck = true;
          this.resellerCheckfalse = false;
        } else {
          this._hyperToastsService.addToast('warn', 'Atenção', response.msg);
          this.formGroup1.controls.userResselerControl.setErrors({ 'resellervalidate': true }); // ativa validador
          this.resellerLoading = false;
          this.resellerCheck = false;
          this.resellerCheckfalse = true;
          this.id_Parent_name = '';
        }
      },
        err => {
          this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro inesperado. Atualize a página e tente novamente');
          this.formGroup1.controls.userResselerControl.setErrors({ 'resellervalidate': true }); // ativa validador
          this.resellerLoading = false;
          this.resellerCheck = false;
          this.resellerCheckfalse = true;
          this.id_Parent_name = '';
        }
      );
    } else {
      this.resellerLoading = false;
      this.resellerCheck = false;
      this.resellerCheckfalse = false;
      this.id_Parent_name = '';
    }

  }

  login() {
    this._router.navigate(['office/login']); // logar
  }

  saveForm() {
    this.registerok = true;

    const resellerRegister: ResellerRegister = {
      id_parent: this.idParent !== '' ? this.idParent : this.id_Parent,
      type: 'P',
      name: this.formGroup1.controls.nameControl.value,
      recognition_name: '',
      cnpj_cpf: this.formGroup1.controls.cpfControl.value,
      // birthday: this.formGroup1.controls.dateControl.value,
      cellphone: this.formGroup1.controls.celularControl.value,
      email: this.formGroup1.controls.emailControl.value,
      password: this.formGroup1.controls.passControl.value,
      foreign_type: 'N'
    };
    if (this.idHost) {
      resellerRegister.id_host = this.idHost;
    }

    if (this.isForeign) {
      resellerRegister.foreign_type = 'Y';
      resellerRegister.foreign_document_type = this.formGroup1.controls.foreignTypeDocumentControl.value;
      resellerRegister.foreign_document = this.formGroup1.controls.foreignNumberDocument.value;
      resellerRegister.cnpj_cpf = '';
    }


    this._sharedService.preRegisterReseller(resellerRegister).subscribe(
      response => {
        if (response.return) {
          this._hyperCookieService.deleteCookie_GENERIC(environment.defaultCookieName);
          this.registerok = false;
          const cookieData = response.data;
          cookieData.JWT = response.JWT;
          this._hyperCookieService.setCookie_GENERIC(cookieData, environment.defaultCookieName);

          this._hyperToastsService.addToast('success', 'Sucesso', response.msg);
          this._router.navigate(['office/access']); // selecionar plano
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

  showResponse(evt) {
    const obj = {
      secret: this.secretKey,
      response: evt.response
    };

    if (evt.response) {
      this._sharedService.reCaptcha(obj).subscribe(
        (response: any) => {
          if (response.return) {
            this.enableSend = response.data.success;
          } else {
            this.enableSend = false;
          }
        },
        err => {
          this.enableSend = false;
        }
      );
    }
  }

  onForeign(value) {
    if (value) {
      this.isForeign = true;
      this.formGroup1.controls.celularControl.setValue('');
      this.formGroup1.controls.foreignTypeDocumentControl.setValidators(Validators.required);
      this.formGroup1.controls.foreignTypeDocumentControl.updateValueAndValidity();

      this.formGroup1.controls.foreignNumberDocument.setValidators(Validators.required);
      this.formGroup1.controls.foreignNumberDocument.updateValueAndValidity();

      this.formGroup1.controls.cpfControl.setValidators(null);
      this.formGroup1.controls.cpfControl.updateValueAndValidity();
    } else {
      this.isForeign = false;
      this.formGroup1.controls.celularControl.setValue('');
      this.formGroup1.controls.foreignTypeDocumentControl.setValidators(null);
      this.formGroup1.controls.foreignTypeDocumentControl.updateValueAndValidity();

      this.formGroup1.controls.foreignNumberDocument.setValidators(null);
      this.formGroup1.controls.foreignNumberDocument.updateValueAndValidity();

      this.formGroup1.controls.cpfControl.setValidators([Validators.required, Validators.pattern(this.CPF_REGEX)]);
      this.formGroup1.controls.cpfControl.updateValueAndValidity();
    }
  }
}
