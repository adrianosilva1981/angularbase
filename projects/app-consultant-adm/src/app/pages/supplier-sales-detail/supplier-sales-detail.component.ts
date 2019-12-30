import { Component, OnInit } from '@angular/core';
import { SharedService } from '@app-consultant-adm/services/shared.service';
import { HyperToastsService } from 'lib-services';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { FormGroup, FormControl } from '@angular/forms';
import swal from 'sweetalert2';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-consultant-adm-supplier-sales-detail',
  templateUrl: './supplier-sales-detail.component.html',
  styleUrls: ['./supplier-sales-detail.component.less']
})
export class SupplierSalesDetailComponent implements OnInit {

  public registerForm = new FormGroup({
    trackingCode: new FormControl(),
    nfXml: new FormControl(),
    _status: new FormControl()
  });

  public productInfo: any = [];
  public buyer: any;
  public codOrder = 0;
  public status: any;
  public payment_status: any;
  public myFile = [];
  public nfXmlUrl = '';
  public document = false;
  public documentUrl = '';
  public reason = '';
  public statusPayment = [
    {
      value: null,
      label: ''
    },
    {
      value: 'ET',
      label: 'Em Transito'
    },
    {
      value: 'FN',
      label: 'Entregue'
    },
    {
      value: 'C',
      label: 'Cancelado'
    }
  ];

  public _status = {
    'AP': 'Aguardando Pagamento',
    'PC': 'Pagamento Confirmado',
    'C': 'Cancelado',
    'PR': 'Pagamento Recusado',
    'ET': 'Em Trânsito',
    'FN': 'Entregue'
  };

  public amoutTotal = 0;

  constructor(
    private _sharedServices: SharedService,
    private _hyperToastsService: HyperToastsService,
    private _router: Router,
    private _location: Location,
    private confirmationService: ConfirmationService,
  ) { }

  ngOnInit() {
    this.validateProduct();
    this._sharedServices.addBreadCrumb(
      [
        { 'text': 'Dashboard', 'router': '/home' },
        { 'text': 'Pedidos', 'router': '/supplier-sales' },
        { 'text': 'Detalhes do Pedido', 'router': '' }
      ]
    );
  }

  validateProduct() {
    this.productInfo = this._sharedServices.getOneProductSupplier();
    if (this.productInfo === undefined) {
      this._router.navigate(['supplier-sales']);
    } else {
      this.productInfo.forEach(element => {

        try {
          element.extraInfo = JSON.parse(element.extraInfo);
        } catch (error) {
          element.extraInfo = [];
        }
        if (element.type_item === 'gift_code') {
          if (element.activation_date !== null) {
            element.checked = true;
          } else {
            element.checked = false;
          }
        }
      });

      this.editForm();
      this.status = this._status[this.productInfo[0].detail_status];
      this.codOrder = this.productInfo[0].id_buyShoppingOrder;
      this.nfXmlUrl = this.productInfo[0].nfXmlUrl;
      this.document = this.productInfo[0].nfXmlUrl !== null;
      this.payment_status = this._status[this.productInfo[0].STATUS];

      this.buyer = {
        name: this.productInfo[0].name,
        name_buyer: this.productInfo[0].name_buyer,
        CPF_buyer: this.productInfo[0].CPF_buyer,
        street: this.productInfo[0].street,
        number: this.productInfo[0].number,
        neighborhood: this.productInfo[0].neighborhood,
        complement: this.productInfo[0].complement,
        state: this.productInfo[0].state,
        city: this.productInfo[0].city,
        zipcode: this.productInfo[0].zipcode,
        date_creation: this.productInfo[0].date_creation,
        date_payment: this.productInfo[0].date_payment,
        freight_Company: this.productInfo[0].freight_Company,
        freight_value: this.productInfo[0].freight_value,
        phoneNumber: this.productInfo[0].phoneNumber
      };

      this.buyer.valueTotal = this.valueTotal(this.productInfo);
    }
  }


  editForm() {
    this.registerForm.get('trackingCode').setValue(this.productInfo[0].trackingCode);
    this.registerForm.get('nfXml').setValue(this.productInfo[0].nfXml);
    this.registerForm.get('_status').setValue(this.productInfo[0].detail_status);
  }

