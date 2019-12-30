import { Component, OnInit } from '@angular/core';
import { SharedService } from '@app-consultant-adm/services/shared.service';
import { HyperToastsService } from 'lib-services';
import { Router } from '@angular/router';

@Component({
    selector: 'app-consultant-adm-extract',
    templateUrl: './extract.component.html',
    styleUrls: ['./extract.component.less']
})
export class ExtractComponent implements OnInit {
    public show = false;

    public objExtract: any = [];
    public obj: any = [];
    public resume = {
        PP: 0,
        PC: 0,
        PE: 0,
        PD: 0//payday
    };
    public filter = {
        selectedType: '',
        dateStart: null,
        dateFinish: null,
        status: '',
        detailStatus: '',
        order: ''
    };

    public cols = [
        { field: 'date', header: 'Data' },
        { field: 'order', header: 'Pedido' },
        { field: 'statusText', header: 'Status' },
        { field: 'payment_method', header: 'Método de pagamento' },
        { field: 'amountHtml', header: 'Valor' },
        { field: 'action', header: 'Ações' },

    ];

    public types = [
        { label: 'Hoje', value: 'hoje' },
        { label: 'Mês atual', value: 'mes atual' },
        { label: 'Mês anterior', value: 'mes anterior' }
    ];

    public en = {
        firstDayOfWeek: 0,
        dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
        dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
        dayNamesMin: ['Do', 'Se', 'Te', 'Qu', 'Qu', 'Se', 'Sa'],
        monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
        monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
        today: 'Hoje',
        clear: 'Clear'
    };

    public statusPayment = {
        'Recebido': 'Recebido',
        'A receber': 'A receber',
        'Estornado': 'Estornado'
    };

    public statusDetail = {
        'Cartão de crédito': 'Cartão de crédito',
        'Boleto': 'Boleto',
        'Crédito da plataforma': 'Crédito da plataforma'
    };

    public status = [];
    public detail_status = [];

