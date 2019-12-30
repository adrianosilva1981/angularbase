import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { HyperToastsService } from 'projects/lib-services/src/lib/services/hyper-toasts.service';
import { SharedService } from '@app-admin-youhubshop/services/shared.service';
import * as _ from 'lodash';
import { DataTable } from 'primeng/primeng';
import { ExcelService } from 'lib-services';


@Component({
    selector: 'app-admin-youhubshop-pack-sold',
    templateUrl: './pack-sold.component.html',
    styleUrls: ['./pack-sold.component.less']
})
export class PackSoldComponent implements OnInit {
    public orders: any[] = [];
    public cols: any[] = [
        { field: 'date_creation', header: 'Data' },
        { field: 'bso_id', header: 'Código' },
        { field: 'name', header: 'Nome' },
        { field: 'supplier_value', header: 'Repasse Fornecedor(es)' },
        { field: 'main_value', header: 'Pago' },
        { field: 'freight_value', header: 'Frete' },
        { field: 'profit_value', header: 'Margem' },
        { field: 'points_value', header: 'Pontos' },
        { field: 'total_value', header: 'Total' },
        { field: 'status', header: 'Situação' },
        { field: 'payment_method', header: 'Forma pgmt' }
    ];
    public dates = [new Date(Date.now() - (30 * 24 * 60 * 60 * 1000)), new Date()];
    public total_points_orders: number;
    public total_value_orders: number;
    public qtd_orders: number;
    public status_order_label: any[] = [
        { value: 'PC', label: 'Pagamento Confirmado' },
        { value: 'AP', label: 'Aguardando Pagamento' },
        { value: 'PR', label: 'Pagamento Recusado' },
        { value: 'FN', label: 'Finalizado' },
        { value: 'G', label: 'Gerado' },
        { value: 'ES', label: 'Estornado' },
        { value: 'C', label: 'Cancelado' }
    ];
    @ViewChild('dt') public dt: DataTable;

    constructor(
        private _sharedService: SharedService,
        private _hyperToastsService: HyperToastsService,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _excelService: ExcelService,
    ) {
        this.setOrders();
    }

    ngOnInit() { }

    setOrders() {
        if (!this.dates[1]) {
            return;
        }
        const data = {
            startDate: this.dates[0].toJSON().split('T')[0],
            endDate: this.dates[1].toJSON().split('T')[0]
        };
        this._sharedService.getOrdersSold(data).subscribe(
            response => {
                if (response.return) {
                    (this.orders = response.data).forEach(
                        (order) => {
                            order.supplier_value = parseFloat(order.supplier_value);
                            order.freight_value = parseFloat(order.freight_value);
                            order.main_value = parseFloat(order.main_value);
                            order.points_value = parseInt(order.points_value, 10);
                            order.total_value = order.freight_value + order.main_value;
                            order.profit_value = order.main_value - order.supplier_value;
                        }
                    );
                } else {
                    this._hyperToastsService.addToast('warn', 'Warning', 'Não foi encontrado nem uma venda nesse período.');
                    console.warn(response);
                }
            },
            err => {
                this._hyperToastsService.addToast('error', 'Error', 'Aconteceu algum erro, por favor entre em contato com o Suporte.');
                console.error(err);
            },
            () => {
                this.orders.sort((a, b) => b.bso_id - a.bso_id);
                this.sumTotal();
            }
        );

    }

    sumTotal() {
        setTimeout(() => {
            this.total_value_orders = (this.dt.filteredValue || this.dt.value).map(x => x.total_value).reduceRight((value, sum) => value + sum);
            this.total_points_orders = (this.dt.filteredValue || this.dt.value).map(x => x.points_value).reduceRight((value, sum) => value + sum);
            this.qtd_orders = (this.dt.filteredValue || this.dt.value).length;
        }, this.dt.filterDelay);
    }

    getOrderDetails(order) {
        if (order.orderItems) {
            return;
        }
        const data = { bso_id: order.bso_id, buyer_id: order.buyer_id };
        this._sharedService.getOrdersSoldDetails(data).subscribe(
            response => {
                if (response.data) {
                    (order.orderItems = JSON.parse(response.data.orderItems))
                        .forEach(
                            (supplier) => {
                                (supplier.items = JSON.parse(supplier.items))
                                    .forEach(
                                        (item) => {
                                            item.status = this.returnLabelStatusItem(item.status);
                                        }
                                    );
                                supplier.supplier_value = parseFloat(supplier.supplier_value);
                                supplier.status = this.returnLabelStatusFreight(supplier.status);
                            }
                        );
                } else {
                    this._hyperToastsService.addToast('warn', 'Warning', 'Não foi encontrado nem uma venda nesse período.');
                    console.warn(response);
                }
            },
            err => {
                this._hyperToastsService.addToast('error', 'Error', 'Aconteceu algum erro, por favor entre em contato com o Suporte.');
                console.error(err);
            }
        );
    }

    returnLabelStatus(status) {
        for (let index = 0; index < this.status_order_label.length; index++) {
            if (this.status_order_label[index].value === status) {
                return this.status_order_label[index].label;
            }
        }
        return status;
    }

    returnLabelStatusFreight(statusFreight) {
        switch (statusFreight) {
            case 'C': return 'Cancelado';
            case 'ET': return 'Em Transito';
            case 'ES': return 'Estornado';
            case 'FN': return 'Entregue';
            case 'NF': return 'Nota Fiscal Emitida';
            case 'PA': return 'Pedido Autorizado';
            case 'PE': return 'Pedido Entregue';
            case 'RT': return 'Retornado';
            default: return statusFreight;
        }
    }

    returnLabelStatusItem(statusItem) {
        switch (statusItem) {
            case 'unprocessed': return 'Não processado';
            case 'processed': return 'Processado';
            case 'reversed': return 'Estornado';
            default: return statusItem;
        }
    }

    export(dt: DataTable) {
        this._excelService.exportAsExcelFile((dt.filteredValue || dt.value), null, 'Vendas');
    }
}