  onUpload(event, file) {
    this.myFile = [];
    for (const file of event.files) {
      this.myFile.push(file);
    }
  }

  onRemove() {
    this.myFile = [];
  }

  downloadFile() {
    window.open('//' + this.nfXmlUrl, '_blank');
  }

  submitCancelOrder() {
    swal({
      title: 'Atenção!',
      text: 'Deseja realmente cancelar o pedido?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
      input: 'text',
      inputValue: '',
      inputPlaceholder: 'Motivo',
      inputValidator: (value) => {
        return !value && 'Para cancelar, é necessário um motivo!';
      },
    }).then((result) => {
      if (!result.dismiss) {
        this.reason = result.value;
        this.submitUpdateOrder();
      }
    },
      err => {
        console.log(err);
      }
    );

  }

  submitUpdateOrder() {
    if (this.myFile.length > 0) {
      this._sharedServices.uploadDocument('shop/nfXml', this.myFile[0]).subscribe(
        response => {
          if (response.return) {
            this.documentUrl = response.data;
            const obj = {
              id: this.productInfo[0].id_buyShoppingOrder,
              idSupplier: this.productInfo[0].idSupplier,
              documentUrl: this.documentUrl,
              status: this.registerForm.get('_status').value,
              reason: this.reason,
              ...this.registerForm.value
            };
            this._sharedServices.postProductSupplier(obj).subscribe(
              response => {
                this._hyperToastsService.addToast('success', '', response.msg);
                this._location.back();
                // this._router.navigate(['/supplier-sales']);
              },
              err => { this._hyperToastsService.addToast('error', '', 'Ocorreu um erro, tente novamente mais tarde'); }
            );
          }
        }, err => {
          this._hyperToastsService.addToast('err', 'Erro', err.msg);
          return;
        }
      );
    } else {

      const obj = {
        id: this.productInfo[0].id_buyShoppingOrder,
        documentUrl: null,
        status: this.registerForm.get('_status').value,
        reason: this.reason,
        ...this.registerForm.value
      };
      this._sharedServices.postProductSupplier(obj).subscribe(
        response => {
          this._hyperToastsService.addToast('success', '', response.msg);
          this._location.back();
          // this._router.navigate(['/supplier-sales']);
        },
        err => { this._hyperToastsService.addToast('error', '', 'Ocorreu um erro, tente novamente mais tarde'); }
      );
    }
  }

  submit() {
    if ((document) && (this.myFile.length > 0)) {
      swal({
        title: 'Atenção!',
        text: 'Já existe um documento vinculado, deseja substituir?',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sim',
        cancelButtonText: 'Não',
      }).then((result) => {
        if (result.dismiss) {
          this.onRemove();
        }
        if (this.registerForm.get('_status').value == 'C') {
          this.submitCancelOrder();
        } else {
          this.submitUpdateOrder();
        }
      },
        err => {
          console.log(err);
        }
      );
    } else {
      if (this.registerForm.get('_status').value == 'C') {
        this.submitCancelOrder();
      } else {
        this.submitUpdateOrder();
      }
    }
  }

  checkedVoucher(element, index) {
    this.confirmationService.confirm({
      message: 'Você tem certeza que deseja marcar esse Voucher como Utilizado? Essa ação NÃO podera ser desfeita!',
      acceptLabel: 'Sim',
      rejectLabel: 'Cancelar',
      accept: () => {
        const data = {
          idBuyShoppingOrder: element.id_buyShoppingOrder,
          idBuyShoppingOrderDetails: element.idBuyShoppingOrderDetails
        };

        this._sharedServices.checkedVoucher(data).subscribe(
          (response: any) => {
            if (response.return) {
              element.activation_date = new Date();
            } else {
              this._hyperToastsService.addToast('warning', '', response.msg);
            }
          },
          err => { this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro ao listar as categorias'); }
        );
      },
      reject: () => {
        const a = document.getElementById('idx_' + index)['checked'] = false;
      }
    });
  }

  valueTotal(productInfo) {
    let total = 0;
    total = productInfo.reduce(function (total, element) {
      return total + parseFloat(element.value_Fornecedor);
    }, 0);

    const a = total += parseFloat(this.buyer.freight_value);
    return a;
  }
}