    constructor(
        private _sharedService: SharedService,
        private _hyperToastsService: HyperToastsService,
        private _router: Router
    ) {
        this._sharedService.getSupplierExtract().subscribe(
            (response: any) => {
                if (response.return) {
                    this.objExtract = response.data;
                    this.obj = response.data;
                    this.objExtract.forEach(element => {
                        switch (element['payment_method']) {
                            case 'credit_card':
                                element['payment_method'] = 'Cartão de crédito';
                                break;
                            case 'billet':
                                element['payment_method'] = 'Boleto';
                                break;
                            case 'hjpay':
                                element['payment_method'] = 'Crédito da plataforma';
                                break;

                            default:
                                element['payment_method'] = '***************';
                                break;
                        }
                        element['statusText'] = element['statusText'] == undefined ? 'A receber' : element['statusText'];
                        element['amountHtml'] = Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(element['value']);
                    });
                    this.calcExtract();

                } else {
                    this._hyperToastsService.addToast('warn', 'Atenção', response.msg);
                }
            },
            err => { this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro inesperado. Atualize a página e tente novamente'); }
        );
    }


    ngOnInit() {
        this._sharedService.addBreadCrumb(
            [
                { 'text': 'Dashboard', 'router': '/home' },
                { 'text': 'Extrato', 'router': '' }
            ]
        );

        let statusArray = Object.entries(this.statusPayment);
        this.status.push({ label: 'Todos', value: '' });
        statusArray.forEach(element => {
            this.status.push({ label: element[1], value: element[1] });
        });

        statusArray = Object.entries(this.statusDetail);
        this.detail_status.push({ label: 'Todos', value: '' });
        statusArray.forEach(element => {
            this.detail_status.push({ label: element[1], value: element[1] });
        });

    }

    calcExtract() {
        //Total a Receber
        this.resume.PP = 0;
        //Total a Receber Hoje
        this.resume.PD = 0;
        //Total Recebid
        this.resume.PC = 0;
        //Total Estornado
        this.resume.PE = 0;



        this.objExtract.forEach(element => {

            switch (element.statusText) {
                case 'A receber':
                    if (this.payday(element)) {
                        this.resume.PD += Number(element.value);
                    }
                    this.resume.PP += Number(element.value);
                    break;

                case 'Recebido':
                    this.resume.PC += Number(element.value);
                    break;

                case 'Estornado':
                    this.resume.PE += Number(element.value);

                    break;

                default:
                    break;
            }
        });

    }

    payday(extract: any): boolean {
        const today = new Date(new Date().setHours(23, 59, 59, 999));
        let payment: Date = new Date(new Date().setHours(23, 59, 59, 999));

        switch (extract.payment_method) {
            case 'Cartão de crédito':
                payment = new Date(extract.dateRaw);
                payment = new Date(payment.getTime() + (30 * 24 * 60 * 60 * 1000));
                break;
            case 'Crédito da plataforma':
                payment = new Date(extract.dateRaw);
                payment = new Date(payment.getTime() + (7 * 24 * 60 * 60 * 1000));
                break;
            case 'Boleto':
                payment = new Date(extract.dateRaw);
                payment = new Date(payment.getTime() + (30 * 24 * 60 * 60 * 1000));
                break;
            default:
                return false;
        }
        return payment.getTime() < today.getTime();
    }

    fc_filter() {

        this.objExtract = this.obj.filter(x => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            let date = x.date.split('/');
            date = new Date(date[2], date[1] - 1, date[0]);

            let vDate = false;

            // condições para filtro por data, se tiver data escrita, é desconsiderado os botoes 'hoje', 'mes atual', 'mes anterior'
            if (this.filter.dateStart != null || this.filter.dateFinish != null) {
                if (this.filter.dateStart != null) {
                    vDate = this.filter.dateStart <= date;
                }
                if (this.filter.dateFinish != null) {
                    vDate = this.filter.dateFinish >= date;
                }
                if (this.filter.dateStart != null && this.filter.dateFinish != null) {
                    vDate = this.filter.dateStart <= date && this.filter.dateFinish >= date;
                }
            } else {
                switch (this.filter.selectedType) {
                    case 'hoje':
                        const timeDiff = Math.abs(date.getTime() - today.getTime());
                        const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
                        vDate = diffDays == 0;
                        break;
                    case 'mes atual':
                        const month = new Date().getMonth();
                        vDate = month == date.getMonth();
                        break;
                    case 'mes anterior':
                        const lastMonth = new Date().getMonth() - 1;
                        vDate = lastMonth == date.getMonth();
                        break;
                    default:
                        vDate = true;
                        break;
                }
            }

            // Teste se tem filtro em Detail
            const vDetailStatus = this.filter.detailStatus == '' || this.filter.detailStatus == x.payment_method ? true : false;
            // Teste se tem filtro em Order
            const vOrder = this.filter.order == '' || this.filter.order == x.order ? true : false;
            // Teste se tem filtro em Status
            const vStatus = this.filter.status == '' || this.filter.status == x.statusText ? true : false;

            if (vDate && vDetailStatus && vOrder && vStatus) {
                return x;
            } else {
                return false;
            }
        });
        this.calcExtract();
    }

    resetFilter() {
        this.filter = {
            selectedType: '',
            dateStart: null,
            dateFinish: null,
            status: '',
            detailStatus: '',
            order: ''
        };
        this.fc_filter();
    }

    selectProduct(selected) {
        this._sharedService.getProductSupplier().subscribe(
            response => {
                if (response.return && response.data != '') {

                    const item = response.data.filter((product) => {
                        if (product[0].id_buyShoppingOrder === selected.order) {
                            return product[0];
                        }
                    });
                    this._sharedService.setOneProductSupplier(item[0]);
                    this._router.navigate(['supplier-sales-info']);
                }
            }
        );
    }

}
