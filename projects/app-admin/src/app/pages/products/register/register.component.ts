import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { environment } from '@env/app-admin';
import { SharedService } from '@app-admin/services/shared.service';
import { HyperToastsService } from 'lib-services';

@Component({
  selector: 'app-admin-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.less']
})
export class RegisterComponent implements OnInit {

  public urlRequest = '';
  public bearerToken = 'bearerToken';
  public registerForm: FormGroup;
  public maskMoney = { prefix: 'R$ ', thousands: '.', decimal: ',' };
  public listCategoriesSource: any = [];
  public listCategoriesTarget: any = [];
  public listCurrencies: any = [];

  constructor(
    private _sharedService: SharedService,
    private _hyperToastsService: HyperToastsService
  ) { }

  ngOnInit() {
    this.urlRequest = environment.apiPhp + 'job/image';
    this.bearerToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJkYXRhIjp7ImlkIjoiMTkiLCJ0b2tlbiI6IkVSMTRJQUs3NjQifSwiaWF0IjoxNTMyOTgxODMzLCJleHAiOjE2MTkzODE4MzMsIm5iZiI6MTUzMjk4MTgzMn0.LVy60TVCIXxfalvbeVKwtKtbwwHmbjkeVvkftqZai3M';
    this.getCategories();
    this.getCurrencies();
    this.mountRegisterForm();
  }

  mountRegisterForm() {
    this.registerForm = new FormGroup({
      productForm: new FormGroup({
        title: new FormControl(
          { value: '', disabled: false }, Validators.compose([Validators.required, Validators.minLength(6)])
        ),
        slug: new FormControl(
          { value: '', disabled: false }, Validators.compose([Validators.required, Validators.minLength(6)])
        ),
        ean: new FormControl(
          { value: '', disabled: false }, Validators.compose([Validators.required, Validators.minLength(10)])
        ),
        maximum_quantity_per_user: new FormControl(
          { value: '1', disabled: false }, Validators.compose([Validators.required])
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
        market_value: new FormControl(
          { value: '', disabled: false }, Validators.compose([Validators.required])
        ),
        value_cash: new FormControl(
          { value: '', disabled: false }, Validators.compose([Validators.required])
        ),
        discount_associate: new FormControl(
          { value: '', disabled: false }, Validators.compose([Validators.required])
        ),
        type_discount: new FormControl(
          { value: '', disabled: false }, Validators.compose([Validators.required])
        ),
        plots: new FormControl(
          { value: '1', disabled: false }, Validators.compose([Validators.required])
        ),
        points_value: new FormControl(
          { value: null, disabled: false }, Validators.compose([Validators.required])
        ),
        idCurrency: new FormControl(
          { value: '', disabled: false }, Validators.compose([Validators.required])
        )
      }),
      metaInfoForm: new FormGroup({
        title: new FormControl(
          { value: '', disabled: false }, Validators.compose([Validators.required, Validators.minLength(10)])
        ),
        description: new FormControl(
          { value: '', disabled: false }, Validators.compose([Validators.required, Validators.minLength(20)])
        ),
        metainfo: new FormControl(
          { value: [], disabled: false }, Validators.compose([Validators.required])
        )
      }),
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
      shippingForm: new FormGroup({
        diameter: new FormControl(
          { value: '', disabled: false }, Validators.compose([Validators.required])
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
        )
      })
    });
  }

  changeTypeMeasure() {
    const currentType = this.registerForm.get('shippingForm.type_measure').value;

    this.registerForm.get('shippingForm').get(currentType).enable();
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
    console.log(this.registerForm.get('detailsForm.key').value, this.registerForm.get('detailsForm.val').value);

    const listDetails = this.registerForm.get('detailsForm.details_list').value;
    listDetails.push({
      key: this.registerForm.get('detailsForm.key').value,
      value: this.registerForm.get('detailsForm.val').value
    });

    this.registerForm.get('detailsForm.details_list').setValue(listDetails);

    this.registerForm.get('detailsForm.key').setValue('');
    this.registerForm.get('detailsForm.val').setValue('');
  }

  addNewCategory() {
    this.registerForm.get('categoryForm.list_category').setValue(this.listCategoriesTarget);
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
    this._sharedService.getCategories().subscribe(
      (response: any) => {
        if (response.return === true) {
          this.listCategoriesSource = response.data;
        } else {
          this._hyperToastsService.addToast('warn', 'Atenção', response.msg);
        }
      },
      err => { this._hyperToastsService.addToast('error', 'Erro', err); }
    );
  }

  onSubmit() {
    this.registerForm.get('detailsForm.key').disable();
    this.registerForm.get('detailsForm.val').disable();
    this.registerForm.get('shippingForm.type_measure').disable();

    console.log(this.registerForm.value);

    //Somente Testes
    this.registerForm.get('detailsForm.key').enable();
    this.registerForm.get('detailsForm.val').enable();
    this.registerForm.get('shippingForm.type_measure').enable();

  }

}
