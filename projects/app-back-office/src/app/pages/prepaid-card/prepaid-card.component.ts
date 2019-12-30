import { Component, OnInit } from '@angular/core';
import { SharedService } from '@app-back-office/services/shared.service';
import { HyperToastsService } from 'lib-services';
import swal from 'sweetalert2';
import { BroadcastEventService } from 'lib-services';

@Component({
  selector: 'app-back-office-prepaid-card',
  templateUrl: './prepaid-card.component.html',
  styleUrls: ['./prepaid-card.component.less']
})
export class PrepaidCardComponent implements OnInit {

  public cardPrepaidok = false;
  public cardPrepaid: any = {};
  public reseller: any = {};
  public status: any = { requested: 'Solicitação em Andamento', refused: 'Solicitação Recusada', approved: 'Solicitação Aprovada' };

  constructor(
    private _sharedService: SharedService,
    private _hyperToastsService: HyperToastsService,
  ) {
    this.reseller = this._sharedService.getCookieReseller() || ''; // pega info do reseller
    BroadcastEventService.event('changeLink').emit('prepaidcard');
    this.atualizeprepaid();
  }

  ngOnInit() {}

  atualizeprepaid() {
    this.cardPrepaidok = false;
    this._sharedService.getPrepaid().subscribe(
      response => {
        if (response.return) {
          // console.log(response.data);
          this.cardPrepaidok = true;
          this.cardPrepaid = response.data;
          let idx = 0;
          this.cardPrepaid.forEach(element => {
            this.cardPrepaid[idx].request_date = new Date(element.request_date.replace(' ', 'T')).toLocaleDateString();
            idx++;
          });
        } else {
          this.cardPrepaidok = false;
        }
      },
      err => {
        this.cardPrepaidok = false;
        this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro inesperado. Atualize a página e tente novamente');
      }
    );
  }

  postPrepaid() {
    if (this.reseller.recognition_name !== '' && this.reseller.recognition_name !== null) {
      swal({
        title: 'Atenção!',
        text: 'Tem certeza que quer realizar esta ação?',
        type: 'warning',
        input: 'password',
        inputPlaceholder: 'Digite sua Contrasenha',
        inputAttributes: { autocapitalize: 'off', autocorrect: 'off' },
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#ff0d00',
        confirmButtonText: 'Sim, tenho certeza',
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
          const obj = {
            countersing: pass
          };
          this.prepaidCard(obj);
          // console.log('ok');
        },
        allowOutsideClick: () => !swal.isLoading()
      });
    } else {
      this._hyperToastsService.addToast('warn', 'Atenção', 'Complete seu Perfil - Endereço.');
    }
  }

  prepaidCard(obj) {
    this._sharedService.postPrepaid(obj).subscribe(
      response2 => {
        if (response2.return) {
          // this.userObj = response.data;
          this.atualizeprepaid();
          this._hyperToastsService.addToast('success', 'Sucesso', response2.msg);
        } else {
          this._hyperToastsService.addToast('warn', 'Atenção', response2.msg);
        }
      },
      err => {
        this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro inesperado. Atualize a página e tente novamente');
      }
    );
  }


}
