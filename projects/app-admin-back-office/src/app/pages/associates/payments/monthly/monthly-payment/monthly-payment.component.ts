// tslint:disable:no-unused-expression
import { Component, OnInit, ViewChild } from '@angular/core';
import { HyperToastsService } from 'lib-services';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from '@app-admin-back-office/services/shared.service';
import { SelectItem } from 'primeng/primeng';
import swal from 'sweetalert2';

@Component({
    selector: 'app-admin-back-office-monthly-payment',
    templateUrl: './monthly-payment.component.html',
    styleUrls: ['./monthly-payment.component.less']
})
export class MonthlyPaymentComponent implements OnInit {

    public associate: any;
    public optionsMethodPayment: SelectItem[] = [
        { label: 'Escolher Pagamento', value: null },
        { label: 'Cripto Moeda', value: 'crypto_coins' },
        { label: 'Transferência Bancaria', value: 'transfer_bank' },
        { label: 'Crédito da Plataforma', value: 'platform_credit' }
    ];
    public optionsYear: SelectItem[] = [
        { label: 'Ano', value: null },
        { label: new Date().getFullYear().toString(), value: new Date().getFullYear() },
        { label: (new Date().getFullYear() - 1).toString(), value: new Date().getFullYear() - 1 },

    ];
    public optionsMonth: SelectItem[] = [
        { label: 'Mês', value: null },
        { label: 'Janeiro', value: 0 },
        { label: 'Fevereiro', value: 1 },
        { label: 'Março', value: 2 },
        { label: 'Abril', value: 3 },
        { label: 'Maio', value: 4 },
        { label: 'Junho', value: 5 },
        { label: 'Julho', value: 6 },
        { label: 'Agosto', value: 7 },
        { label: 'Setembro', value: 8 },
        { label: 'Outubro', value: 9 },
        { label: 'Novembro', value: 10 },
        { label: 'Dezembro', value: 11 }
    ];
    public optionsMonthlyPlans: any[] = [{ label: 'Escolher Plano', value: null, monthly_value: 0 }];


    constructor(
        private _activatedRoute: ActivatedRoute,
        private _sharedService: SharedService,
        private _hyperToastsService: HyperToastsService,
        private _router: Router
    ) {
        this.setAssociates(this._activatedRoute.snapshot.params.username);
    }

    ngOnInit() { }

    setAssociates(username: string) {
        this._sharedService.getInfoMonthlyAssociate(username).subscribe(
            response => {
                if (response.return) {
                    this.associate = JSON.parse(response.data.reseller);
                    this.optionsMonthlyPlans.push(...JSON.parse(response.data.optionsMonthlyPlans));
                } else {
                    this._hyperToastsService.addToast('warn', 'Atenção', response.msg);
                }
            },
            err => {
                this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro inesperado. Atualize a página e tente novamente');
            }
        );
    }

    monthlyRequestSweet(idPlan: number, method: string, image: File, reason: string, year: number, month: number) {
        let flag = false;
        this._hyperToastsService.clear();
        if (!idPlan) {
            (flag = true) && this._hyperToastsService.addToast('warn', 'Atenção', 'Você precisa escolher um plano!');
        }
        if (!method) {
            (flag = true) && this._hyperToastsService.addToast('warn', 'Atenção', 'Você precisa escolher um método de pagamento!');
        }
        if (!image) {
            (flag = true) && this._hyperToastsService.addToast('warn', 'Atenção', 'Você precisa enviar uma imagem que comprova o pagamento do usuário!');
        }
        if (reason.length < 5) {
            (flag = true) && this._hyperToastsService.addToast('warn', 'Atenção', 'Precisar explicar o motivo desse pagamento!');
        }
        if (!(year && month !== null)) {
            (flag = true) && this._hyperToastsService.addToast('warn', 'Atenção', 'Precisar colocar o mês do pagamento!');
        }
        if (flag) {
            return;
        }
        const monthPayment = new Date(new Date().setFullYear(year, month, 1));
        swal({
            title: 'Solicitação de Pagamento?',
            text: 'Tem certeza que deseja pagar a mensalidade do associado ' + this.associate.name +
                '\ncom o valor de R$' + this.optionsMonthlyPlans.filter(x => x.value === idPlan)[0].monthly_value
                + '\npor meio de ' + this.optionsMethodPayment.filter(x => x.value === method)[0].label + ' ? ',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: 'green',
            cancelButtonColor: 'red',
        }).then((result) => {
            if (result.value) {
                this.uploadImage(idPlan, method, image, reason, monthPayment);
            }
        });
    }
    uploadImage(idPlan: number, method: string, image: File, reason: string, monthPayment: Date) {
        this._sharedService.postImageS3('admin', image).subscribe(
            response => {
                if (response.return) {
                    const url = response.data;
                    this.monthlyRequest(idPlan, method, url, reason, monthPayment);
                } else {
                    this._hyperToastsService.addToast('error', 'Error', 'Aconteceu um error ao tentar subir a image.');
                    console.warn(response);
                }
            },
            err => {
                this._hyperToastsService.addToast('error', 'Error', 'Aconteceu um error ao tentar subir a image.');
                console.error(err);
            }
        );
    }
    monthlyRequest(idPlan: number, method: string, url: any, reason: string, monthPayment: Date) {
        const data = { idReseller: this.associate.id, idPlan: idPlan, method: method, url: url, reason: reason, monthPayment: monthPayment.toJSON().split('T')[0] };
        this._sharedService.setMonthlyRequest(data).subscribe(
            response => {
                if (response.return) {
                    this._hyperToastsService.addToast('success', 'Sucesso', response.msg);
                } else {
                    this._hyperToastsService.addToast('warn', 'Atenção', response.msg);
                    console.warn(response);
                }
            },
            err => {
                this._hyperToastsService.addToast('Error', 'Error', err.msg);
                console.error(err);
            },
            () => {
                this._router.navigate(['/associates/payments/monthly']);
            }
        );
    }

}
