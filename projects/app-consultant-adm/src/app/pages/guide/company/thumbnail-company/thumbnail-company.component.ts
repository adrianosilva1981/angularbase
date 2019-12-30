import { Component, OnInit, Input } from '@angular/core';
import { HyperToastsService, BroadcastEventService } from 'lib-services';
import { SharedService } from '../../../../services/shared.service';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';

@Component({
    selector: 'app-consultant-adm-thumbnail-company',
    templateUrl: './thumbnail-company.component.html',
    styleUrls: ['./thumbnail-company.component.less']
})
export class ThumbnailCompanyComponent implements OnInit {

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
        this._route.navigate(['/guide/register-company/' + this.itemObject.id], { skipLocationChange: true });
    }

    removeThis() {
        this.confirmationService.confirm({
            message: 'Você tem certeza que deseja excluir este estabelicimento ' + this.itemObject.companyForm.name + '? Essa ação NÃO podera ser desfeita!',
            acceptLabel: 'EXCLUIR',
            rejectLabel: 'Cancelar',
            accept: () => {
                const objDelete = {
                    id: this.itemObject.id,
                    idSupplier: this.itemObject.idSupplier
                };
                this._sharedService.deleteCompany(objDelete).subscribe(
                    (response: any) => {
                        if (response.return) {
                            BroadcastEventService.event('onDeleteCompany').emit(true);

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
