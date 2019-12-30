import { Component, OnInit } from '@angular/core';
import { SharedService } from '@app-back-office/services/shared.service';
import { HyperToastsService } from 'lib-services';
import swal from 'sweetalert2';

@Component({
  selector: 'app-back-office-bitcoin',
  templateUrl: './bitcoin.component.html',
  styleUrls: ['./bitcoin.component.less']
})
export class BitcoinComponent implements OnInit {

  public creditok = false;
  // public credit: any = {};
  public totalcredit: any = {};

  public package: any = [];
  public association: any = {};
  public associationok = false;
  public paymentBitcoin = false;

  public rowsperpage: any = [10, 20, 50, 100];

  public methodPay: any = {
    transfer_bank: 'Tranferência Bancária',
    crypto_coins: 'Crypto Moedas',
    platform_credit: 'Saldo da Plataforma'
  };

  constructor(
    private _sharedService: SharedService,
    private _hyperToastsService: HyperToastsService,
  ) {

  }

  ngOnInit() {

    this._sharedService.getpackages('all').subscribe(response => {
      if (response.return) {
        this.paymentBitcoin = true;
        this.package = response.data;
        // console.log(response.data);
      } else {
        this.paymentBitcoin = false;
      }
    },
      err => {
        this.paymentBitcoin = false;
        this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro inesperado. Atualize a página e tente novamente');
      }
    );

    this.associate();

  }

  associate() {
    this._sharedService.getAssociation().subscribe(response2 => {
      if (response2.return) {
        this.association = response2.data;
        let idx = 0;
        this.association.forEach(element => {
          this.association[idx].creation_date = new Date(element.creation_date.replace(' ', 'T')).toLocaleDateString();
          idx++;
        });
        this.getCredit();
        this.associationok = true;
        //console.log(this.association);
      } else {
        this.associationok = false;
      }
    },
      err => {
        this.associationok = false;
        this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro inesperado. Atualize a página e tente novamente');
      }
    );
  }

  solicite(id, url, method) {
    const obj = {
      id_package: id,
      method: method
    };
    this._sharedService.postAssociation(obj).subscribe(response => {
      if (response.return) {
        if (method === 'crypto_coins') {
          this._hyperToastsService.addToast('success', 'Sucesso', response.msg);
          window.open(url, '_blank');
        } else if (method === 'transfer_bank') {
          swal({
            type: 'success',
            width: 800,
            title: 'Solicitação efetuada!',
            html: 'Envie um e-mail para: <span style="color: blue;"><b>financeiro@youhub.com.br</b></span>. <br> Informe a quantidade de Ativações e solicite as instruções.'
          });
        } else if (method === 'platform_credit') {
          this._hyperToastsService.addToast('success', 'Sucesso', response.msg);
        }
        this.associate(); //atualiza solicitações
      } else {
        this._hyperToastsService.addToast('warn', 'Atenção', response.msg);
      }
    },
      err => {
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
         // this.credit = response.data.release_points;
          this.totalcredit = response.data.total_points;
        }
      },
      err => {
        this.creditok = false;
        this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro inesperado. Atualize a página e tente novamente');
      }
    );
  }


}
