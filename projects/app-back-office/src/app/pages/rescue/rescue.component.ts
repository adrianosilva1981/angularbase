import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SharedService } from '@app-back-office/services/shared.service';
import { HyperToastsService } from 'lib-services';
import { BroadcastEventService } from 'lib-services';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { environment } from '@env/app-back-office/';

@Component({
  selector: 'app-back-office-rescue',
  templateUrl: './rescue.component.html',
  styleUrls: ['./rescue.component.less']
})
export class RescueComponent implements OnInit {

  public urlApiImage = environment.apiPhpV2 + 'tools/upload';

  // public PHONEMASK = ['(', /[1-9]/, /[1-9]/, ')', ' ', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  // public PHONE_REGEX: RegExp = /^(?:\()[0-9]{2}(?:\))\s?9?[0-9]{4}(?:-)[0-9]{4}$/;
  public NUMBER_REGEX: RegExp = /^[0-9]*$/;

  public rescueok = false;
  public rescue: any = {};

  public creditok = false;
  public credit: any = {};

  public reseller: any = {};
  public rescueForm: FormGroup;
  public rescueFormCrypto: FormGroup;
  public rescueFormTranfers: FormGroup;
  public maskMoney = { prefix: 'R$ ', thousands: '.', decimal: ',' };

  constructor(
    private _sharedService: SharedService,
    private _hyperToastsService: HyperToastsService,
    private _router: Router,
  ) {
    BroadcastEventService.event('changeLink').emit('rescue');
    this.reseller = this._sharedService.getCookieReseller() || ''; // pega info do reseller
  }

  ngOnInit() {
    this.mountForm();
    this.getRescue();
    this.getCredit();
  }

  mountForm() {
    this.rescueForm = new FormGroup({
      priceForm: new FormGroup({
        value_cash: new FormControl({ value: '', disabled: this.reseller.type === 'B' }, Validators.compose([Validators.required, Validators.min(1.0)]))
      }),
      priceFormCrypto: new FormGroup({
        value_cash_crypto: new FormControl({ value: '', disabled: this.reseller.type === 'P' }, Validators.compose([Validators.required, Validators.min(1.0)])),
        value_wallet: new FormControl({ value: '', disabled: this.reseller.type === 'P' }, Validators.compose([Validators.required]))
      }),
      priceFormTranfers: new FormGroup({
        value_cash_tranfers: new FormControl({ value: '', disabled: this.reseller.type === 'P' }, Validators.compose([Validators.required, Validators.min(1.0)])),
        value_bank_holderName: new FormControl({ value: '', disabled: this.reseller.type === 'P' }, Validators.compose([Validators.required])),
        value_bank_id: new FormControl({ value: '', disabled: this.reseller.type === 'P' }, Validators.compose([Validators.required, Validators.pattern(this.NUMBER_REGEX)])),
        value_bank_name: new FormControl({ value: '', disabled: this.reseller.type === 'P' }, Validators.compose([Validators.required])),
        value_agence: new FormControl({ value: '', disabled: this.reseller.type === 'P' }, Validators.compose([Validators.required])),
        value_acount: new FormControl({ value: '', disabled: this.reseller.type === 'P' }, Validators.compose([Validators.required]))
      })
    });
  }

  noValidForm(form) {

  }

  solicitecard() {
    this._router.navigate(['office/prepaidcard']);
  }

  sendRescue(metodo) {
    let valor = 0;
    swal({
      title: 'Atenção!',
      html: '<p>Você confirma a solicitação de saque?</p>A informação da carteira BitCoin e as informações bancárias são de total responsabilidade do titular, você confirma que suas informações estão corretas?',
      type: 'warning',
      input: 'password',
      inputPlaceholder: 'Digite sua Contrasenha',
      inputAttributes: { autocapitalize: 'off', autocorrect: 'off' },
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#ff0d00',
      confirmButtonText: 'Sim, confirmo',
      cancelButtonText: 'Não',
      confirmButtonClass: 'btn btn-success',
      cancelButtonClass: 'btn btn-danger',
      buttonsStyling: false,
      reverseButtons: true,
      inputValidator: (value) => {
        if (!value) {
          return 'Contrassenha obrigatória!';
        }
        if (value.length != 4) {
          return 'Contrassenha de 4 dígitos!';
        }
      },
      showLoaderOnConfirm: true,
      preConfirm: (pass) => {

        switch (metodo) {
          case 'prepaid_card':
            valor = this.rescueForm.get('priceForm.value_cash').value;
            const rescueObj = {
              method: metodo,
              value: valor,
              countersing: pass
            };
            this.postRescue(rescueObj);
            break;
          case 'crypto_coins':

            const wallet = {
              hash_wallet: this.rescueForm.get('priceFormCrypto.value_wallet').value,
              countersing: pass
            };

            this._sharedService.postWallet(wallet).subscribe(response => {
              // console.log(response);
              if (response.return) {

                valor = this.rescueForm.get('priceFormCrypto.value_cash_crypto').value;

                const rescueObj = {
                  id_wallet: response.data.id,
                  method: metodo,
                  value: valor,
                  countersing: pass
                };

                this.postRescue(rescueObj);

              } else {
                this._hyperToastsService.addToast('warn', 'Atenção', response.msg);
              }
            },
              err => {
                this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro inesperado. Atualize a página e tente novamente');
              }
            );

            break;
          case 'transfer_bank':

            const account = {
              holder_name: this.rescueForm.get('priceFormTranfers.value_bank_holderName').value,
              bank_code: this.rescueForm.get('priceFormTranfers.value_bank_id').value,
              bank_name: this.rescueForm.get('priceFormTranfers.value_bank_name').value,
              agency_number: this.rescueForm.get('priceFormTranfers.value_agence').value,
              account_number: this.rescueForm.get('priceFormTranfers.value_acount').value,
              type_account: 'CC',
              countersing: pass
            };

            this._sharedService.postAccount(account).subscribe(response => {

              if (response.return) {
                valor = this.rescueForm.get('priceFormTranfers.value_cash_tranfers').value;

                const rescueObj = {
                  id_account: response.data.id,
                  method: metodo,
                  value: valor,
                  countersing: pass
                };

                this.postRescue(rescueObj);

              } else {
                this._hyperToastsService.addToast('warn', 'Atenção', response.msg);
              }
            },
              err => {
                this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro inesperado. Atualize a página e tente novamente');
              }
            );

            break;
          default:
            this._hyperToastsService.addToast('warn', 'Atenção', 'Método de pagamento inválido!');
            break;
        }
      },
      allowOutsideClick: () => !swal.isLoading()
    });

  }

