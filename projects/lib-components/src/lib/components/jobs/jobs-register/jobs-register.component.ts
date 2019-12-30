import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HyperToastsService, BroadcastEventService } from 'lib-services';
import { SharedService } from '../../../services/shared.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Promise } from 'q';

@Component({
  selector: 'lib-components-jobs-register',
  templateUrl: './jobs-register.component.html',
  styleUrls: ['./jobs-register.component.less']
})
export class JobsRegisterComponent implements OnInit {

  public urlRequest = '';
  public pathBucket = '';
  public registerForm: FormGroup;
  public typeCategory: any;
  public objCategories: any;
  public objSkills: any;
  public objSubcategories: any;
  public objLanguage: any;
  public objCoin = [];
  public objJobType: any;
  public maskMoney = { prefix: 'R$ ', thousands: '.', decimal: ',' };
  public buttonTextUpload = '<i class="fas fa-plus"></i><span> Adicionar imagens</span>';
  public listCurrencies: any = [];
  private idSupplier: any;
  public selectedCat = [];
  public selectedSkills = [];

  public sell_fee = 15;
  public diffDiscount = 10;
  public receive_value_cash_sale = 0;
  public receive_prime = 0;
  public receive_associate = 0;
  public receive_resale = 0;
  public price_prime = 0;
  public price_associate = 0;
  public price_resale = 0;
  public maxOffAssociate = 0;
  public maxOffPrime = 0;
  public arrayBoxGroupInvalid: any = [];
  public invalidMetaInfo = false;

  private catPromise: Promise<any>;
  private skillPromise: Promise<any>;

  private service: any;
  constructor(
    @Inject('environments') private environment: any,
    private _sharedService: SharedService,
    private _hyperToastsService: HyperToastsService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute

  ) { }

  ngOnInit() {
    const obj = [
      { 'text': 'Dashboard', 'router': '/home' },
      { 'text': 'Registrar Serviço', 'router': '' }
    ];

    BroadcastEventService.event('onBreadCrumb').emit(obj);

    this.urlRequest = this.environment.apiPhpV2 + 'tools/upload';
    this.pathBucket = 'services';
    this.supplierId();
    this.getCategories();
    this.getSkills();
    this.getCurrencies();
    this.getJobType();
  }
  supplierId() {
    this._sharedService.getSupplier().subscribe(x => {
      if (x.data != '') {
        this.idSupplier = x.data.id;
        this.mountRegisterForm();
      } else {
        this._router.navigate(['/register-supplier']);
      }
    });
  }
  mountRegisterForm() {
    this.registerForm = new FormGroup({
      id: new FormControl({ value: '', disabled: false }),
      hyper_service: new FormControl({ value: 'N', disabled: false }),
      idSupplier: new FormControl({ value: this.idSupplier, disabled: false }),
      acceptTerms: new FormControl({ value: false, disabled: false }, Validators.requiredTrue),
      serviceForm: new FormGroup({
        name: new FormControl(
          { value: '', disabled: false }, Validators.compose([Validators.required, Validators.minLength(6)])
        ),
        description: new FormControl(
          { value: '', disabled: false }, Validators.compose([Validators.required, Validators.minLength(20)])
        ),
        status: new FormControl(
          { value: '', disabled: false }, Validators.compose([Validators.required])
        ),
        type: new FormControl(
          { value: '', disabled: false }, Validators.compose([Validators.required])
        ),
        jobType: new FormControl(
          { value: '1', disabled: false }, Validators.compose([Validators.required])
        ),
        valid_thru: new FormControl(
          { value: '', disabled: false }
        )
      }),
      mediasForm: new FormGroup({
        images: new FormControl(
          { value: [], disabled: false }, Validators.compose([Validators.required])
        )
      }),
      priceForm: new FormGroup({
        value_cash_sale: new FormControl(
          { value: '', disabled: false }, Validators.compose([Validators.required])
        ),
        type_discount_associate: new FormControl(
          { value: 'percentage', disabled: false }
        ),
        discount_associate: new FormControl(
          { value: 30, disabled: false }
        ),
        type_discount_resale: new FormControl(
          { value: 'percentage', disabled: false }
        ),
        discount_resale: new FormControl(
          { value: 30, disabled: false }, Validators.compose([Validators.min(30)])
        ),
        value_minimun_resale: new FormControl(
          { value: '', disabled: false }
        ),
        idCurrency: new FormControl(
          { value: 1, disabled: false }, Validators.compose([Validators.required])
        ),
        checkResale: new FormControl(
          { value: false, disabled: false }
        ),
        discount_prime: new FormControl(
          { value: 10, disabled: false }
        ),
        type_discount_prime: new FormControl(
          { value: 'percentage', disabled: false }
        ),
        points_value: new FormControl(
          { value: 0, disabled: false }
        )
      }),
      shippingForm: new FormGroup({
        diameter: new FormControl(
          { value: '', disabled: true }, Validators.compose([Validators.required])
        ),
        depth: new FormControl(
          { value: '', disabled: false }, Validators.compose([Validators.required])
        ),
        height: new FormControl(
          { value: '', disabled: false }, Validators.compose([Validators.required])
        ),
        width: new FormControl(
          { value: '', disabled: false }, Validators.compose([Validators.required])
        ),
        weight: new FormControl(
          { value: '', disabled: false }, Validators.compose([Validators.required])
        ),
        type_measure: new FormControl(
          { value: 'depth', disabled: false }
        ),
      }),
      categoryForm: new FormGroup({
        list_category: new FormControl()
      }),
      skillsForm: new FormGroup({
        list_skills: new FormControl()
      })
    });
    this.changeTypeMeasure();
    if (this._activatedRoute.snapshot.params.id) {
      this.service = this._sharedService.getLocalProduct(this._activatedRoute.snapshot.params.id);
      if (this.service) {
        this.editForm();
      }
    }
  }
  setCategory() {
    this.registerForm.get('categoryForm.list_category').setValue(this.selectedCat);
  }
  setSkills() {
    this.registerForm.get('skillsForm.list_skills').setValue(this.selectedSkills);
  }
  editForm() {
    const obj = [
      { 'text': 'Dashboard', 'router': '/home' },
      { 'text': 'Editar Serviço', 'router': '' }
    ];

    BroadcastEventService.event('onBreadCrumb').emit(obj);

    // Reseta a porcentagem para o minimo nescesario
    if (!this.service.priceForm.checkResale) {
      this.service.priceForm.discount_associate = 30;
      this.service.priceForm.discount_prime = 10;
      this.service.priceForm.discount_resale = 40;
    }


    // seta as skill e as categorias
    this.catPromise.then(x => {
      this.service.categoryForm.list_category.forEach(element => {
        const index = this.objCategories.findIndex(x => x.id == element.id);
        this.selectedCat.push(...this.objCategories[index]);
        this.objCategories.splice(index, 1);
      });
    });
    // SKILL
    this.skillPromise.then(x => {
      this.service.skillsForm.list_skills.forEach(element => {
        const index = this.objSkills.findIndex(x => x.id == element.id);
        this.selectedSkills.push(...this.objSkills[index]);
        this.objSkills.splice(index, 1);
      });
    });
    // this.service.categoryForm.department = '';
    // this.product.categoryForm.list_category = this.product.categoryForm.list_category != null ? this.product.categoryForm.list_category : '';

    // set value no form completo
    this.service.acceptTerms = this.service.acceptTerms === 'Y' ? true : false;
    this.registerForm.setValue(this.service);
    this.registerForm.get('priceForm.idCurrency').setValue(1);
    // refaz os calculos e validações com os valores inseridos no form
    this.shippingDisable();
    this.changeTypeMeasure();
    this.calcOff(this.service.priceForm.value_cash_sale);

  }

