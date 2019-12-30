import { Component, OnInit } from '@angular/core';
import { BroadcastEventService, HyperToastsService } from 'lib-services';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from '@app-consultant-adm/services/shared.service';
import { Calendar } from 'primeng/primeng';

@Component({
    selector: 'app-consultant-adm-sales',
    templateUrl: './sales.component.html',
    styleUrls: ['./sales.component.less']
})
export class SalesComponent implements OnInit {

    public giftCards: any[] = [];
    public company: any;
    public idCompany = this._activatedRoute.snapshot.params.id;


    constructor(
        private _activatedRoute: ActivatedRoute,
        private _sharedService: SharedService,
        private _hyperToastsService: HyperToastsService
    ) {
        this.getInfo(this.idCompany);
    }

    ngOnInit() { }

    getBreadCrumb() {
        const obj = [
            { 'text': 'Dashboard', 'router': '/home' },
            { 'text': 'Meus ESTABELICIMENTOS', 'router': '/guide/edit-company' },
            { 'text': null || this.company.name, 'router': '' }
        ];
        BroadcastEventService.event('onBreadCrumb').emit(obj);
    }

    getInfo(_idCompany: Number, data = null) {
        this._sharedService.getGiftCardCompany(_idCompany, data).subscribe(
            response => {
                if (response.return) {
                    this.giftCards = response.data.gift_cards;
                    this.company = response.data.company;
                    this.getBreadCrumb();
                } else {
                    this._hyperToastsService.addToast('warn', 'Atenção', 'Nem um gift card encontrado!');
                    console.warn(response);
                }
            },
            err => {
                this._hyperToastsService.addToast('error', 'Erro', 'Aconteceu algum erro');
                console.error(err);
            }
        );
    }
    getInfoSales(interval: Date[]) {
        if (!interval[1]) { return; }
        const data = {
            startDate: interval[0].toJSON().split('T')[0],
            endDate: interval[1].toJSON().split('T')[0]
        };
        this.getInfo(this.idCompany, data);
    }

}
