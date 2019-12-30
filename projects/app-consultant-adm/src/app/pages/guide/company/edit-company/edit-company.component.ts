import { Component, OnInit, Input } from '@angular/core';
import { SharedService } from '../../../../services/shared.service';
import { HyperToastsService, BroadcastEventService } from 'lib-services';
import { Router } from '@angular/router';

@Component({
    selector: 'app-consultant-adm-edit-company',
    templateUrl: './edit-company.component.html',
    styleUrls: ['./edit-company.component.less']
})
export class EditCompanyComponent implements OnInit {

    public show = true;
    public companies = [];
    private idSupplier: any;

    constructor(
        private _sharedService: SharedService,
        private _hyperToastsService: HyperToastsService,
        private _router: Router
    ) { }

    ngOnInit() {
        this.getSupplierId();

        const obj = [
            { 'text': 'Dashboard', 'router': '/home' },
            { 'text': 'Meus ESTABELICIMENTOS', 'router': '' }
        ];

        BroadcastEventService.event('onBreadCrumb').emit(obj);

        BroadcastEventService.event('onDeleteCompany').subscribe(
            response => {
                if (response) {
                    this.getCompany();
                }
            }
        );
    }

    getSupplierId() {
        this._sharedService.getSupplier().subscribe(
            response => {
                if (response.return) {
                    this.idSupplier = response.data.id;
                    this.getCompany();
                }
            },
            err => { this._hyperToastsService.addToast('error', 'Erro', err); }

        );
    }

    getCompany(page = 1) {
        const filter = {
            page: page,
            size: 15,
            idSupplier: this.idSupplier
        };
        this._sharedService.getCompany().subscribe(
            res => {
                if (res.data != '') {
                    this.companies = [];
                    this.companies = this.companies.concat(res.data);
                    this._sharedService.saveProducts(this.companies);
                } else {
                    this.show = false;
                }
            }
        );
    }

    paginate(evt) {
        this.getCompany(evt.page + 1);
    }

}
