import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { SharedService } from '../../../services/shared.service';
import { HyperToastsService, BroadcastEventService } from 'lib-services';
import { EditProductComponent } from '../edit-product/edit-product.component';

@Component({
  selector: 'lib-components-thumbnail-product',
  templateUrl: './thumbnail-product.component.html',
  styleUrls: ['./thumbnail-product.component.less']
})
export class LibThumbnailProducctComponent implements OnInit {

  @Input() itemObject: any;

  public defaultImage: any;

  constructor(
    private _route: Router,
    private confirmationService: ConfirmationService,
    private _sharedService: SharedService,
    private _hyperToastsService: HyperToastsService,
    private _editComponent: EditProductComponent
  ) {
    this.defaultImage = '/global/img/image_default.png';
  }

  ngOnInit() {
  }
  editThis() {
    this._route.navigate(['/register-product/' + this.itemObject.id], { skipLocationChange: true });
  }
  duplicateThis() {
    this.confirmationService.confirm({
      message: 'O produto ' + this.itemObject.productForm.title + ' será duplicado e marcado como INATIVO, para ativar bastar editar e ativar o mesmo, deseja continuar?',
      acceptLabel: 'Duplicar',
      rejectLabel: 'Cancelar',
      key: 'duplicate',
      accept: () => {
        this.itemObject.id = '';
        this.itemObject.productForm.status = 'I';
        // this.itemObject.metaInfoForm.metainfo = this.itemObject.metaInfoForm.metainfo.split(',');
        this.itemObject.categoryForm.list_category = JSON.parse(this.itemObject.categoryForm.list_category);
        this.itemObject.categoryForm.list_category.forEach(element => {
          element.id = element.idCategory;
          delete element.idCategory;
        });
        this._sharedService.postProduct(this.itemObject).subscribe(
          response => {
            if (response.return) {
              this._hyperToastsService.addToast('success', '', response.msg);
              this._editComponent.getProduct();
            } else {
              this._hyperToastsService.addToast('warn', 'Atenção', response.msg);
            }
          },
          err => {
            this._hyperToastsService.addToast('error', '', err.msg);
          });
      }
    });
    // this._route.navigate(['/register-product/' + this.itemObject.id], { skipLocationChange: true });
  }

  removeThis() {
    this.confirmationService.confirm({
      message: 'Você tem certeza que deseja excluir o produto ' + this.itemObject.productForm.title + '? Essa ação NÃO podera ser desfeita!',
      acceptLabel: 'EXCLUIR',
      rejectLabel: 'Cancelar',
      key: 'delete',
      accept: () => {
        const objDelete = {
          id: this.itemObject.id,
          idSupplier: this.itemObject.idSupplier
        };
        this._sharedService.deleteProducts(objDelete).subscribe(
          response => {
            if (response.return) {
              BroadcastEventService.event('onDeleteProduct').emit(true);
              this._editComponent.getProduct();

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
