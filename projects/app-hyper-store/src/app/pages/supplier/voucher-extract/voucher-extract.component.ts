import { Component, OnInit } from '@angular/core';
import { SharedService } from '@app-hyper-store/services/shared.service';
import { HyperToastsService } from 'lib-services';

@Component({
    selector: 'app-hyper-store-voucher-extract',
    templateUrl: './voucher-extract.component.html',
    styleUrls: ['./voucher-extract.component.less']
})
export class VoucherExtractComponent implements OnInit {

    public extract: any[] = [];
    public cols: { header: String, field: String }[] = [
        { header: 'Data', field: 'date' },
        { header: 'Pedido', field: 'id_buyShoppingOrder' },
        { header: 'Cupom Smart', field: 'reference_name' },
        { header: 'Status', field: 'status' },
        { header: 'Metodo de Pagamento', field: 'method' },
        { header: 'Total', field: 'value' }
    ];
    public resume: { PP: Number, PE: Number, PC: Number, PD: Number } = {
        PP: 0,
        PE: 0,
        PC: 0,
        PD: 0
    };

    constructor(
        private _sharedService: SharedService,
        private _hyperToastsService: HyperToastsService
    ) {
        this.getExtractGiftCards();
    }

    ngOnInit() {
        this.addBreadCrumb();
    }

    addBreadCrumb() {
        this._sharedService.addBreadCrumb(
            [
                { 'text': 'Dashboard', 'router': '/supplier/dash' },
                { 'text': 'Extrato Cupons Smart', 'router': '' }
            ]
        );
    }

    getExtractGiftCards() {
        this._sharedService.getExtractGiftCards().subscribe(
            response => {
                if (response.return) {
                    (this.extract = response.data).forEach((item) => { this.setInf(item); item.buyer = JSON.parse(item.buyer); });
                    // this.extract.sort(function (a: any, b: any) { return (a.date.getTime() - b.date.getTime()); });
                } else {
                    this._hyperToastsService.addToast('warn', 'Error', response.msg);
                    console.warn(response);
                }
            },
            err => {
                this._hyperToastsService.addToast('error', 'Error', err.msg);
                console.error(err);
            }
        );
    }

    setInf(item: any) {
        item.value = parseFloat(item.supply_value) * parseFloat(item.quantity);
        switch (parseInt(item.paid, 10)) {
            case 0: //não pago
                item.status = item.status === 'reversed' ? 'Estornado' : 'A receber';
                break;
            case 1: //pago
                item.status = parseInt(item.reversal, 10) ? 'Estornado' : item.status === 'reversed' ? 'Estornado' : 'Recebido';
                break;
        }
        switch (item.payment_method) {
            case 'hjpay':
                item.date = new Date(new Date(item.date_payment_by_buyer + ' 12:00:00').getTime() + (7 * 24 * 60 * 60 * 1000));
                item.method = 'Crédito Plataforma';
                break;
            case 'billet':
                item.date = new Date(new Date(item.date_payment_by_buyer + ' 12:00:00').getTime() + (30 * 24 * 60 * 60 * 1000));
                item.method = 'Boleto';
                break;
            case 'credit_card':
                item.date = new Date(new Date(item.date_payment_by_buyer + ' 12:00:00').getTime() + (30 * 24 * 60 * 60 * 1000));
                item.method = 'Cartão de Crédito';
                break;
        }
        const today = new Date(new Date().setHours(23, 59, 59, 0));
        switch (item.status) {
            case 'Estornado': this.resume.PE += item.value; break;
            case 'Recebido': this.resume.PC += item.value; break;
            default:
                if (today > item.date) {
                    this.resume.PD += item.value;
                } else {
                    this.resume.PP += item.value;
                }
        }
    }

}