  getRescue() {
    this.rescueok = false;
    this._sharedService.getRescue().subscribe(
      response2 => {
        // console.log(response2);
        if (response2.return) {
          this.rescueok = true;
          this.rescue = response2.data;
          let idx = 0;
          this.rescue.forEach(element => {
            this.rescue[idx].creation_date = new Date(element.creation_date.replace(' ', 'T')).toLocaleDateString();
            idx++;
          });
          this.getCredit();
        } else {
          this.rescueok = false;
        }
      },
      err => {
        this.rescueok = false;
        this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro inesperado. Atualize a página e tente novamente');
      }
    );
  }

  getCredit() {
    this.creditok = false;
    this._sharedService.getCredit().subscribe(
      response => {
        // console.log(response);
        if (response.return) {
          this.creditok = true;
          this.credit = response.data.release_points;
        }
      },
      err => {
        this.creditok = false;
        this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro inesperado. Atualize a página e tente novamente');
      }
    );
  }

  postRescue(rescueObj) {
    this._sharedService.postRescue(rescueObj).subscribe(response2 => {
      if (response2.return) {
        this._hyperToastsService.addToast('success', 'Sucesso', response2.msg);
        this.getRescue();

        this.rescueForm.get('priceForm.value_cash').setValue('');

        this.rescueForm.get('priceFormCrypto.value_cash_crypto').setValue('');
        this.rescueForm.get('priceFormCrypto.value_wallet').setValue('');

        this.rescueForm.get('priceFormTranfers.value_bank_holderName').setValue('');
        this.rescueForm.get('priceFormTranfers.value_bank_id').setValue('');
        this.rescueForm.get('priceFormTranfers.value_bank_name').setValue('');
        this.rescueForm.get('priceFormTranfers.value_agence').setValue('');
        this.rescueForm.get('priceFormTranfers.value_acount').setValue('');
        this.rescueForm.get('priceFormTranfers.value_cash_tranfers').setValue('');

      } else {
        if (response2.code == 404) {
          swal({
            title: 'Você não está ativado!',
            text: 'Para solicitar resgate você precisa estar ativo.',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#ff0d00',
            confirmButtonText: 'Pagar',
            cancelButtonText: 'Cancelar',
            buttonsStyling: true,
            reverseButtons: false
          }).then((result) => {
            if (result.value === true) {
              this._router.navigate(['office/monthly']);
            }
          });
        } else {
          this._hyperToastsService.addToast('warn', 'Atenção', response2.msg);
        }
      }
    },
      err => {
        this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro inesperado. Atualize a página e tente novamente');
      }
    );
  }

  changeImageDocumentNf(id, evt) {

    // console.log(id, evt);
    if (evt) {
      this.validateImageNf(id, evt);
    } else {
      this._hyperToastsService.addToast('warn', 'Atenção', 'Não foi possivel realizar o upload da imagem');
    }
  }

  validateImageNf(id, url) {
    const objPhoto = {
      id_order: id,
      type_document: 'nf',
      url: '//' + url
    };

    // console.log(objPhoto);
    this._sharedService.validateImageDocument(objPhoto).subscribe(
      response => {
        if (response.return) {
          this._hyperToastsService.addToast('success', 'Sucesso', response.msg);
          this.getRescue();
        } else {
          this._hyperToastsService.addToast('warn', 'Atenção', response.msg);
        }
      },
      err => {
        this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro inesperado. Atualize a página e tente novamente');
      }
    );
  }
}
