import { Component, OnInit, Input } from '@angular/core';
import { HyperToastsService, BroadcastEventService } from 'lib-services';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { SharedService } from '@app-consultant-adm/services/shared.service';


@Component({
    selector: 'app-consultant-adm-thumbnail-gift-card-sales',
    templateUrl: './thumbnail-gift-card-sales.component.html',
    styleUrls: ['./thumbnail-gift-card-sales.component.less']
})
export class ThumbnailGiftCardSalesComponent implements OnInit {


    @Input() itemObject: any;

    public defaultImage: String = '/global/img/image_default.png';
    // public sold = 0;
    // public used = 0;
    constructor(
        private _route: Router,
        private confirmationService: ConfirmationService,
        private _sharedService: SharedService,
        private _hyperToastsService: HyperToastsService
    ) { }

    ngOnInit() { }

    // removeThis() {
    //     this.confirmationService.confirm({
    //         message: 'Você tem certeza que deseja excluir este Cupom Smart? Essa ação NÃO poderá ser desfeita!',
    //         acceptLabel: 'EXCLUIR',
    //         rejectLabel: 'Cancelar',
    //         accept: () => {
    //             const objDelete = {
    //                 id: this.itemObject.id,
    //                 idSupplier: this.itemObject.idSupplier
    //             };
    //             this._sharedService.deleteGiftCard(objDelete).subscribe(
    //                 (response: any) => {
    //                     if (response.return) {
    //                         BroadcastEventService.event('onDeleteGiftCard').emit(true);
    //                         this._hyperToastsService.addToast('success', '', response.msg);
    //                     } else {
    //                         this._hyperToastsService.addToast('warning', '', response.msg);
    //                     }
    //                 },
    //                 err => { this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro ao listar as categorias'); }
    //             );
    //         }
    //     });
    // }

}