  changeTypeMeasure() {
    const currentType = this.registerForm.get('shippingForm.type_measure').value;

    if (this.registerForm.get('serviceForm.type').value === 'physical') {
      this.registerForm.get('shippingForm').get(currentType).enable();
    }
    this.registerForm.get('shippingForm').get(currentType === 'depth' ? 'diameter' : 'depth').disable();
  }
  checkDiscount() {
    const primeOff = this.registerForm.get('priceForm.discount_prime').value / 100;
    const associateOff = this.registerForm.get('priceForm.discount_associate').value / 100;
    const resaleOff = (this.registerForm.get('priceForm.discount_resale').value) / 100;

    if ((resaleOff < associateOff) || (resaleOff < primeOff)) {
      const tst = associateOff * 100 + this.diffDiscount;
      const tst2 = primeOff * 100 + this.diffDiscount;
      associateOff > resaleOff ? this.registerForm.get('priceForm.discount_resale').setValue(tst) : this.registerForm.get('priceForm.discount_resale').setValue(tst2);
    }
    this.calcOff(this.registerForm.get('priceForm.value_cash_sale').value);
  }
  calcOff(evt) {

    const globalOff = this.sell_fee / 100;
    const primeOff = this.registerForm.get('priceForm.discount_prime').value / 100;
    const associateOff = this.registerForm.get('priceForm.discount_associate').value / 100;
    const resaleOff = (this.registerForm.get('priceForm.discount_resale').value) / 100;

    this.receive_value_cash_sale = (evt * globalOff - evt) * -1;
    // this.receive_prime = (evt * primeOff - evt) * -1;
    // this.receive_associate = (evt * associateOff - evt) * -1;
    this.receive_resale = (evt * resaleOff - evt) * -1;

    this.price_prime = (evt * primeOff - evt) * -1;
    this.price_associate = (evt * associateOff - evt) * -1;

    let pointsSale = this.price_associate - this.receive_resale;
    pointsSale = pointsSale < 0 ? 0 : pointsSale;
    this.registerForm.get('priceForm.points_value').setValue(pointsSale.toFixed(0));



    // this.maxOffAssociate = this.registerForm.get('priceForm.discount_resale').value - this.registerForm.get('priceForm.discount_prime').value;
    // this.maxOffPrime = this.registerForm.get('priceForm.discount_resale').value - this.registerForm.get('priceForm.discount_associate').value;
    // this.registerForm.get('priceForm.discount_associate').setValidators(Validators.compose([Validators.max(this.maxOffAssociate), Validators.min(30)]));
    // this.registerForm.get('priceForm.discount_prime').setValidators(Validators.compose([Validators.max(this.maxOffPrime), Validators.min(10)]));
    // this.registerForm.get('priceForm.discount_prime').updateValueAndValidity();
    // this.registerForm.get('priceForm.discount_associate').updateValueAndValidity();

  }

