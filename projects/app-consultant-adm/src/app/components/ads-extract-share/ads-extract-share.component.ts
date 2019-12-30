import { Component, OnInit, Input } from '@angular/core';
import { SharedService } from '@app-consultant-adm/services/shared.service';
import { HyperToastsService } from 'lib-services';
import { ConfirmationService } from 'primeng/api';
import { MatDialog } from '@angular/material';
import { ShareDisapprovedComponent } from './share-disapproved/share-disapproved.component';

@Component({
  selector: 'app-consultant-adm-ads-extract-share',
  templateUrl: './ads-extract-share.component.html',
  styleUrls: ['./ads-extract-share.component.less']
})
export class AdsExtractShareComponent implements OnInit {

  @Input() action: any;
  @Input() publicity: any;

  load = false;
  data = [];

  cols = [
    { field: 'photoUrl', header: 'Foto' },
    { field: 'name', header: 'Usuário' },
    { field: 'nrShare', header: 'Nr° para compartilhar' },
  ];

  constructor(
    private _dialog: MatDialog,
    private _sharedService: SharedService,
    private _hyperToastsService: HyperToastsService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit() {
    this.load = true;
    this._sharedService.listPublicityExtract(this.action, this.publicity.id).subscribe(
      (response: any) => {
        if (response.return) {
          if (response.data.prints !== null) {
            response.data.prints.map(element => {
              if (element.prints !== null) {
                element.prints = JSON.parse('[' + element.prints + ']');
              }
            });
          }

          if (response.data.prints.length > 0) {
            this.data = response.data.prints;
          }
        } else {
          this._hyperToastsService.addToast('warn', '', response.msg);
        }
        this.load = false;
      },
      err => { this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro inesperado. Atualize a página e tente novamente'); }
    );
  }

  onApproved(data) {
    this.confirmationService.confirm({
      header: 'Aprovar',
      message: 'Deseja aprovar este compartilhamento? Esta ação é irreversível.',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      accept: () => {
        const obj = {
          id: data.id,
          action: 'approved'
        };
        this._sharedService.validSharePrint(obj).subscribe(
          (response: any) => {
            if (response.return) {
              this._hyperToastsService.addToast('success', 'Sucesso', response.msg);
              data.status = 'AP';
            } else {
              this._hyperToastsService.addToast('warn', 'Atnção', response.msg);
            }
          },
          err => { this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro inesperado. Atualize a página e tente novamente'); }
        );
      }
    });
  }

  onDisapproved(data) {
    const dialogRef = this._dialog.open(ShareDisapprovedComponent, {
      data: { data }
    });

    dialogRef.afterClosed().subscribe(
      result => {
        if (result) {
          data.status = 'RP';
        }
      }
    );

  }
}
