import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HyperToastsService } from 'lib-services';
import { Router, ActivatedRoute } from '@angular/router';
import { SharedService } from '@app-hyper-store/services/shared.service';

@Component({
  selector: 'app-hyper-store-register-gift-card',
  templateUrl: './register-gift-card.component.html',
  styleUrls: ['./register-gift-card.component.less']
})
export class RegisterGiftCardComponent implements OnInit {

  public sell_fee = 15;
  public diffDiscount = 10;
  public receive_value_cash_sale = 0;
  public receive_prime = 0;
  public receive_associate = 0;
  public receive_resale = 0;
  public price_prime = 0;
  public price_associate = 0;
  public price_resale = 0;

  public objCompany: any;
  public selectedCompany = [];

  public arrayBoxGroupInvalid: any = [];
  public registerForm: FormGroup;
  private idSupplier: any;
  public listCurrencies: any = [];

  public comPromise: Promise<any>;

  public maskMoney = { prefix: 'R$ ', thousands: '.', decimal: ',' };
  public maskPorcent = { prefix: '% ' };

  public buttonTextUpload = '<i class="fas fa-plus"></i><span> Adicionar imagens</span>';
  public urlRequest = '';
  public pathBucket = '';

  public typeValue = 'V'; // V -> Value, P -> Porcentagem;

  public inventoryControl = 'V';

  public giftEdit: any;
  public edit = false;

