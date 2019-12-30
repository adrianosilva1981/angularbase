import { Component, OnInit } from '@angular/core';
import { SharedService } from '@app-admin-back-office/services/shared.service';
import { HyperToastsService } from 'lib-services';
import * as _ from 'lodash';
import swal from 'sweetalert2';

@Component({
  selector: 'app-admin-back-office-prepaid-card',
  templateUrl: './prepaid-card.component.html',
  styleUrls: ['./prepaid-card.component.less']
})
export class PrepaidCardComponent implements OnInit {

  public associates: any[] = [];
  public cols: any[] = [];


  constructor(
    private _sharedService: SharedService,
    private _hyperToastsService: HyperToastsService
  ) {
    this.setAssociates();
  }

  ngOnInit() {
  }

  setAssociates() {
    this.associates = [];
    this.cols = [];
    this._sharedService.getAssociatesPrepaidCard().subscribe(
      response => {
        if (response.return) {
          this.associates = response.data;
          Object.keys(this.associates[0]).forEach((col: string) => {
            this.setCols(col);
          });
        } else {
          this._hyperToastsService.addToast('warn', 'Atenção', response.msg);
          console.log(response);
        }
      },
      err => {
        this._hyperToastsService.addToast('error', 'Error', 'Aconteceu algum erro, entre em contato com o Suporte!');
        console.error(err);
      }
    );
  }
  setCols(col: string) {
    switch (col) {
      case 'username':
        this.cols.push({
          field: col,
          header: 'Código'
        });
        break;
      case 'name':
        this.cols.push({
          field: col,
          header: 'Nome'
        });
        break;
      case 'email':
        this.cols.push({
          field: col,
          header: 'Email'
        });
        break;
      case 'request_date':
        this.cols.push({
          field: col,
          header: 'Requisição do cartão'
        });
        break;
      case 'cpf_cnpj':
        this.cols.push({
          field: col,
          header: 'CPF/CNPJ'
        });
        break;
      case 'id':
        break;
      default:
        this.cols.push({
          field: col,
          header: _.upperCase(col).replace(new RegExp('_'), ' ')
        });
        break;
    }
  }

  approvedPrepaidCardSwal(associate) {
    swal({
      title: 'Autorizar!',
      text: 'Tem certeza que deseja autorizar o cartão Pré-pago de ' + associate.name + '?',
      type: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
      input: 'number',
      inputValue: '',
      inputPlaceholder: 'Número do Cartão',
      inputValidator: (value: string) => {
        // tslint:disable-next-line:radix
        return !(parseInt(value) > 0) && 'É necessário inserir um cartão!';
      },
    }).then(
      (result) => {
        if (!result.dismiss) {
          this.approvedPrepaidCard(result.value, associate);
        }
      },
      err => {
        throw new Error('Method not implemented.');
      });
  }
  approvedPrepaidCard(value: number, associate: any) {
    const data = {
      associate: associate.id,
      prepaid_card: value
    };
    this._sharedService.approvedPrepaidCard(data).subscribe(
      response => {
        if (response.return) {
          this._hyperToastsService.addToast('success', 'Sucesso', response.msg);
          this.setAssociates();
        } else {
          this._hyperToastsService.addToast('warn', 'Atenção', response.msg);
          console.log(response);
          this.setAssociates();
        }
      },
      err => {
        this._hyperToastsService.addToast('error', 'Error', 'Aconteceu algum problema, entre em contato com o Suporte!');
        console.error(err);
      }
    );
  }


}