  shippingDisable() {
    if (this.registerForm.get('serviceForm.type').value === 'digital') {
      this.registerForm.get('shippingForm').disable();
      this.registerForm.get('shippingForm').clearValidators();
    } else {
      this.registerForm.get('shippingForm').enable();
      this.registerForm.get('shippingForm').setValidators(Validators.compose([Validators.required]));
    }
    this.changeTypeMeasure();
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  validateBoxGroup(formGroup: FormGroup) {
    this.arrayBoxGroupInvalid = [];
    Object.keys(formGroup.controls).forEach(form => {
      const auxForm = formGroup.get(form);
      if (auxForm.status === 'INVALID') {
        this.arrayBoxGroupInvalid.push(form);
      }
    });
  }
  getCurrencies() {
    this._sharedService.getCurrencies().subscribe(
      (response: any) => {
        if (response.return === true) {
          this.listCurrencies = response.data;
        } else {
          this._hyperToastsService.addToast('warn', 'Atenção', response.msg);
        }
      },
      err => { this._hyperToastsService.addToast('error', 'Erro', err); }
    );
  }

  deletePhoto(pos) {
    const listImages: any = this.registerForm.get('mediasForm.images').value;
    listImages.splice(pos, 1);

    listImages.forEach((element, idx) => {
      element.position = idx + 1;
    });

    this.registerForm.get('mediasForm.images').setValue(listImages);
  }
  getCategories() {
    this.catPromise = Promise(resolve => {
      this._sharedService.getCategory().subscribe(
        (response: any) => {
          if (response.return) {
            this.objCategories = response.data;
            resolve(this.objCategories);
          } else {
            this._hyperToastsService.addToast('warn', 'Atenção', response.msg);
          }
        },
        err => { this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro ao listar as categorias'); }
      );
    });
  }

  getSkills() {
    this.skillPromise = Promise(resolve => {
      this._sharedService.getSkills().subscribe(
        response => {
          if (response.return) {
            this.objSkills = response.data;
            resolve(this.objSkills);
          }
        },
        err => { this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro ao listar as habilidades'); }

      );
    });
  }

  getJobType() {
    this._sharedService.getJobType().subscribe(
      (response: any) => {
        if (response.return) {
          this.objJobType = response.data;
        } else {
          this._hyperToastsService.addToast('warn', 'Atenção', response.msg);
        }
      },
      err => { this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro ao listar os tipo de JOBs'); }
    );
  }

  getListCoins() {
    this.objCoin = [
      {
        initials: 'BRL',
        currency: 'Preço Fixo'
      },
      {
        initials: '0',
        currency: 'A Combinar'
      }
    ];
    this.checkSalary();
  }

  checkSalary() {
    if (this.registerForm.get('coin').value === 'BRL') {
      this.registerForm.get('salary').enable();
    } else {
      this.registerForm.get('salary').disable();
    }
  }

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

  onSubmit() {
    console.log(this.registerForm);
    this.validateAllFormFields(this.registerForm);
    this.validateBoxGroup(this.registerForm);
    setInterval(() => {
      this.validateBoxGroup(this.registerForm);
    }, 1000);
    if (this.registerForm.valid) {
      if (!this.registerForm.get('priceForm.checkResale').value) {
        this.registerForm.get('priceForm.discount_associate').setValue(0);
        this.registerForm.get('priceForm.discount_prime').setValue(0);
        this.registerForm.get('priceForm.discount_resale').setValue(0);
        this.registerForm.get('priceForm.points_value').setValue(0);
      }
      this._sharedService.postService(this.registerForm.value).subscribe(
        response => {
          if (response.return) {
            this._hyperToastsService.addToast('success', '', response.msg);
            window.scrollTo(0, 0);
            this.registerForm.reset();
            this._router.navigate(['/edit-services']);
          } else {
            this._hyperToastsService.addToast('warn', 'Atenção', response.msg);
          }
        },
        err => {
          this._hyperToastsService.addToast('error', '', err.msg);
          this.registerForm.get('priceForm.discount_associate').setValue(30);
          this.registerForm.get('priceForm.discount_prime').setValue(10);
          this.registerForm.get('priceForm.discount_resale').setValue(40);
        });
    } else {
      this._hyperToastsService.addToast('error', 'Atenção', 'Formulário Inválido. Verifique os campos em vermelho e tente novamente.');
    }
  }

}
