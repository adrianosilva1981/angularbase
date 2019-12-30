import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HyperToastsService } from 'lib-services';
import { Router, ActivatedRoute } from '@angular/router';
import { SharedService } from '@app-hyper-store/services/shared.service';

@Component({
  selector: 'app-hyper-store-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.less']
})
export class CompanyComponent implements OnInit {


  public invalidMetaInfo = false;
  public idSupplier: any;
  public objCategories: any;
  public cepAdd;

  public registerForm: FormGroup;
  public companyEdit: any;

  public arrayBoxGroupInvalid: any = [];
  public selectedCat = [];
  public listAddress = [];
  public colsAddress = [
    { field: 'zipcode', header: 'CEP' },
    { field: 'street', header: 'Endereço' },
    { field: 'neighborhood', header: 'Bairro' },
    { field: 'state', header: 'Estado' },
    { field: 'city', header: 'Cidade' },
    { field: 'number', header: 'Número' },
    { field: 'complement', header: 'Complemento' }
  ];

  // mediasForm
  public buttonTextUpload = '<i class="fas fa-plus"></i><span> Adicionar imagens</span>';
  public urlRequest = '';
  public pathBucket = '';

  public CELLPHONEMASK = ['(', /[1-9]/, /[1-9]/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  public CELLPHONE_REGEX: RegExp = /^(?:\()[0-9]{2}(?:\))\s?9[0-9]{4}(?:-)[0-9]{4}$/;

  public listCellPhone = [];

  public catPromise: Promise<any>;
  public selectedCategory = [];

  public show = true;
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

  constructor(
    @Inject('environments') private environment: any,
    private _sharedService: SharedService,
    private _hyperToastsService: HyperToastsService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this._sharedService.addBreadCrumb(
      [
        { 'text': 'Dashboard', 'router': '/supplier/dash' },
        { 'text': 'Registrar Estabelecimento', 'router': '' }
      ]
    );

    this.supplierId();
    this.getCategories();
    this.getBanks();

    this.urlRequest = this.environment.apiPhpV2 + 'tools/upload';
    this.pathBucket = 'companies';
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
    if (this.objBank.accountnumber != '' && this.objBank.agencynumber != '' && this.objBank.idBank != '') {
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

  supplierId() {
    this._sharedService.supplierId({ id: this._sharedService.getUserData().reseller_parent }).subscribe(
      response => {
        if (response.return) {
          this.idSupplier = response.data;
          this.mountRegisterForm();
        }
      });

  }

  getCategories() {
    this.catPromise = new Promise(resolve => {
      this._sharedService.getCompanyCategories().subscribe(
        (response: any) => {
          if (response.return) {
            this.objCategories = response.data.map(function (element) {
              return { id: element.id, name: element.category };
            });

            resolve(this.objCategories);
          } else {
            this._hyperToastsService.addToast('warn', 'Atenção', response.msg);
          }
        },
        err => { this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro ao listar as categorias'); }
      );
    });
  }

  mountRegisterForm() {
    this.registerForm = new FormGroup({
      id: new FormControl({ value: '', disabled: false }),
      idSupplier: new FormControl({ value: this.idSupplier, disabled: false }),
      companyForm: new FormGroup({
        name: new FormControl(
          { value: '', disabled: false }, Validators.compose([Validators.required, Validators.minLength(6)])
        ),
        tel: new FormControl(
          { value: '', disabled: false }
        ),
        cellPhones: new FormControl(
          { value: '', disabled: false }, Validators.compose([Validators.required])
        ),
        type: new FormControl(
          { value: '', disabled: false }, Validators.compose([Validators.required])
        ),
        // category: new FormControl(
        //   { value: '', disabled: false }, Validators.compose([Validators.required])
        // ),
        description: new FormControl(
          { value: '', disabled: false }, Validators.compose([Validators.required, Validators.minLength(20)])
        ),
      }),
      categoryForm: new FormGroup({
        list_category: new FormControl()
      }),
      addressForm: new FormGroup({
        zipcode: new FormControl(
          { value: '', disabled: false }, Validators.compose([Validators.required])
        ),
        street: new FormControl(
          { value: '', disabled: false }, Validators.compose([Validators.required])
        ),
        neighborhood: new FormControl(
          { value: '', disabled: false }, Validators.compose([Validators.required])
        ),
        state: new FormControl(
          { value: '', disabled: false }, Validators.compose([Validators.required])
        ),
        city: new FormControl(
          { value: '', disabled: false }, Validators.compose([Validators.required])
        ),
        number: new FormControl(
          { value: '', disabled: false }, Validators.compose([Validators.required])
        ),
        complement: new FormControl(
          { value: '', disabled: false }, Validators.compose([])
        ),
      }),
      mediasForm: new FormGroup({
        images: new FormControl(
          { value: [], disabled: false }, Validators.compose([])
        )
      }),
    });
    this._sharedService.getCompanyUser().subscribe(
      response => {
        if (response.return) {
          this.companyEdit = response.data;
          if (this.companyEdit) {
            this.editForm();
          }
        }
      }
    );

  }

  editForm() {
    this._sharedService.addBreadCrumb(
      [
        { 'text': 'Dashboard', 'router': '/supplier/dash' },
        { 'text': 'Editar Estabelecimento', 'router': '' }
      ]
    );

    this.listAddress = this.companyEdit.address;
    this.companyEdit.companyForm.tel = '';

    this.listCellPhone = this.companyEdit.companyForm.cellPhones.split(';');

    this.banksInserted = this.companyEdit.banks;
    delete this.companyEdit.banks;
    delete this.companyEdit.address;
    delete this.companyEdit.companyForm.id;
    this.registerForm.setValue(this.companyEdit);

    this.catPromise.then(x => {
      if (this.companyEdit.categoryForm.list_category !== null && this.companyEdit.categoryForm.list_category !== '') {
        this.selectedCategory = this.companyEdit.categoryForm.list_category;
        this.registerForm.get('categoryForm.list_category').setValue(this.selectedCategory);

        this.selectedCategory.forEach(element => {
          const index = this.objCategories.findIndex(x => x.id == element.id);

          this.objCategories.splice(index, 1);
        });
      }
    });
  }

  getAddressByCep() {
    let cep = this.registerForm.get('addressForm.zipcode').value;

    cep = cep.replace(/\D/g, ''); //Remove todas as letras deixando somente numeros
    this._sharedService.getAddresByCEP(cep).subscribe(
      (response: any) => {
        this.cepAdd = response;
        this.registerForm.get('addressForm.street').setValue(response.logradouro);
        this.registerForm.get('addressForm.state').setValue(response.uf);
        this.registerForm.get('addressForm.city').setValue(response.localidade);
        this.registerForm.get('addressForm.neighborhood').setValue(response.bairro);
      },
      error => {
        this.registerForm.get('addressForm.zipcode').setErrors({ 'cepNotFound': true });
      }
    );
  }

  onSearchCep(cep) {
    if (cep) {
      this.registerForm.get('addressForm.zipcode').setValue(cep);
      this.getAddressByCep();
    }
  }

  clearSearch() {
    this.registerForm.get('addressForm.street').reset();
    this.registerForm.get('addressForm.city').reset();
    this.registerForm.get('addressForm.state').reset();
    this.registerForm.get('addressForm.neighborhood').reset();
  }

  addAddress() {
    this.arrayBoxGroupInvalid.splice(this.arrayBoxGroupInvalid.indexOf('addressForm'), 1);
    if (this.registerForm.get('addressForm').status === 'INVALID') {
      this.arrayBoxGroupInvalid.push('addressForm');
    } else {
      this.listAddress.push({
        index: this.listAddress.length + 1,
        zipcode: this.registerForm.get('addressForm.zipcode').value,
        street: this.registerForm.get('addressForm.street').value,
        neighborhood: this.registerForm.get('addressForm.neighborhood').value,
        state: this.registerForm.get('addressForm.state').value,
        city: this.registerForm.get('addressForm.city').value,
        number: this.registerForm.get('addressForm.number').value,
        complement: this.registerForm.get('addressForm.complement').value
      });

      this.registerForm.get('addressForm.zipcode').reset();
      this.clearSearch();
    }
  }

  removeAddress(value) {
    let index = 0;
    for (let i = 0; i < this.listAddress.length; i++) {
      if (this.listAddress[i].index === value.index) {
        index = i;
        i = this.listAddress.length;
      }
    }

    this.listAddress.splice(index, 1);
  }

  // mediasForm
  onUpload(evt) {
    const listImages: any = this.registerForm.get('mediasForm.images').value;

    const auxPush = {
      position: '',
      type: 'Image',
      url: 'https://' + evt
    };

    listImages.push(auxPush);

    listImages.forEach((element, idx) => {
      element.position = idx + 1;
    });

    this.registerForm.get('mediasForm.images').setValue(listImages);
  }

  deletePhoto(pos) {
    const listImages: any = this.registerForm.get('mediasForm.images').value;
    listImages.splice(pos, 1);

    listImages.forEach((element, idx) => {
      element.position = idx + 1;
    });

    this.registerForm.get('mediasForm.images').setValue(listImages);
  }

  validateBoxGroup(formGroup: FormGroup) {
    this.arrayBoxGroupInvalid = [];
    Object.keys(formGroup.controls).forEach(form => {
      const auxForm = formGroup.get(form);
      switch (form) {
        case 'addressForm':
          if (this.listAddress.length < 1) {
            this.arrayBoxGroupInvalid.push(form);
          }
          break;

        case 'companyForm':
          if (this.listCellPhone.length < 1 || auxForm.status === 'INVALID') {
            this.arrayBoxGroupInvalid.push(form);
          }
          break;

        case 'categoryForm':
          if (auxForm.value.list_category === null || auxForm.value.list_category.length < 1) {
            this.arrayBoxGroupInvalid.push(form);
          }
          break;

        default:
          if (auxForm.status === 'INVALID') {
            this.arrayBoxGroupInvalid.push(form);
          }
          break;
      }
    });
  }

  onSubmit() {
    this.validateBoxGroup(this.registerForm);
    setInterval(() => {
      this.validateBoxGroup(this.registerForm);
    }, 1000);
    if (this.objBank.accountnumber != '' && this.objBank.agencynumber != '' && this.objBank.idBank != '') {
      this.addBank();
    }
    if (this.listAddress.length > 0 && this.registerForm.get('companyForm').valid) {

      let obj = this.registerForm.value;
      obj.address = this.listAddress;
      delete obj.addressForm;
      obj = {
        ...obj,
        banks: this.banksInserted
      };


      this._sharedService.postCompany(obj).subscribe(
        (response: any) => {
          if (response.return) {
            this._hyperToastsService.addToast('success', '', 'Estabelecimento registrado/alterado com sucesso');

            this._router.navigate(['/supplier/dash']);
          } else {
            this._hyperToastsService.addToast('warn', 'Atenção', response.msg);
          }
        },
        err => {
          this._hyperToastsService.addToast('error', '', err.msg);
        });
    } else {
      this.registerForm.get('companyForm.tel').setValue('');
      this._hyperToastsService.addToast('error', 'Atenção', 'Formulário Inválido. Verifique os campos em vermelho e tente novamente.');
    }
  }

  addCellPhone() {
    if (this.registerForm.get('companyForm.tel').status === 'VALID') {
      const newNumber = this.registerForm.get('companyForm.tel').value;
      if (this.listCellPhone.indexOf(newNumber) === -1) {
        this.listCellPhone.push(newNumber);
      }

      this.registerForm.get('companyForm.cellPhones').setValue(this.listCellPhone.join(';'));
      this.registerForm.get('companyForm.tel').setValue('');
    }
  }

  removeCellPhone(index) {
    this.listCellPhone.splice(index, 1);
    this.registerForm.get('companyForm.cellPhones').setValue(this.listCellPhone.join(';'));
  }

  keyCellPhone(key) {
    if (key === ',' || key === ';') {
      this.addCellPhone();
    }
  }

  setCategory() {
    this.registerForm.get('categoryForm.list_category').setValue(this.selectedCategory);
  }

}
