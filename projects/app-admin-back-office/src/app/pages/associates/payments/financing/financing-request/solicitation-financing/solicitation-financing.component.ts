import { HyperToastsService } from 'lib-services';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { SharedService } from '@app-admin-back-office/services/shared.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-admin-back-office-solicitation-financing',
  templateUrl: './solicitation-financing.component.html',
  styleUrls: ['./solicitation-financing.component.less']
})
export class SolicitationFinancingComponent implements OnInit {

  public associate: any;
  public currencyMask = { prefix: 'R$ ', thousands: '.', decimal: ',', align: 'center' };
  public qtdMask = { prefix: '', thousands: '.', decimal: ',', align: 'center', precision: 0 };
  public connection: number;
  public initValue: number;
  public finacing: number;
  public parcel: number;

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
    this._sharedService.getAssociateByUsername(username).subscribe(
      response => {
        if (response.return) {
          this.associate = response.data;
          console.log(response.data);
        } else {
          this._hyperToastsService.addToast('warn', 'Atenção', response.msg);
        }
      },
      err => {
        this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro inesperado. Atualize a página e tente novamente');
      }
    );
  }

  paymentRequestSweet() {
    if (this.connection != 1497.00) {
      this._hyperToastsService.addToast('warn', 'Atenção', 'Valor da conexão diferente do atual!');
    }
    if (this.connection < 1297.00) {
      this._hyperToastsService.addToast('warn', 'Atenção', 'Valor da conexão abaixo do permitido!');
      return;
    }
    if (this.connection != (this.initValue + this.finacing) ) {
      this._hyperToastsService.addToast('warn', 'Atenção', 'Valores Entrada e Financiado com erro, conferir.');
      return;
    }
    if (this.parcel < 0 || this.parcel > 4) {
      this._hyperToastsService.addToast('warn', 'Atenção', 'Número máximo de parcelas = 4.');
      return;
    }
    const data = { idReseller: this.associate.id, vrConnection: this.connection, vrInit: this.initValue, vrFinancing: this.finacing, qtParcel: this.parcel };
    swal({
      title: 'Solicitação de Financiamento?',
      text: 'Tem certeza que deseja solicitar o financiamento para o Associado ' + this.associate.name +
        '\ncom o valor de ' + this.finacing + '\npor meio de ' + this.parcel + ' parcelas?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'green',
      cancelButtonColor: 'red',
    }).then((result) => {
      if (result.value) {
        this.financingRequest(data);
      }
    });
  }

  financingRequest(data: { idReseller: number, vrConnection: number, vrInit: number, vrFinancing: number, qtParcel: number }) {
    this._sharedService.setFinancingRequest(data).subscribe(
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
        this._router.navigate(['/associates/payments/financing-request']);
      }
    );
  }
}
