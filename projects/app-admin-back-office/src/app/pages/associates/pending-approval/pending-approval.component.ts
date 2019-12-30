import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { SharedService } from '@app-admin-back-office/services/shared.service';
import { HyperToastsService } from 'lib-services';
import { Router } from '@angular/router';
import swal from 'sweetalert2';

@Component({
  selector: 'app-admin-back-office-pending-approval',
  templateUrl: './pending-approval.component.html',
  styleUrls: ['./pending-approval.component.less']
})
export class PendingApprovalComponent implements OnInit {

  users: any[];
  cols = [];
  status = [];

  constructor(
    private _sharedService: SharedService,
    private _hyperToastsService: HyperToastsService,
    private _router: Router
  ) {
    this.status = this._sharedService.listEnumStatus();
    this.setUsers();
  }

  ngOnInit() {
  }

  setUsers() {
    this._sharedService.getAssociatesPendingApproval().subscribe(
      response => {
        if (response.return) {
          this.users = response.data;
          Object.keys(this.users[0]).forEach(col => {
            this.setCols(col);
          });
        } else {
          this.users = [];
          this._hyperToastsService.addToast('warn', 'Atenção', response.msg);
        }
      },
      err => {
        this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro inesperado. Atualize a página e tente novamente');
        this._router.navigate(['/login']);
      }
    );
  }
  setCols(col: string) {
    switch (col) {
      case 'name':
        this.cols.push({
          field: col,
          header: 'Nome',
        });
        break;
      case 'username':
        this.cols.push({
          field: col,
          header: 'Código',
        });
        break;
      case 'cnpj_cpf':
        this.cols.push({
          field: col,
          header: 'CNPJ/CPF',
        });
        break;
      case 'cellphone':
        this.cols.push({
          field: col,
          header: 'Celular',
        });
        break;
      case 'accession_value':
        this.cols.push({
          field: col,
          header: 'Valor de acesso',
        });
        break;

      // não faz nada
      case 'id':
      case 'id_reseller':
        break;
      default:
        this.cols.push({
          field: col,
          header: _.upperFirst(col).replace(new RegExp('_'), ' '),
        });
        break;
    }
  }

  updateUser(data) {
    swal({
      title: 'Deseja realmente ativar o associado?',
      text: 'A ativação não poderá ser desfeita!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        this._sharedService.updatePaymentByAdmin(data).subscribe(
          (answer: any) => {
            if (answer.return) {
              this._hyperToastsService.addToast('success', 'Successo', 'Alterações salvas com sucesso!');
              this._router.navigate(['/associates/pending-approval']);
              this.setUsers();
            } else {
              this._hyperToastsService.addToast('err', 'Erro', answer.msg);
            }
          },
          err => {
            console.log(err);
          }
        );
      }
    });
  }
}
