import { HyperToastsService } from 'lib-services';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { SharedService } from '@app-admin-back-office/services/shared.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-admin-back-office-connection-request-authorization',
  templateUrl: './connection-request-authorization.component.html',
  styleUrls: ['./connection-request-authorization.component.less']
})
export class ConnectionRequestAuthorizationComponent implements OnInit {
  public associate: any;
  public payment: any;
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
    this._sharedService.getInfoConnectionRequestAssociate(username).subscribe(
      response => {
        if (response.return) {
          this.associate = JSON.parse(response.data.reseller);
          this.payment = JSON.parse(response.data.payment);
        } else {
          this._hyperToastsService.addToast('warn', 'Atenção', response.msg);
        }
      },
      err => {
        this._hyperToastsService.addToast('error', 'Erro', err.msg);
      }
    );
  }

  labelMethod(value: string): string {
    // tslint:disable-next-line:no-unused-expression
    return this.optionsMethodPayment.filter(x => x.value === value)[0].label || null;
  }

  connectionRequestSweet(file: File, reason: string) {
    if (!file) {
      this._hyperToastsService.addToast('warn', 'Atenção', 'Imagem do pagamento é requerida');
      return;
    } else if (reason.length < 5) {
      this._hyperToastsService.addToast('warn', 'Atenção', 'Motivo do pagamento é requerido');
      return;
    }
    swal({
      title: 'Conexão?',
      text: 'Tem certeza que deseja conectar o Associado ' + this.associate.name +
        '\ncom o pagamento no valor de R$' + this.payment.accession_value +
        '\npor meio de ' + this.labelMethod(this.payment.method) + ' ?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'green',
      cancelButtonColor: 'red',
    }).then((result) => {
      if (result.value) {
        this.uploadImage(file, reason);
      }
    });
  }

  uploadImage(file: File, reason: string) {
    this._sharedService.postImageS3('admin', file).subscribe(
      response => {
        if (response.return) {
          const url = response.data;
          this.connectionRequest(url, reason);
        } else {
          this._hyperToastsService.addToast('error', 'Error', 'Aconteceu um error ao tentar subir a image.');
          console.warn(response);
        }
      },
      err => {
        this._hyperToastsService.addToast('error', 'Error', 'Aconteceu um error ao tentar subir a image.');
        console.error(err);
      }
    );
  }

  connectionRequest(url: string, reason: string) {
    const data = { url: url, idStateMemberShip: this.payment.id, idReseller: this.associate.id, reason: reason };
    this._sharedService.setConnectionRequestAssociate(data).subscribe(
      response => {
        if (response.return) {
          this._hyperToastsService.addToast('success', 'Sucesso', response.msg);
        } else {
          this._hyperToastsService.addToast('warn', 'Atenção', response.msg);
          console.warn(response);
        }
      },
      err => {
        this._hyperToastsService.addToast('Error', 'Error', err.msg);
        console.error(err);
      },
      () => {
        this._router.navigate(['/associates/payments/connections']);
      }
    );
  }

}
