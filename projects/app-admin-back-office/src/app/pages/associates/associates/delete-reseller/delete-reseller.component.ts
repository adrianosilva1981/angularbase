import { HyperToastsService } from 'lib-services';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { SharedService } from '@app-admin-back-office/services/shared.service';
import swal from 'sweetalert2';

@Component({
    selector: 'app-admin-back-office-delete-reseller',
    templateUrl: './delete-reseller.component.html',
    styleUrls: ['./delete-reseller.component.less']
})
export class DeleteResellerComponent implements OnInit {
    public reseller: any;

    constructor(
        private _activatedRoute: ActivatedRoute,
        private _hyperToastsService: HyperToastsService,
        private _sharedService: SharedService,
        private _router: Router,
    ) {
        this.setReseller(this._activatedRoute.snapshot.params['id']);
    }

    ngOnInit() {
    }


    setReseller(id: number) {
        this._sharedService.getOneAssociate(id).subscribe(
            (response) => {
                if (response.return) {
                    this.reseller = response.data;
                    this.reseller.photo_profile = this.reseller.photo_profile ? this.reseller.photo_profile : 'https://office.youhub.com.br/assets/img/user-photo-default.png';
                    console.log(this.reseller);
                } else {
                    this._hyperToastsService.addToast('warn', 'Atenção', response.msg);
                }
            },
            (err) => {
                this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro inesperado. Atualize a página e tente novamente');
                this._router.navigate(['/']);
            }
        );
    }

    actionDelete() {
        swal({
            title: 'Excluir!',
            text: 'Deseja realmente excluir ' + this.reseller.name + '?',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Confirmar',
            cancelButtonText: 'Cancelar',
            input: 'text',
            inputValue: '',
            inputPlaceholder: 'Motivo',
            inputValidator: (value: string) => {
                return (value.length < 255 ? !value : true) && 'É necessário inserir um motivo!';
            },
        }).then(
            (result) => {
                if (!result.dismiss) {
                    const data = {
                        id: this.reseller.id,
                        reason: result.value
                    };
                    this._sharedService.deleteReseller(data).subscribe(
                        response => {
                            if (response.return) {
                                this._hyperToastsService.addToast('success', 'Sucesso!', response.msg);
                                this._router.navigate(['associates/associate-edit']);
                            } else {
                                this._hyperToastsService.addToast('warn', 'Error!', response.msg);
                                console.log(response);
                            }
                        },
                        err => {
                            this._hyperToastsService.addToast('error', 'Error!', 'Aconteceu algum error, entre em contato com o Suporte!');
                            console.error(err);
                        }
                    );
                }
            },
            err => {
                throw new Error('Method not implemented.');
            });
    }

}
