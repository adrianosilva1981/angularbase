import { Component, OnInit, Input } from '@angular/core';
import { HyperToastsService, BroadcastEventService } from 'lib-services';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { SharedService } from '@app-hyper-store/services/shared.service';


@Component({
  selector: 'app-hyper-store-thumbnail-gift-card',
  templateUrl: './thumbnail-gift-card.component.html',
  styleUrls: ['./thumbnail-gift-card.component.less']
})
export class ThumbnailGiftCardComponent implements OnInit {


  @Input() itemObject: any;

  public defaultImage: any;
  public sold = 0;
  public used = 0;
  constructor(
    private _route: Router,
    private confirmationService: ConfirmationService,
    private _sharedService: SharedService,
    private _hyperToastsService: HyperToastsService
  ) {
    this.defaultImage = '/global/img/image_default.png';
  }

  ngOnInit() {
    this._sharedService.getTotalVoucherById({ id: this.itemObject.id }).subscribe(
      (response: any) => {
        if (response.return) {
          this.sold = response.data[0].totalSold;
          this.used = response.data[0].totalUsed;
        }
      });
  }

  editThis() {
    this._route.navigate(['/supplier/voucher-register/' + this.itemObject.id], { skipLocationChange: true });
  }

  removeThis() {
    this.confirmationService.confirm({
      message: 'Você tem certeza que deseja excluir este Cupom Smart? Essa ação NÃO poderá ser desfeita!',
      acceptLabel: 'EXCLUIR',
      rejectLabel: 'Cancelar',
      accept: () => {
        const objDelete = {
          id: this.itemObject.id,
          idSupplier: this.itemObject.idSupplier
        };
        this._sharedService.deleteGiftCard(objDelete).subscribe(
          (response: any) => {
            if (response.return) {
              BroadcastEventService.event('onDeleteGiftCard').emit(true);
              this._hyperToastsService.addToast('success', '', response.msg);
            } else {
              this._hyperToastsService.addToast('warning', '', response.msg);
            }
          },
          err => { this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro ao listar as categorias'); }
        );
      }
    });
  }

}
