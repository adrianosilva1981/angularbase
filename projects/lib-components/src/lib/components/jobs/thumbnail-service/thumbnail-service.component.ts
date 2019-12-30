import { Component, OnInit, Input } from '@angular/core';
import { HyperToastsService, BroadcastEventService } from 'lib-services';
import { SharedService } from '../../../services/shared.service';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'lib-components-thumbnail-service',
  templateUrl: './thumbnail-service.component.html',
  styleUrls: ['./thumbnail-service.component.less']
})
export class ThumbnailServiceComponent implements OnInit {

  @Input() itemObject: any;

  public defaultImage: any;

  constructor(
    private _route: Router,
    private confirmationService: ConfirmationService,
    private _sharedService: SharedService,
    private _hyperToastsService: HyperToastsService
  ) {
    this.defaultImage = '/global/img/image_default.png';
  }

  ngOnInit() {
  }
  editThis() {
    this._route.navigate(['/register-service/' + this.itemObject.id], { skipLocationChange: true });
  }
  removeThis() {
    this.confirmationService.confirm({
      message: 'Você tem certeza que deseja excluir o serviço ' + this.itemObject.serviceForm.name + '? Essa ação NÃO podera ser desfeita!',
      acceptLabel: 'EXCLUIR',
      rejectLabel: 'Cancelar',
      accept: () => {
        const objDelete = {
          id: this.itemObject.id,
          idSupplier: this.itemObject.idSupplier
        };
        this._sharedService.deleteService(objDelete).subscribe(
          response => {
            if (response.return) {
              BroadcastEventService.event('onDeleteProduct').emit(true);

              this._hyperToastsService.addToast('success', '', response.msg);
            } else {
              this._hyperToastsService.addToast('warning', '', response.msg);
            }
          },
          err => { this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro ao listar as categorias'); }
        );

      }
    });
    // this._route.navigate(['/register-product/' + this.itemObject.id], { skipLocationChange: true });
  }
}
