import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from '@app-admin-back-office/services/shared.service';
import { HyperToastsService } from 'lib-services';
import * as _ from 'lodash';

@Component({
    selector: 'app-admin-back-office-payment-financing-plot',
    templateUrl: './payment-financing-plot.component.html',
    styleUrls: ['./payment-financing-plot.component.less']
})
export class PaymentFinancingPlotComponent implements OnInit {

    public associate: any;
    public plots: any[] = [];
    public cols: any[] = [];
    public flagPlots = false;
    public optionMethod = [
        { label: 'Escolher', value: null },
        // { label: 'Crédito', value: 'credit' },
        // { label: 'Parcial', value: 'partial' },
        { label: 'Externo', value: 'external' },
    ];
    public optionGateway = [
        { label: 'Escolher', value: null },
        { label: 'Vindi', value: 'adm_vindi' },
        { label: 'Plataforma', value: 'adm_platform' },
        { label: 'Exten', value: 'adm_exten' },
        { label: 'Cripto Moeda', value: 'adm_crypto_coins' },
        { label: 'Transferência', value: 'adm_transfer' },
    ];
    public currencyMask = { prefix: 'R$ ', thousands: '.', decimal: ',', align: 'center' };
    public method: string = null;
    public credit: number;
    public paid_out: number;
    public gateway: string = null;


    constructor(
        private _activatedRoute: ActivatedRoute,
        private _sharedService: SharedService,
        private _hyperToastsService: HyperToastsService,
        private _routerLink: Router
    ) {
        this.setInfo(this._activatedRoute.snapshot.params.username);
    }

    ngOnInit() { }

    setInfo(username: string) {
        this._sharedService.getInfoFinancingPlots(username).subscribe(
            response => {
                if (response.return) {
                    this.associate = JSON.parse(response.data.reseller);
                    this.associate.points_release = parseInt(response.data.points_release, 10);
                    this.plots = JSON.parse(response.data.plots).sort((a: any, b: any) => (a.parcel - b.parcel));
                    Object.keys(this.plots[0]).forEach((col: string) => this.setCols(col));
                } else {
                    this._hyperToastsService.addToast('warn', 'Atenção', response.msg);
                    this._routerLink.navigate(['/associates/payments/financing/plots']);
                }
            },
            err => {
                this._hyperToastsService.addToast('error', 'Error', err.msg);
                console.error(err);
            }
        );
    }
    setCols(col: string) {
        switch (col) {
            case 'id': this.cols.push({ field: col, header: 'Código' }); break;
            case 'parcel': this.cols.push({ field: col, header: 'Parcela' }); break;
            case 'value': this.cols.push({ field: col, header: 'Valor' }); break;
            case 'date_attempt': this.cols.push({ field: col, header: 'Data de Pagamento' }); break;
            case 'url_document': this.cols.push({ field: col, header: 'Boleto' }); break;
        }
    }

    getPlotsLate() {
        // .sort é por causa que não tem como eu garantir que plots.filter retorne ordenado (?)
        return this.plots.filter(parcel => parcel.stage !== 'processed').sort((a: any, b: any) => (a.parcel - b.parcel))[0] || null;
    }

    paymentParcelFinancing(method: string = null, credit: number = 0, paid_out: number = 0, gateway: string = null) {
        // credit deve ser 0 conferir no backend para consiste de pagar apenas por meio externo
        const parcel = this.getPlotsLate();
        if (!(method && gateway)) {
            this._hyperToastsService.addToast('warn', 'Atenção', 'Você precisa escolher Meio de Pagamento e Plataforma Externa!');
            return;
        } else if (parcel.value > credit + paid_out) {
            this._hyperToastsService.addToast('warn', 'Atenção', 'Valor da parcela não confere com os valor recebido!');
            return;
        }
        const data = { parcel_id: parcel.id, method: method, credit: credit, parcel_value: parcel.value, gateway_paid_out: paid_out, gateway: gateway };
        this._sharedService.setPaymentFinancingPlots(data).subscribe(
            response => {
                this._hyperToastsService.clear();
                if (response.return) {
                    this._hyperToastsService.addToast('success', 'Sucesso', response.msg);
                } else {
                    this._hyperToastsService.addToast('warn', 'Atenção', response.msg);
                }
                this._routerLink.navigate(['/associates/payments/financing/plots']);
            },
            err => {
                console.error(err);
                this._hyperToastsService.clear();
                this._hyperToastsService.addToast('error', 'Error', err.msg);
                this._routerLink.navigate(['/associates/payments/financing/plots']);
            }
        );
    }

    ticketPage(url: string) {
        // tslint:disable-next-line:no-unused-expression
        url || this._hyperToastsService.addToast('warn', 'Atenção', 'Url do documento não existe!');
        // tslint:disable-next-line:no-unused-expression
        url && window.open(url, '_blank');
    }

}
