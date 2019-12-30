import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import swal from 'sweetalert2';


import { HyperToastsService } from 'lib-services';

import { SharedService } from '@app-admin-back-office/services/shared.service';

@Component({
    selector: 'app-admin-back-office-request-associate',
    templateUrl: './request-associate.component.html',
    styleUrls: ['./request-associate.component.less']
})
export class RequestAssociateComponent implements OnInit {

    associate: any;
    debitValue: any;
    optionsPack = [
        {
            label: '',
            value: '',
        },
        {
            label: '1 pacote no valor de R$1.297,00',
            value: 2,
        },
        {
            label: '10 pacotes no valor de R$12.970,00',
            value: 1,
        },
    ];
    optionsMethod = [
        {
            label: '',
            value: '',
        },
        {
            label: 'Transferência de Banco',
            value: 'transfer_bank',
        },
        {
            label: 'Crypto Moedas',
            value: 'crypto_coins',
        },
        {
            label: 'Crédito da Plataforma',
            value: 'platform_credit',
        },
    ];

    constructor(
        private _sharedService: SharedService,
        private _activatedRoute: ActivatedRoute,
        private _hyperToastsService: HyperToastsService,
        private _router: Router,
    ) {
        this.getAssociate(Number.parseInt(this._activatedRoute.snapshot.paramMap.get('associate').toString()));
    }

    ngOnInit() {
    }

    getAssociate(id: number) {
        this._sharedService.getOneAssociate(id).subscribe(
            response => {
                this.associate = response.data;
            },
            err => {
                this._hyperToastsService.addToast('error', 'Error', err.msg);
            });
    }

    buyAction(extract: string, description: string, pack: any, method: any) {
        if (pack.value === '' || extract === '' || description === '' || method.value === '') {
            this._hyperToastsService.addToast('warn', 'Atenção!', 'Precisa de valor, extrato e descrição!');
            return;
        }
        swal({
            title: 'Atenção!',
            text: 'Deseja realmente comprar ' + pack.label + ' para ' + this.associate.name + '?',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Confirmar',
            cancelButtonText: 'Cancelar'
        }).then(
            (result) => {
                if (!result.dismiss) {
                    const data = {
                        id_reseller: this.associate.id,
                        pack: pack.value,
                        method: method.value,
                        msg: extract,
                        full_msg: description,
                    };
                    this._sharedService.buyPack(data).subscribe(
                        response => {
                            if (response.return) {
                                this._hyperToastsService.addToast('success', 'Sucesso', response.msg);
                            } else {
                                this._hyperToastsService.addToast('error', 'Error', response.msg);
                            }
                            this._router.navigate(['/associates/pack/request']);
                        },
                        err => {
                            this._hyperToastsService.addToast('error', 'Error', err.msg);
                            this._router.navigate(['/associates/pack/request']);
                        });
                }
            },
            err => {
                this._hyperToastsService.addToast('error', 'Error', err.msg);
                this._router.navigate(['/associates/pack/request']);
            }
        );
    }

    onChange(lb: HTMLElement, pdd) {
        if (pdd.value === '') {
            lb.setAttribute('style', 'top:.75em');
        } else {
            lb.setAttribute('style', 'top:-.75em');
        }
    }

}
