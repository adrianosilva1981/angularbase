import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import swal from 'sweetalert2';
import { environment } from '@env/app-back-office';
import { SharedService } from '@app-back-office/services/shared.service';
import { HyperToastsService, BroadcastEventService } from 'lib-services';

@Component({
  selector: 'app-back-office-move-change-reseller',
  templateUrl: './move-change-reseller.component.html',
  styleUrls: ['./move-change-reseller.component.less']
})
export class MoveChangeResellerComponent implements OnInit {
  public objUser: any = {};
  public listResellers: any = [];
  public notAlowed = false;

  constructor(
    private _sharedService: SharedService,
    private _hyperToastsService: HyperToastsService,
    public dialogRef: MatDialogRef<MoveChangeResellerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.getDetailsLeg();
    this.objUser = this._sharedService.getCookieReseller();
  }

  closeModal() {
    this.dialogRef.close();
  }

  getDetailsLeg() {
    const obj: any = {
      laterality: 2
    };

    if (this.data.action && this.data.action === 'change') {
      obj.onlyAB = true;
    }

    this._sharedService.getListResellerPerAction(obj).subscribe(
      response => {
        if (response.return) {
          this.listResellers = response.data;
          this.notAlowed = response.notAlowed;
        }
      },
      err => {
        this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro inesperado. Atualize a página e tente novamente');
      }
    );
  }

  actionHere(itm) {
    const _self = this;
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
        itm.counter_sign = pass;
        switch (this.data.action) {
          case 'move':
            this.moveReseller(itm);
            break;
          case 'change':
            this.changeReseller(itm);
            break;
          default:
            this._hyperToastsService.addToast('warn', 'Atenção', 'Ação desconhecida');
            break;
        }
      },
      allowOutsideClick: () => !swal.isLoading()
    });
  }

  moveReseller(itm) {
    const obj = {
      reseller: this.data.id_reseller,
      host: itm.id,
      counter_sign: itm.counter_sign
    };

    this._sharedService.moveNetConnection(obj).subscribe(
      response => {
        if (response.return) {
          this.dialogRef.close();
          BroadcastEventService.event('onGotoTopTree').emit(this.objUser.id);
        } else {
          this._hyperToastsService.addToast('warn', 'Atenção', response.msg);
        }
      },
      err => {
        this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro inesperado. Atualize a página e tente novamente');
      }
    );
  }

  changeReseller(itm) {
    const obj = {
      reseller_ab: itm.id,
      reseller_c: this.data.id_reseller,
      counter_sign: itm.counter_sign
    };

    this._sharedService.changeNetConnection(obj).subscribe(
      response => {
        if (response.return) {
          this.dialogRef.close();
          BroadcastEventService.event('onGotoTopTree').emit(this.objUser.id);
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

