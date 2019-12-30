import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HyperToastsService, BroadcastEventService } from 'lib-services';
import { SharedService } from '../../../services/shared.service';
import { Router, ActivatedRoute } from '@angular/router';
import { TreeNode } from 'primeng/api';
import { findIndex } from 'rxjs/operators';

@Component({
  selector: 'lib-components-register-product',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.less']
})
export class RegisterComponent implements OnInit {

  public sell_fee = 15;
  public diffDiscount = 10;
  public receive_value_cash_sale = 0;
  public receive_prime = 0;
  public receive_associate = 0;
  public receive_resale = 0;
  public price_prime = 0;
  public price_associate = 0;
  public price_resale = 0;
  public urlRequest = '';
  public pathBucket = '';
  public registerForm: FormGroup;
  public maskMoney = { prefix: 'R$ ', thousands: '.', decimal: ',' };
  public listDepartments: TreeNode[];
  public listDepartmentsSource: TreeNode[];
  public listDepartmentsTarget: any = [];
  public listCurrencies: any = [];
  private idSupplier: any;
  public arrayBoxGroupInvalid: any = [];
  public invalidMetaInfo = false;
  public buttonTextUpload = '<i class="fas fa-plus"></i><span> Adicionar imagens</span>';
  private product: any;
  public selected: any;
  public maxOffAssociate = 0;
  public maxOffPrime = 0;
  public optionsPrd = [
    'cor', 'estampa', 'genero', 'idade', 'outro', 'sabor', 'tamanho', 'voltagem'
  ];
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
      { 'text': 'Registrar Produto', 'router': '' }
    ];

    BroadcastEventService.event('onBreadCrumb').emit(obj);

    this.urlRequest = this.environment.apiPhpV2 + 'tools/upload';
    this.pathBucket = 'products';
    this.getCategories();
    this.getCurrencies();
    this.supplierId();

  }
  pushOptions() {
    console.log(this.registerForm.get('optionsForm').value);

    const listOptions = this.registerForm.get('optionsForm.options_list').value;
    listOptions.push({
      key: this.registerForm.get('optionsForm.key').value,
      value: this.registerForm.get('optionsForm.val').value
    });

    this.registerForm.get('optionsForm.options_list').setValue(listOptions);

    this.registerForm.get('optionsForm.key').setValue('');
    this.registerForm.get('optionsForm.val').setValue('');
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
      idSupplier: new FormControl({ value: this.idSupplier, disabled: false }),
      productForm: new FormGroup({
        title: new FormControl(
          { value: '', disabled: false }, Validators.compose([Validators.required, Validators.minLength(6)])
        ),
        ean: new FormControl(
          { value: '', disabled: false }, Validators.compose([Validators.required, Validators.minLength(10)])
        ),
        maximum_quantity_per_user: new FormControl(
          { value: '1', disabled: false }, Validators.compose([Validators.required, Validators.maxLength(999999999)])
        ),
        description: new FormControl(
          { value: '', disabled: false }, Validators.compose([Validators.required, Validators.minLength(20)])
        ),
        status: new FormControl(
          { value: '', disabled: false }, Validators.compose([Validators.required])
        ),
        preorder: new FormControl(
          { value: '', disabled: false }, Validators.compose([Validators.required])
        ),
        type: new FormControl(
          { value: '', disabled: false }, Validators.compose([Validators.required])
        ),
        quantity: new FormControl(
          { value: '1', disabled: false }, Validators.compose([Validators.required])
        ),
        valid_thru: new FormControl(
          { value: '', disabled: false }, Validators.compose([Validators.required])
        )
      }),
      mediasForm: new FormGroup({
        images: new FormControl(
          { value: [], disabled: false }, Validators.compose([Validators.required])
        )
      }),
      priceForm: new FormGroup({
        value_cash_sale: new FormControl(
          { value: '10', disabled: false }, Validators.compose([Validators.required])
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
          { value: 40, disabled: false }, Validators.compose([Validators.min(30)])
        ),
        value_minimun_resale: new FormControl(
          { value: '', disabled: false }
        ),
        plots: new FormControl(
          { value: '1', disabled: false }, Validators.compose([Validators.required])
        ),
        idCurrency: new FormControl(
          { value: this.listCurrencies[0] != undefined ? this.listCurrencies[0].id : 1, disabled: false }, Validators.compose([Validators.required])
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
      // metaInfoForm: new FormGroup({
      //   title: new FormControl(
      //     { value: '', disabled: false }, Validators.compose([Validators.required, Validators.minLength(10)])
      //   ),
      //   description: new FormControl(
      //     { value: '', disabled: false }, Validators.compose([Validators.required, Validators.minLength(20)])
      //   ),
      //   metainfo: new FormControl(
      //     { value: [], disabled: false }, Validators.compose([Validators.required])
      //   )
      // }),
      detailsForm: new FormGroup({
        key: new FormControl(
          { value: '', disabled: false }, Validators.compose([Validators.maxLength(30)])
        ),
        val: new FormControl(
          { value: '', disabled: false }, Validators.compose([Validators.maxLength(50)])
        ),
        details_list: new FormControl(
          { value: [], disabled: false }, Validators.compose([Validators.required])
        )
      }),
      optionsForm: new FormGroup({
        key: new FormControl(
          { value: '', disabled: false }, Validators.compose([Validators.maxLength(30)])
        ),
        val: new FormControl(
          { value: '', disabled: false }, Validators.compose([Validators.maxLength(50)])
        ),
        options_list: new FormControl(
          { value: [], disabled: false }
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
        list_category: new FormControl(
          { value: [], disabled: false }, Validators.compose([Validators.required])
        ),
        department: new FormControl(
          { value: '', disabled: false }, Validators.compose([])
        )
      })
    });
    this.changeTypeMeasure();
    if (this._activatedRoute.snapshot.params.id) {
      this.product = this._sharedService.getLocalProduct(this._activatedRoute.snapshot.params.id);
      if (this.product) {

        this.editForm();
      }
    }
  }

  editForm() {
    const obj = [
      { 'text': 'Dashboard', 'router': '/home' },
      { 'text': 'Editar Produto', 'router': '' }
    ];

    BroadcastEventService.event('onBreadCrumb').emit(obj);
    // Reseta a porcentagem para o minimo nescesario
    if (!this.product.priceForm.checkResale) {
      this.product.priceForm.discount_associate = 30;
      this.product.priceForm.discount_prime = 10;
      this.product.priceForm.discount_resale = 40;
    }


    // seta as metainfo e as categorias
    // this.product.metaInfoForm.metainfo = this.product.metaInfoForm.metainfo != null ? this.product.metaInfoForm.metainfo.split(',') : '';
    this.product.categoryForm.department = '';
    // this.product.categoryForm.list_category = this.product.categoryForm.list_category != null ? this.product.categoryForm.list_category : '';

    // set value no form completo
    this.registerForm.setValue(this.product);
    // refaz os calculos e validações com os valores inseridos no form
    this.shippingDisable();
    this.changeTypeMeasure();
    this.calcOff(this.product.priceForm.value_cash_sale);

    // monta o array como o component p-pickList espera com os valores retornados da API
    if (this.product.categoryForm.list_category != '') {
      const categories = JSON.parse(this.product.categoryForm.list_category);
      setTimeout(() => {

        categories.forEach(element => {
          this.listDepartments.forEach(department => {
            // tslint:disable-next-line:radix
            if (element.idDepartment === parseInt(department.data.idDepartment)) {
              this.listDepartmentsTarget.push(department);
              department.children.forEach(category => {
                // tslint:disable-next-line:radix
                if (parseInt(category.data.id) === element.idCategory) {
                  this.listDepartmentsTarget.push(category);
                }
              });
            }
          });
        });
      }, 1000);
      this.registerForm.get('categoryForm.list_category').setValue(this.listDepartmentsTarget);
      this.registerForm.get('categoryForm.list_category').clearValidators();
    }
  }

  changeTypeMeasure() {
    const currentType = this.registerForm.get('shippingForm.type_measure').value;

    if (this.registerForm.get('productForm.type').value === 'physical') {
      this.registerForm.get('shippingForm').get(currentType).enable();
    }
    this.registerForm.get('shippingForm').get(currentType === 'depth' ? 'diameter' : 'depth').disable();
  }

  deletePhoto(pos) {
    const listImages: any = this.registerForm.get('mediasForm.images').value;
    listImages.splice(pos, 1);

    listImages.forEach((element, idx) => {
      element.position = idx + 1;
    });

    this.registerForm.get('mediasForm.images').setValue(listImages);
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

  pushDetails() {
    if (this.registerForm.get('detailsForm.key').valid && this.registerForm.get('detailsForm.val').valid) {
      const listDetails = this.registerForm.get('detailsForm.details_list').value;
      listDetails.push({
        key: this.registerForm.get('detailsForm.key').value,
        value: this.registerForm.get('detailsForm.val').value
      });

      this.registerForm.get('detailsForm.details_list').setValue(listDetails);

      this.registerForm.get('detailsForm.key').setValue('');
      this.registerForm.get('detailsForm.val').setValue('');
    } else {
      this._hyperToastsService.addToast('warn', 'Atenção', 'Preencha os dados corretamente');
    }
  }

  addNewCategory(evt) {
    let index = -1;
    let node = evt.node;
    if (evt.node.children === undefined) {
      index = this.listDepartmentsTarget.indexOf(evt.node) + 1;
      this.listDepartments.forEach(dep => {
        if (dep.data.idDepartment === evt.node.parent.data.idDepartment) {
          node = dep;
        }
      });
    } else {
      index = this.listDepartmentsTarget.indexOf(evt.node);
      this.listDepartments.forEach(dep => {
        if (dep.data.idDepartment === evt.node.data.idDepartment) {
          node = dep;
        }
      });
    }
    if (index >= 0) {
      this.listDepartmentsTarget.splice(index, 1);
      this.listDepartmentsTarget.push(node);
    }
    const list = [];
    this.listDepartmentsTarget.forEach(element => {
      if (element.children === undefined) {
        list.push(element.data);
      }
    });

    this.registerForm.get('categoryForm.list_category').setValue(list);
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

  getCategories() {
    this._sharedService.getDepartments().subscribe(
      (response: any) => {
        if (response.return === true) {
          this.listDepartments = [];
          response.data.forEach(category => {
            // category.idDepartment = Math.floor(Math.random() * 4);
            // category.nameDepartment = 'Departamento ' + category.idDepartment;
            let contains = false;
            this.listDepartments.forEach(departamento => {
              if (category.idDepartment === departamento.data.idDepartment) {
                departamento.children.push({ label: category.name, data: category });
                contains = true;
              }
            });
            if (!contains) {
              this.listDepartments.push({ label: category.nameDepartment, data: { idDepartment: category.idDepartment, name: category.nameDepartment }, children: [{ label: category.name, data: category }] });
            }
          });
          this.listDepartmentsSource = this.listDepartments;
        } else {
          this._hyperToastsService.addToast('warn', 'Atenção', response.msg);
        }
      },
      err => { this._hyperToastsService.addToast('error', 'Erro', err); }
    );
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
    if (this.registerForm.get('detailsForm.details_list').value) {
      if (this.registerForm.get('detailsForm.details_list').value.length <= 0) {
        this.registerForm.get('detailsForm.details_list').setErrors({ 'required': true });
      }
    }

    // if (this.registerForm.get('metaInfoForm.metainfo').value) {
    //   this.invalidMetaInfo = this.registerForm.get('metaInfoForm.metainfo').value.length <= 0;
    // }
  }

  resetForm(formGroup: FormGroup) {
    this.registerForm.reset();
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsPristine();
        control.markAsUntouched();
        control.updateValueAndValidity();
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  validateDepartmentsTarget() {
    const list = [];
    this.listDepartmentsTarget.forEach(element => {
      if (element.children === undefined) {
        list.push(element.data);
      }
    });
    this.registerForm.get('categoryForm.list_category').setValue(list);
  }

  onSubmit() {
    this.validateDepartmentsTarget();
    this.validateAllFormFields(this.registerForm);
    this.validateBoxGroup(this.registerForm);
    setInterval(() => {
      this.validateBoxGroup(this.registerForm);
    }, 1000);
    this.registerForm.get('priceForm.idCurrency').value === null ? this.registerForm.get('priceForm.idCurrency').setValue(1) : this.registerForm.get('priceForm.idCurrency').updateValueAndValidity();
    if (this.registerForm.valid && this.registerForm.get('categoryForm.list_category').value.length >= 1) {
      if (!this.registerForm.get('priceForm.checkResale').value) {
        this.registerForm.get('priceForm.discount_associate').setValue(0);
        this.registerForm.get('priceForm.discount_prime').setValue(0);
        this.registerForm.get('priceForm.discount_resale').setValue(0);
        this.registerForm.get('priceForm.points_value').setValue(0);
      }
      this._sharedService.postProduct(this.registerForm.value).subscribe(
        response => {
          if (response.return) {
            this._hyperToastsService.addToast('success', '', response.msg);
            this._router.navigate(['/edit-products']);
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
  // enabledControl(nameControl, checked) {

  //   if (!checked) {
  //     this.registerForm.get('priceForm.' + nameControl).disable();
  //   } else {
  //     this.registerForm.get('priceForm.' + nameControl).enable();
  //   }
  // }
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
  calcOff(evt) {



    const globalOff = this.sell_fee / 100;

    const associateOff = this.registerForm.get('priceForm.discount_associate').value / 100;
    const resaleOff = (this.registerForm.get('priceForm.discount_resale').value) / 100;


    this.receive_value_cash_sale = (evt * globalOff - evt) * -1;
    // this.receive_prime = (evt * primeOff - evt) * -1;
    // this.receive_associate = (evt * associateOff - evt) * -1;
    this.receive_resale = (evt * resaleOff - evt) * -1;

    this.price_associate = (evt * associateOff - evt) * -1;

    this.price_prime = (this.price_associate * 0.1 + this.price_associate);
    const primeOff = ((this.price_prime * 100 / evt) - 100) * -1;
    this.registerForm.get('priceForm.discount_prime').setValue(primeOff);

    let pointsSale = this.price_associate - this.receive_resale;
    pointsSale = pointsSale < 0 ? 0 : pointsSale;
    pointsSale = Math.floor(pointsSale);
    this.registerForm.get('priceForm.points_value').setValue(pointsSale.toFixed(0));
    // this.maxOffAssociate = this.registerForm.get('priceForm.discount_resale').value - this.registerForm.get('priceForm.discount_prime').value;
    // this.maxOffPrime = this.registerForm.get('priceForm.discount_resale').value - this.registerForm.get('priceForm.discount_associate').value;
    // this.registerForm.get('priceForm.discount_associate').setValidators(Validators.compose([Validators.max(this.maxOffAssociate), Validators.min(30)]));
    if (this.registerForm.get('priceForm.checkResale').value) {
      this.registerForm.get('priceForm.discount_associate').setValidators(Validators.compose([Validators.min(10)]));
      this.registerForm.get('priceForm.discount_associate').updateValueAndValidity();
    } else {
      this.registerForm.get('priceForm.discount_associate').clearValidators();
      this.registerForm.get('priceForm.discount_associate').updateValueAndValidity();
    }
    // this.registerForm.get('priceForm.discount_associate').updateValueAndValidity();
  }

  shippingDisable() {
    if (this.registerForm.get('productForm.type').value === 'digital') {
      this.registerForm.get('shippingForm').disable();
      this.registerForm.get('shippingForm').clearValidators();
    } else {
      this.registerForm.get('shippingForm').enable();
      this.registerForm.get('shippingForm').setValidators(Validators.compose([Validators.required]));
    }
    this.changeTypeMeasure();
  }

  filterDepartments() {
    if (this.registerForm.get('categoryForm.department').value !== '') {
      this.listDepartmentsSource = [];
      this.listDepartments.forEach(dep => {
        if (this.prepareForComparison(dep.data.name).indexOf(this.registerForm.get('categoryForm.department').value) != -1) {
          this.listDepartmentsSource.push(dep);
        } else {
          dep.children.forEach(cat => {
            if (this.prepareForComparison(cat.data.name).indexOf(this.registerForm.get('categoryForm.department').value) != -1) {
              const index = this.listDepartmentsSource.findIndex(x => x.data === dep.data);
              if (index >= 0) {
                this.listDepartmentsSource[index].children.push(cat);
              } else {
                this.listDepartmentsSource.push({ label: dep.label, data: dep.data, children: [cat] });
              }
            }
          });
        }
      });
    } else {
      this.listDepartmentsSource = this.listDepartments;
    }
  }

  prepareForComparison(o) {
    if (typeof o == 'string') {
      return o.toLowerCase();
    }
    return o;
  }

  clearSearch() {
    this.registerForm.get('categoryForm.department').setValue('');
    this.filterDepartments();
  }
}
