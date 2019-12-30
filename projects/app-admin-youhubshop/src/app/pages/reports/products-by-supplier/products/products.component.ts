import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HyperToastsService } from 'lib-services';
import { SharedService } from '@app-admin-youhubshop/services/shared.service';
import swal from 'sweetalert2';
import * as _ from 'lodash';
import { switchAll } from 'rxjs/operators';

@Component({
    selector: 'app-admin-youhubshop-products',
    templateUrl: './products.component.html',
    styleUrls: ['./products.component.less']
})
export class ProductsComponent implements OnInit {

    public products: any[] = [];
    public selectedProducts: any[] = [];
    public colsProducts: { header: string; field: string }[] = [
        { header: 'Produto', field: 'id' },
        { header: 'Título', field: 'title' },
        { header: 'Hyper Produto', field: 'hyper' },
        { header: 'Nacional', field: 'spotlight' },
        { header: 'Status', field: 'status' },
        { header: 'Valor', field: 'value' },
        { header: 'Valor Prime', field: 'value_prime' },
        { header: 'Valor Associado', field: 'value_associate' }
    ];
    public services: any[] = [];
    public selectedServices: any[] = [];
    public colsServices: { header: string; field: string }[] = [
        { header: 'Serviço', field: 'id' },
        { header: 'Título', field: 'title' },
        { header: 'Hyper Serviço', field: 'hyper' },
        { header: 'Nacional', field: 'spotlight' },
        { header: 'Status', field: 'status' },
        { header: 'Valor', field: 'value' },
        { header: 'Valor Prime', field: 'value_prime' },
        { header: 'Valor Associado', field: 'value_associate' }
    ];
    public giftCards: any[] = [];
    public selectedGiftCards: any[] = [];
    public colsGiftCards: { header: string; field: string }[] = [
        { header: 'Guia Smart', field: 'id' },
        { header: 'Título', field: 'title' },
        { header: 'Hyper Guia Smart', field: 'hyper' },
        { header: 'Nacional', field: 'spotlight' },
        { header: 'Status', field: 'status' },
        { header: 'Valor', field: 'value' },
        { header: 'Valor Prime', field: 'value_prime' },
        { header: 'Valor Associado', field: 'value_associate' }
    ];
    public id_user: number = this._activatedRoute.snapshot.params['id_supplier'];

    constructor(private _shareService: SharedService,
        private _hyperToastsService: HyperToastsService,
        private _router: Router,
        private _activatedRoute: ActivatedRoute
    ) {
        this.setItems();
    }

    ngOnInit() {
    }

    setItems() {
        this.products = [];
        this.selectedProducts = [];
        this.services = [];
        this.selectedServices = [];
        this.giftCards = [];
        this.selectedGiftCards = [];
        this._shareService.getReportProducts(this.id_user).subscribe(
            response => {
                if (response.return) {
                    (this.products = response.data.filter(x => x.type === 'product')).forEach(y => { y.status = y.status === 'A' ? 'Ativo' : 'Inativo'; });
                    (this.services = response.data.filter(x => x.type === 'service')).forEach(y => { y.status = y.status === 'P' ? 'Ativo' : 'Inativo'; });
                    (this.giftCards = response.data.filter(x => x.type === 'gift_card')).forEach(y => { y.status = y.status === 'A' ? 'Ativo' : 'Inativo'; });
                } else {
                    this._hyperToastsService.addToast('warn', 'Atenção', response.msg);
                }
            }, err => {
                this._hyperToastsService.addToast('error', 'Error', err.msg);
            }
        );
    }

    // editar para ativar varios produtos
    actionItems(type: string, op: number) {
        let items;
        let text;
        switch (type) {
            case 'products': items = this.selectedProducts.map(product => product.id); break;
            case 'services': items = this.selectedServices.map(product => product.id); break;
            case 'gift_cards': items = this.selectedGiftCards.map(product => product.id); break;
            default: this._hyperToastsService.addToast('warn', 'Atenção', 'Não foi possível selecionar o método.Tente novamente!'); return;
        }
        if (!items.length) {
            this._hyperToastsService.addToast('warn', 'Atenção', 'Por favor selecione pelo menos um item!');
            return;
        }
        switch (op) {
            case 0: text = 'Deseja realmente ativar ' + items.length + ' item(ns) para nacional(is)?'; break;
            case 1: text = 'Deseja realmente desativar ' + items.length + ' item(ns) em nacional(is)?'; break;
            case 2: text = 'Deseja realmente ativar ' + items.length + ' item(ns) para destaque?'; break;
            case 3: text = 'Deseja realmente destivar ' + items.length + ' item(ns) em destaque?'; break;
            case 4: text = 'Deseja realmente ativar ' + items.length + ' item(ns)?'; break;
            case 5: text = 'Deseja realmente destivar ' + items.length + ' item(ns)?'; break;
            default: this._hyperToastsService.addToast('warn', 'Atenção', 'Não foi possível selecionar o método.Tente novamente!'); return;
        }
        swal({
            title: 'Atenção!',
            text: text,
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Confirmar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (!result.dismiss) {
                const data = {
                    op: op,
                    type: type,
                    items: items,
                    // id_user: this.id_user
                };
                this._shareService.setProductNacionalOrSpotlight(data).subscribe(
                    response => {
                        if (response.return) {
                            this._hyperToastsService.addToast('success', 'Sucesso', response.msg);
                            this.setItems();
                        } else {
                            this._hyperToastsService.addToast('error', 'Error', response.msg);
                            console.log(response);
                        }
                    }, err => {
                        this._hyperToastsService.addToast('error', 'Error', err.msg);
                        console.error(err);
                    }
                );
            }
        },
            err => {
                console.error(err);
            }
        );
    }

    back() {
        this._router.navigate(['/reports/productsBySupplier/']);
    }

}