  public valuePercentMin = 5;
  public valuePercentMax = 100;

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
        { 'text': 'Cupom Smart', 'router': '' }
      ]
    );
    this.getCompany();
    this.supplierId();

    this.urlRequest = this.environment.apiPhpV2 + 'tools/upload';
    this.pathBucket = 'gift-card';
  }

  supplierId() {
    this.idSupplier = this._sharedService.getUserData().reseller_parent;
    this.mountRegisterForm();
  }

  mountRegisterForm() {
    this.registerForm = new FormGroup({
      id: new FormControl({ value: '', disabled: false }),
      idSupplier: new FormControl({ value: '', disabled: false }),
      giftForm: new FormGroup({
        title: new FormControl(
          { value: '', disabled: false }, Validators.compose([Validators.required, Validators.minLength(6)])
        ),
        quantity: new FormControl(
          { value: '1', disabled: false }, Validators.compose([Validators.required])
        ),
        maximum_quantity_per_user: new FormControl(
          { value: '1', disabled: false }, Validators.compose([Validators.required, Validators.maxLength(999999999)])
        ),
        status: new FormControl(
          { value: '', disabled: false }, Validators.compose([Validators.required])
        ),
        inventory_control: new FormControl(
          { value: '', disabled: false }, Validators.compose([Validators.required])
        ),
        valid_thru: new FormControl(
          { value: '', disabled: false }, Validators.compose([Validators.required])
        ),
        description: new FormControl(
          { value: '', disabled: false }, Validators.compose([Validators.required, Validators.minLength(20)])
        ),
      }),
      companyForm: new FormGroup({
        list_company: new FormControl()
      }),
      mediasForm: new FormGroup({
        images: new FormControl(
          { value: [], disabled: false }, Validators.compose([])
        )
      }),
      priceForm: new FormGroup({
        type_value: new FormControl(
          { value: 'V', disabled: false }, Validators.compose([Validators.required]),
        ),
        value_cash_sale: new FormControl(
          { value: 0, disabled: false }, Validators.compose([]),
        ),
        value_percent: new FormControl(
          { value: 10, disabled: false }, Validators.compose([])
        )
      })
    });

    if (this._activatedRoute.snapshot.params.id) {
      this.giftEdit = this._sharedService.getLocalProduct(this._activatedRoute.snapshot.params.id);
      this.edit = true;
      if (this.giftEdit) {
        this.editForm();
      }
    }
  }

  editForm() {
    this._sharedService.addBreadCrumb(
      [
        { 'text': 'Dashboard', 'router': '/supplier/dash' },
        { 'text': 'Edit Cupom Smart', 'router': '' }
      ]
    );

    this.inventoryControl = this.giftEdit.priceForm.type_value;

    this.registerForm.setValue(this.giftEdit);
    this.registerForm.disable();
    this.registerForm.get('giftForm.status').enable();
    this.calcOff(this.giftEdit.priceForm.value_cash_sale);

    this.comPromise.then(x => {
      if (this.giftEdit.companyForm.list_company !== null && this.giftEdit.companyForm.list_company !== '') {
        this.selectedCompany = this.giftEdit.companyForm.list_company;
        this.registerForm.get('companyForm.list_company').setValue(this.selectedCompany);

        this.selectedCompany.forEach(element => {
          const index = this.objCompany.findIndex(x => x.id == element.id);

          this.objCompany.splice(index, 1);
        });
      }
    });
  }

  changeTypeValue() {
    this.inventoryControl = this.registerForm.get('priceForm.type_value').value;
  }

  calcOff(evt) {
    const globalOff = this.registerForm.get('priceForm.value_percent').value / 100;
    this.receive_value_cash_sale = (evt * globalOff - evt) * -1;
  }

  checkDiscount() {
    const primeOff = this.registerForm.get('priceForm.discount_prime').value / 100;
    const associateOff = this.registerForm.get('priceForm.discount_associate').value / 100;
    const resaleOff = (this.registerForm.get('priceForm.discount_resale').value) / 100;

    if (resaleOff < (associateOff || primeOff)) {
      const tst = associateOff * 100 + this.diffDiscount;
      const tst2 = primeOff * 100 + this.diffDiscount;
      associateOff > primeOff ? this.registerForm.get('priceForm.discount_resale').setValue(tst) : this.registerForm.get('priceForm.discount_resale').setValue(tst2);
    }
    this.calcOff(this.registerForm.get('priceForm.value_cash_sale').value);
  }

  setCompany() {
    this.registerForm.get('companyForm.list_company').setValue(this.selectedCompany);
  }

  getCompany() {
    this.comPromise = new Promise(resolve => {
      this._sharedService.getCompanyUser().subscribe((response: any) => {
        if (response.return) {
          this.objCompany = [{ id: response.data.companyForm.id, name: response.data.companyForm.name }];
          resolve(this.objCompany);
        } else {
          this._hyperToastsService.addToast('warn', 'Atenção', response.msg);
        }
      }, err => { this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro ao listar as categorias'); });
    });
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
        case 'companyForm':
          if (auxForm.value.list_company === null || auxForm.value.list_company.length < 1) {
            this.arrayBoxGroupInvalid.push(form);
          }
          break;

        // case 'mediasForm':
        //   if (auxForm.value.images === null || auxForm.value.images.length < 1) {
        //     this.arrayBoxGroupInvalid.push(form);
        //   }
        //   break;

        case 'priceForm':
          if (this.inventoryControl === 'V') {
            if (this.registerForm.get('priceForm.value_percent').value < 1) {
              this.arrayBoxGroupInvalid.push(form);
            }
          } else {
            if (this.registerForm.get('priceForm.value_cash_sale').value < 1) {
              this.arrayBoxGroupInvalid.push(form);
            }
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

    if (this.registerForm.valid) {
      this.registerForm.enable();
      this._sharedService.postGiftCard(this.registerForm.value).subscribe(
        (response: any) => {
          if (response.return) {
            this._hyperToastsService.addToast('success', '', 'Gift registrado/alterado com sucesso');

            this._router.navigate(['/supplier/voucher-list']);
          } else {
            this._hyperToastsService.addToast('warn', 'Atenção', response.msg);
          }
        },
        err => {
          this._hyperToastsService.addToast('error', '', err.msg);
        });
    } else {
      this._hyperToastsService.addToast('error', 'Atenção', 'Formulário Inválido. Verifique os campos em vermelho e tente novamente.');
    }
  }

  validValuePercent() {
    let value = this.registerForm.get('priceForm.value_percent').value;
    if (value < this.valuePercentMin) {
      value = this.valuePercentMin;
    }

    if (value > this.valuePercentMax) {
      value = this.valuePercentMax;
    }

    this.registerForm.get('priceForm.value_percent').setValue(value);
  }

}
