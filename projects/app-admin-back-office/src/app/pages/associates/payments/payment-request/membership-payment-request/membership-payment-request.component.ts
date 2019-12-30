import { HyperToastsService } from 'lib-services';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { SharedService } from '@app-admin-back-office/services/shared.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-admin-back-office-membership-payment-request',
  templateUrl: './membership-payment-request.component.html',
  styleUrls: ['./membership-payment-request.component.less']
})
export class MembershipPaymentRequestComponent implements OnInit {

  public associate: any;
  public optionsMethodPayment = [
    { label: 'Escolher Pagamento', value: null },
    { label: 'Cartão de Crédito', value: 'credit_card' },
    { label: 'Cripto Moeda', value: 'crypto_coins' },
    { label: 'Transferência Bancaria', value: 'transfer_bank' },
    { label: 'Crédito da Plataforma', value: 'platform_credit' }
  ];


  constructor(
    private _activatedRoute: ActivatedRoute,
    private _sharedService: SharedService,
    private _hyperToastsService: HyperToastsService,
    private _router: Router
  ) {
    this.setAssociates(this._activatedRoute.snapshot.params.username);
  }

  ngOnInit() {
  }

  setAssociates(username: string) {
    this._sharedService.getInfoMembershipPaymentRequest(username).subscribe(
      response => {
        if (response.return) {
          this.associate = response.data;
        } else {
          this._hyperToastsService.addToast('warn', 'Atenção', response.msg);
        }
      },
      err => {
        this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro inesperado. Atualize a página e tente novamente');
      }
    );
  }

  paymentRequestSweet(paymentMethod: string = null, paymentMethodlabel: string = null) {
    if (!paymentMethod) {
      this._hyperToastsService.addToast('warn', 'Atenção', 'Escolha um método de pagamento');
      return;
    }
    const data = { paymentMethod: paymentMethod, idReseller: this.associate.id };
    swal({
      title: 'Solicitação de Pagamento?',
      text: 'Tem certeza que deseja solicitar o pagamento do Associado ' + this.associate.name +
        '\ncom o valor de R$1497,00' + '\npor meio de ' + paymentMethodlabel + ' ?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'green',
      cancelButtonColor: 'red',
    }).then((result) => {
      if (result.value) {
        this.paymentRequest(data);
      }
    });
  }

  paymentRequest(data: { paymentMethod: string, idReseller: number }) {
    this._sharedService.setMembershipPaymentRequest(data).subscribe(
      response => {
        if (response.return) {
          this._hyperToastsService.addToast('success', 'Sucesso', response.msg);
        } else {
          this._hyperToastsService.addToast('warn', 'Atenção', response.msg);
          console.warn(response);
        }
      },
      err => {
        this._hyperToastsService.addToast('error', 'Error', err.msg);
        console.error(err);
      },
       () => {
        this._router.navigate(['/associates/payments/payment-request']);
      }
    );
  }
}
