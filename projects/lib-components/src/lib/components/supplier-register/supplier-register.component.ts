import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SharedService } from '../../services/shared.service';
import { HyperToastsService, BroadcastEventService } from 'lib-services';
import { Router } from '@angular/router';

@Component({
  selector: 'lib-components-supplier-register',
  templateUrl: './supplier-register.component.html',
  styleUrls: ['./supplier-register.component.less']
})
export class SupplierRegisterComponent implements OnInit {
  public registerForm: FormGroup;
  public banks = [];
  public objBank = {
    accountname: '',
    ownername: '',
    agencynumber: '',
    ownerdocument: '',
    accountnumber: '',
    operation: '',
    idBank: ''
  };
  public banksInserted = [];

  public maskMoney = { prefix: 'R$ ', thousands: '.', decimal: ',' };

  @Output() onRegisterSupplier: EventEmitter<any> = new EventEmitter();

  constructor(
    private _router: Router,
    private _sharedService: SharedService,
    private _hyperToastsService: HyperToastsService
  ) { }

  ngOnInit() {
    this.mountRegisterForm();
    this.getSupplier();
    this.getBanks();
    const obj = [
      { 'text': 'Dashboard', 'router': '/home' },
      { 'text': 'Dados Fornecedor', 'router': '' }
    ];

    BroadcastEventService.event('onBreadCrumb').emit(obj);

  }

  mountRegisterForm() {
    this.registerForm = new FormGroup({
      id_user: new FormControl(this._sharedService.getUser().id),
      businessname: new FormControl(
        { value: '', disabled: false }, Validators.compose([Validators.required, Validators.minLength(6)])
      ),
      fantasyname: new FormControl(
        { value: '', disabled: false }, Validators.compose([Validators.required, Validators.minLength(6)])
      ),
      CNPJ: new FormControl(
        { value: '', disabled: false }
      ),
      CPF: new FormControl(
        { value: '', disabled: false }, Validators.compose([Validators.required])
      ),
      municipalnumber: new FormControl(
        { value: '', disabled: false }, Validators.compose([Validators.required])
      ),
      statenumber: new FormControl(
        { value: '', disabled: false }, Validators.compose([Validators.required])
      ),
      zipCode: new FormControl(
        { value: '', disabled: false }, Validators.compose([Validators.required])
      ),
      urlsite: new FormControl(
        { value: '', disabled: false }
      ),
      email: new FormControl(
        { value: '', disabled: false }, Validators.compose([Validators.required])
      ),
      shipp: new FormControl(
        { value: '', disabled: false }, Validators.compose([Validators.required])
      ),
      codCliente: new FormControl(
        { value: '', disabled: false }
      ),
      userCod: new FormControl(
        { value: '', disabled: false }
      ),
      password: new FormControl(
        { value: '', disabled: false }
      ),
      CEPOrigin: new FormControl(
        { value: '', disabled: false }, Validators.compose([Validators.required])
      ),
      CEPretirada: new FormControl(
        { value: '', disabled: false }, Validators.compose([Validators.required])
      ),
      acceptTerms: new FormControl(
        { value: false, disabled: false }, Validators.compose([Validators.requiredTrue])
      ),
      colect_value: new FormControl(
        { value: '', disabled: false }
      )
    });
  }
  changeLocal() {
    if (!this.registerForm.controls['shipp'].value.includes('RetirarNoLocal')) {
      this.registerForm.controls['CEPretirada'].disable();
    } else {
      this.registerForm.controls['CEPretirada'].enable();
    }
  }
  onSubmit() {
    if (this.registerForm.valid && this.banksInserted.length > 0) {
      this.registerForm.get('acceptTerms').value == true ? this.registerForm.get('acceptTerms').setValue('Y') : this.registerForm.get('acceptTerms').setValue('N');
      const obj = {
        ...this.registerForm.value,
        banks: this.banksInserted
      };
      this._sharedService.postSupplier(obj).subscribe(
        x => {
          if (x.return) {
            this._hyperToastsService.addToast('success', '', x.msg);
            this.onRegisterSupplier.emit(true);
          } else {
            this._hyperToastsService.addToast('warn', '', x.msg);
            this.registerForm.get('acceptTerms').setValue(false);
          }
        },
        err => {
          this._hyperToastsService.addToast('error', '', err.msg);
          this.registerForm.get('acceptTerms').setValue(false);

        });
    } else {
      this._hyperToastsService.addToast('warn', '', 'Verifique os dados preenchidos e tente novamente');
      this.registerForm.get('acceptTerms').setValue(false);

    }
  }

