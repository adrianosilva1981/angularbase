import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { HyperToastsService } from 'lib-services';
import swal from 'sweetalert2';
import { environment } from '@env/app-back-office';
import { SharedService } from '@app-back-office/services/shared.service';


@Component({
  selector: 'app-back-office-tean-pre-register',
  templateUrl: './tean-pre-register.component.html',
  styleUrls: ['./tean-pre-register.component.less']
})
export class TeanPreRegisterComponent implements OnInit {

  public formGroup1: FormGroup;
  public preRegister: any = [];
  public enableActivate: true;

  constructor(
    private _sharedService: SharedService,
    private _hyperToastsService: HyperToastsService,
  ) { }

  ngOnInit() {
    this.getListPreRegister();
  }

  getListPreRegister() {
    this._sharedService.listPreRegister().subscribe(
      response => {
        if (response.return) {
          this.preRegister = response.data;
          this.enableActivate = response.isEnable;
        } else {
          this._hyperToastsService.addToast('warn', 'Atenção', response.msg);
        }
      },
      err => {
        this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro inesperado. Atualize a página e tente novamente');
      }
    );
  }

  ativeReseller(elem) {
    swal({
      title: 'Atenção!',
      text: 'Você quer usar seus pontos para ativar essa conexão?',
      type: 'warning',
      input: 'password',
      inputPlaceholder: 'Digite sua Contrasenha',
      inputAttributes: {
        autocapitalize: 'off',
        autocorrect: 'off'
      },
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#ff0d00',
      confirmButtonText: 'Sim, ativar agora!',
      cancelButtonText: 'Não, depois!',
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
      preConfirm: (valor) => {
        return fetch(environment.apiUrl + '/checkout/association', {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this._sharedService.getUserToken()
          }, method: 'POST', body: JSON.stringify({ countersing: valor, id_association: elem.id })
        })
          .then(response => {
            if (!response.ok) {
              throw new Error('Contrasenha Inválida!');
            }
            return response.json();
          })
          .catch(error => {
            swal.showValidationError(error);
          });
      },
      allowOutsideClick: () => !swal.isLoading()
    }).then((result) => {
      if (result.value) {
        if (result.value.return) {
          this.getListPreRegister();
          swal({ type: 'success', title: 'Parabens!', text: result.value.msg });
        } else {
          swal({ type: 'error', title: 'Erro!', text: result.value.msg });
        }
      }
    });
  }
}
