import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { HyperCookieService, BroadcastEventService } from 'lib-services';
import { SharedService } from '@app-consultant-adm/services/shared.service';
import { HyperToastsService } from 'lib-services';

@Component({
  selector: 'app-consultant-adm-data-shop',
  templateUrl: './data-shop.component.html',
  styleUrls: ['./data-shop.component.less']
})
export class DataShopComponent implements OnInit {

  public dataShopForm: FormGroup;
  private shop: any;
  private user: any;
  public showInMap = [
    { label: 'Sim', value: true },
    { label: 'Não', value: false },
  ];
  public typeShop = [
    { label: 'Pessoa Física', value: 'fisica' },
    { label: 'Pessoa Jurídica', value: 'juridica' },
  ];
  constructor(
    private fb: FormBuilder,
    private _hyperCookieService: HyperCookieService,
    private _hyperToastsService: HyperToastsService,
    private _sharedService: SharedService
  ) {
    this.user = this._hyperCookieService.getCookie_AUTH();

  }
  ngOnInit() {
    this._sharedService.addBreadCrumb([
      { 'text': 'Dashboard', 'router': '/home' },
      { 'text': 'Configurações', 'router': '/settings/data-shop' },
      { 'text': 'Dados da loja', 'router': '' }
    ]);

    this._sharedService.getConsultants().subscribe(
      response1 => {
        if (!response1.return) {
          this._sharedService.putConsultants({ status: 'I' }).subscribe(
            response2 => {
              if (response2.return) {
                this._sharedService.getConsultants().subscribe(
                  response3 => {
                    if (response3.return) {
                      this.createForm(response3.data);
                    } else {
                      this._hyperToastsService.addToast('warn', 'Atenção', response3.msg);
                    }
                  },
                  err => { this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro inesperado. Atualize a página e tente novamente'); }
                );
              } else {
                this._hyperToastsService.addToast('warn', 'Atenção', response2.msg);
              }
            },
            err => { this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro inesperado. Atualize a página e tente novamente'); }
          );
        } else {
          this.createForm(response1.data);
        }
      },
      err => { this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro inesperado. Atualize a página e tente novamente'); }
    );
  }

  createForm(consultant) {
    this.shop = consultant;
    this.dataShopForm = this.fb.group({ // <-- the parent FormGroup
      idHJ: this.user.id,
      address_shop: this.fb.group({ // <-- the child FormGroup
        zipCode: [consultant.address_shop.zipCode, Validators.required],
        state: [consultant.address_shop.state, Validators.required],
        city: [consultant.address_shop.city, Validators.required],
        neighborhood: [consultant.address_shop.neighborhood, Validators.required],
        address: [consultant.address_shop.address, Validators.required],
        number: [consultant.address_shop.number, [Validators.required, Validators.pattern(/^[0-9]*$/)]],
        complement: [consultant.address_shop.complement],
        showInMap: [consultant.address_shop.showInMap, Validators.required],
        country: ['Brasil']
      }),
      data_shop: this.fb.group({ // <-- the child FormGroup
        name: [consultant.data_shop.name, Validators.required],
        nameTitle: [consultant.data_shop.nameTitle, Validators.required],
        description: [consultant.data_shop.description, Validators.required],
        typeShop: [consultant.data_shop.typeShop, Validators.required],
        responsibleName: [consultant.data_shop.responsibleName],
        blogUrl: [consultant.data_shop.blogUrl],
        socialSecurity: [consultant.data_shop.socialSecurity, Validators.required],
        phoneTalk: [consultant.data_shop.phoneTalk],
        phoneWhats: [consultant.data_shop.phoneWhats, Validators.required],
        responsibleMail: [consultant.data_shop.responsibleMail, Validators.email],
        officeHours: [consultant.data_shop.officeHours, Validators.required],
      }),
      status: [consultant.status, Validators.required]
    });
  }

  getCep() {
    if (this.dataShopForm.get('address_shop.zipCode').value !== '') {
      this._sharedService.getAddressCep(this.dataShopForm.get('address_shop.zipCode').value).subscribe(
        (response: any) => {
          this.dataShopForm.get('address_shop.city').setValue(response.localidade);
          this.dataShopForm.get('address_shop.neighborhood').setValue(response.bairro);
          this.dataShopForm.get('address_shop.address').setValue(response.logradouro);
          this.dataShopForm.get('address_shop.state').setValue(response.uf);
        },
        err => {
          console.log('CEP não encontrado');
        }
      );
    }
  }

  sendForm() {
    if (this.dataShopForm.get('data_shop.typeShop').value === '') {
      this.dataShopForm.get('data_shop.typeShop').setValue('fisica');
    }
    if (this.dataShopForm.get('address_shop.showInMap').value === '') {
      this.dataShopForm.get('address_shop.showInMap').setValue(true);
    }
    if (this.dataShopForm.get('status').value === '') {
      this.dataShopForm.get('status').setValue('I');
    }
    if (this.dataShopForm.valid) {
      if (this.shop.subDomain != null) {
        this.dataShopForm.get('status').setValue('A');
        this._sharedService.putConsultantHJ('Y').subscribe();
      }
      this._sharedService.putConsultants(this.dataShopForm.value).subscribe(
        response => {
          if (response.return) {
            this._hyperToastsService.addToast('success', 'Parabéns', response.msg);
            this._sharedService.setOwnerStore(this.shop);
          } else {
            this._hyperToastsService.addToast('warn', 'Atenção', response.msg);
          }
        },
        err => { this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro inesperado. Atualize a página e tente novamente'); }
      );
    } else {
      this.validateAllFormFields(this.dataShopForm);
    }
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
}

