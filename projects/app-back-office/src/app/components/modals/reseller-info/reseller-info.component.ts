import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material';
import { environment } from '@env/app-back-office';
import { SharedService } from '@app-back-office/services/shared.service';
import { HyperToastsService } from 'lib-services';
import { MoveChangeResellerComponent } from '@app-back-office/components/modals/move-change-reseller/move-change-reseller.component';

@Component({
  selector: 'app-back-office-reseller-info',
  templateUrl: './reseller-info.component.html',
  styleUrls: ['./reseller-info.component.less']
})
export class ResellerInfoComponent implements OnInit {

  public objUser: any = {};
  public legBranchReseller;
  public showMove = false;
  public showAdd = false;
  public status: any = {
    A: 'Ativo',
    AA: 'Inativo',
    AP: 'Pendente - Aguardando Pagamento',
    AC: 'Pendente - Cadastro Incompleto'
  };

  public env = environment;

  constructor(
    public _dialog: MatDialog,
    private _sharedService: SharedService,
    private _hyperToastsService: HyperToastsService,
    public dialogRef: MatDialogRef<ResellerInfoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit() {
    // console.log(this.data);
    this.objUser = this._sharedService.getCookieReseller();
    this.getDetailsLeg();
  }

  getDetailsLeg() {
    this._sharedService.getLegDetails({ source_reseller: this.data.id }).subscribe(
      response => {
        if (response.return) {
          this.legBranchReseller = response.data;
          this.updateOptionsViewer();
        }
      },
      err => {
        this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro inesperado. Atualize a página e tente novamente');
      }
    );
  }

  updateOptionsViewer() {
    if (this.data.status == 'A' && this.data.level_real > 0 && (this.legBranchReseller == 'A' || this.legBranchReseller == 'B')) {
      this.showAdd = true;
    }

    if (this.legBranchReseller == 'C' && this.data.status == 'A' && this.data.level_real == 1) {
      this.showMove = true;
    }
  }

  closeModal() {
    this.dialogRef.close();
  }

  isOS() {
    return navigator.userAgent.match(/ipad|iphone/i);
  }

  copyToClipboard(text: string) {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = text;
    document.body.appendChild(selBox);
    if (this.isOS()) {
      const range = document.createRange();
      range.selectNodeContents(selBox);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      selBox.setSelectionRange(0, 999999);
    } else {
      selBox.focus();
      selBox.select();
    }
    document.execCommand('copy');
    document.body.removeChild(selBox);

    this._hyperToastsService.addToast('success', 'Sucesso', 'Link Copiado!');
  }

  openModalMove(action) {
    this.closeModal();
    this._dialog.open(MoveChangeResellerComponent, {
      data: {
        action: action,
        id_reseller: this.data.id
      },
      panelClass: 'globalModalHJ'
    });
  }
}