  findCep() {
    if (this.registerForm.get('zipCode').value !== '') {
      this._sharedService.getAddressCep(this.registerForm.get('zipCode').value).subscribe(response => {
        this.registerForm.get('municipalnumber').setValue(response.localidade);
        this.registerForm.get('statenumber').setValue(response.uf);
      },
        err => {
          console.log('CEP não encontrado');
        });
    }
  }

  getSupplier() {
    this._sharedService.getSupplier().subscribe(
      response => {
        if (response.return && response.data != '') {
          this.registerForm.get('CNPJ').setValue(response.data.CNPJ);
          this.registerForm.get('CPF').setValue(response.data.CPF);
          this.registerForm.get('businessname').setValue(response.data.businessname);
          this.registerForm.get('email').setValue(response.data.email);
          this.registerForm.get('fantasyname').setValue(response.data.fantasyname);
          this.registerForm.get('municipalnumber').setValue(response.data.municipalnumber);
          this.registerForm.get('statenumber').setValue(response.data.statenumber);
          this.registerForm.get('zipCode').setValue(response.data.zipCode);
          this.registerForm.get('CEPOrigin').setValue(response.data.shipp[0].CEPOrigin);
          response.data.acceptTerms == 'Y' ? this.registerForm.get('acceptTerms').setValue(true) : this.registerForm.get('acceptTerms').setValue(false);

          const aux = [];
          response.data.shipp.forEach(element => {
            aux.push(element.typeDelivery);
            if (element.typeDelivery == 'Jadlog') {
              this.registerForm.get('codCliente').setValue(element.codCliente);
              this.registerForm.get('userCod').setValue(element.userCod);
              this.registerForm.get('password').setValue(element.password);
              this.registerForm.get('colect_value').setValue(element.colect_value);
            }
            if (element.typeDelivery == 'RetirarNoLocal') {
              this.registerForm.get('CEPretirada').setValue(element.CEPOrigin);
            }
          });
          this.registerForm.get('shipp').setValue(aux);
          this.banksInserted = response.data.banks[0].idBank === null ? [] : response.data.banks;
          response.data.banks.forEach(element => {
            if (element.ownerdocument != null) {
              element.ownerdocument = element.ownerdocument.substring(0, element.ownerdocument.length - 4) + '****';
            }
          });
          this.changeLocal();
        } else {
          // this._hyperToastsService.addToast('error', '', response.msg);
        }
      },
      err => {
        this._hyperToastsService.addToast('error', '', err.msg);
      }
    );
  }

  getBanks() {
    this._sharedService.getBanks().subscribe(
      response => {
        if (response.return) {
          this.banks = response.data;
        }
      }
    );
  }

  addBank() {
    if (this.objBank.accountnumber != '' && this.objBank.agencynumber != '' && this.objBank.idBank != '' && this.objBank.ownerdocument != '') {
      this.banksInserted.push(this.objBank);
      this.objBank = {
        accountname: '',
        ownername: '',
        agencynumber: '',
        ownerdocument: '',
        accountnumber: '',
        operation: '',
        idBank: this.objBank.idBank
      };
    } else {
      this._hyperToastsService.addToast('warn', 'Atenção', 'Campo Numero da agencia ou Numero da conta deve ser preenchido');
    }
  }

  removeBank(evt) {
    const indexof = this.banksInserted.findIndex(x => x == evt);
    this.banksInserted.splice(indexof, 1);
  }
}
