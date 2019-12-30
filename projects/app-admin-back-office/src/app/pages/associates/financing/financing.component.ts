import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { HyperToastsService } from 'lib-services';
import swal from 'sweetalert2';
import { SharedService } from '@app-admin-back-office/services/shared.service';


@Component({
    selector: 'app-admin-back-office-financing',
    templateUrl: './financing.component.html',
    styleUrls: ['./financing.component.less']
})
export class FinancingComponent implements OnInit {

    financed: any;
    financedFilter: any;

    cols: any;
    cols2 = [];
    optionsFilter: any;

    selectedPaidInput: any;
    selectedGeneratedInvoice: any;

    numberSolicitations = 0;
    totalValueFinancing = 0;
    totalValueInit = 0;

    constructor(
        private _sharedService: SharedService,
        private _hyperToastsService: HyperToastsService,
    ) {

        this.setFinanced();
    }

    ngOnInit() {
        this.optionsFilter = [
            { label: 'Todos', value: null },
            { label: 'Sim', value: true },
            { label: 'Não', value: false }
        ];
    }

    setFinanced() {
        this.cols = [];
        this.financed = [];
        this._sharedService.getFinancing().subscribe(
            response => {
                if (response.return) {
                    this.financed = response.data;
                    this.financed.forEach(element => {
                        if (element.plots_obj !== null) {
                            const obj = JSON.parse(element.plots_obj);
                            let valueTotal = 0;
                            for (let i = 0; i < obj.length; i++) {
                                valueTotal += parseFloat(obj[i].value);
                                element['p' + (i + 1)] = obj[i].value;
                            }

                            element.total = valueTotal.toFixed(2);
                        }
                    });
                    Object.keys(this.financed[0]).forEach(col => {
                        this.setCols(col);
                    });

                    this.financedFilter = this.financed.slice();

                    this.onfilterCal({ filteredValue: this.financed });
                } else {
                    this._hyperToastsService.addToast('warn', 'Atenção', 'Não existe ninguém para autorizar financiamento.');
                }
            },
            err => {
                this._hyperToastsService.addToast('error', 'Error', 'Aconteceu algum erro, entre em contato com o Suporte.');
                console.error(err);
            }
        );
    }

    setCols(col: string) {
        switch (col) {
            case 'request_date':
                this.cols.push({
                    field: col,
                    header: 'Data de Solicitação'
                });
                break;
            case 'id':
                this.cols.push({
                    field: col,
                    header: 'Código'
                });
                break;
            case 'name':
                this.cols.push({
                    field: col,
                    header: 'Nome'
                });
                break;
            case 'email':
                this.cols.push({
                    field: col,
                    header: 'Email'
                });
                break;
            case 'cpf_cnpj':
                this.cols.push({
                    field: col,
                    header: 'CPF/CNPJ'
                });
                break;
            case 'value_init':
                this.cols.push({
                    field: col,
                    header: 'Entrada'
                });
                break;
            case 'value_financed':
                this.cols.push({
                    field: col,
                    header: 'Financiado'
                });
                break;
            case 'id_financing':
                break;
            case 'status':
                break;
            case 'paidInput':
                break;
            case 'generatedInvoice':
                break;
            case 'id_sol':
                break;
            case 'cellphone':
                break;
            case 'phone':
                break;
            case 'cpf':
                break;
            case 'patrocinador':
                break;
            case 'patemail':
                break;
            case 'plots':
                break;
            case 'plots_obj':
                break;
            case 'street':
                break;
            case 'number':
                break;
            case 'complement':
                break;
            case 'neighborhood':
                break;
            case 'city':
                break;
            case 'state':
                break;
            case 'zipcode':
                break;
            case 'country':
                break;
            case 'p1':
                break;
            case 'p2':
                break;
            case 'p3':
                break;
            case 'p4':
                break;
            case 'p5':
                break;
            case 'p6':
                break;
            case 'total':
                break;
            default:
                this.cols.push({
                    field: col,
                    header: _.upperFirst(col).replace(new RegExp('_'), ' ')
                });
                break;
        }
    }

    validate(associate) {
        swal({
            title: 'Confirmar Financiamento',
            text: 'Deseja realmente confirmar o financiamento  de ' + associate.name + ' no valor de R$' + associate.value_financed + '?',
            type: 'success',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Confirmar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (!result.dismiss) {
                const data = {
                    id_financing: associate.id_financing,
                    validate: true
                };
                this._sharedService.setFinancing(data).subscribe(
                    response => {
                        if (response.return) {
                            this._hyperToastsService.addToast('success', 'Aprovado', 'Financiamento aguardando pagamento');
                            this.setFinanced();
                        } else {
                            this._hyperToastsService.addToast('warn', 'Atenção', 'Aconteceu algum erro entre em contato com o Suporte!');
                            console.log(response);
                        }
                    },
                    err => {
                        this._hyperToastsService.addToast('error', 'Error', 'Aconteceu algum erro entre em contato com o Suporte!');
                        console.error(err);
                    }
                );
            }
        },
            err => {
                this._hyperToastsService.addToast('error', 'Erro', err.msg);
            });
    }

    denied(associate) {
        swal({
            title: 'Recusar Financiamento',
            text: 'Deseja realmente recusar o financiamento  de ' + associate.name + ' no valor de R$' + associate.value_financed + '?',
            type: 'error',
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
        }).then((result) => {
            if (!result.dismiss) {
                const data = {
                    id_financing: associate.id_financing,
                    validate: false,
                    reason: result.value
                };
                this._sharedService.setFinancing(data).subscribe(
                    response => {
                        if (response.return) {
                            this._hyperToastsService.addToast('success', 'Recusado', 'Financiamento recusando!');
                            this.setFinanced();
                        } else {
                            this._hyperToastsService.addToast('warn', 'Atenção', 'Aconteceu algum erro entre em contato com o Suporte!');
                            console.log(response);
                        }
                    },
                    err => {
                        this._hyperToastsService.addToast('error', 'Error', 'Aconteceu algum erro entre em contato com o Suporte!');
                        console.error(err);
                    }
                );
            }
        },
            err => {
                throw new Error('Method not implemented.');
            });
    }

    changePaidInput(data) {
        swal({
            title: 'Pagamento da Entrada',
            text: 'Deseja confirmar o pagamento da entrada de ' + data.name + ' no valor de R$ ' + data.value_init + '?',
            type: 'success',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Confirmar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (!result.dismiss) {
                const obj = {
                    id_financing: data.id_financing,
                    paidInput: data.paidInput,
                    flag: 'paidInput'
                };
                this._sharedService.setFinancingFlags(obj).subscribe(
                    response => {
                        if (response.return) {
                            this._hyperToastsService.addToast('success', 'Aprovado', 'Pagamento da entrada confirmado.');
                        } else {
                            this._hyperToastsService.addToast('warn', 'Atenção', 'Aconteceu algum erro entre em contato com o Suporte!');
                            console.log(response);
                        }
                    },
                    err => {
                        this._hyperToastsService.addToast('error', 'Error', 'Aconteceu algum erro entre em contato com o Suporte!');
                        console.error(err);
                    }
                );
            } else {
                this.financed.forEach(element => {
                    if (element.id_financing === data.id_financing) {
                        element.paidInput = !element.paidInput;
                    }
                });
            }
        },
            err => {
                this._hyperToastsService.addToast('error', 'Erro', err.msg);
            });
    }

    changeGeneratedInvoice(data) {
        swal({
            title: 'Nota Fiscal Emitida',
            text: 'Nota fiscal emitida para ' + data.name + '?',
            type: 'success',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Confirmar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (!result.dismiss) {
                const obj = {
                    id_financing: data.id_financing,
                    generatedInvoice: data.generatedInvoice,
                    flag: 'generatedInvoice'
                };
                this._sharedService.setFinancingFlags(obj).subscribe(
                    response => {
                        if (response.return) {
                            this._hyperToastsService.addToast('success', 'Aprovado', 'Confirmação de nota fiscal emitida com sucesso.');
                        } else {
                            this._hyperToastsService.addToast('warn', 'Atenção', 'Aconteceu algum erro entre em contato com o Suporte!');
                            console.log(response);
                        }
                    },
                    err => {
                        this._hyperToastsService.addToast('error', 'Error', 'Aconteceu algum erro entre em contato com o Suporte!');
                        console.error(err);
                    }
                );
            } else {
                this.financed.forEach(element => {
                    if (element.id_financing === data.id_financing) {
                        element.generatedInvoice = !element.generatedInvoice;
                    }
                });
            }
        });
    }

    onFilterFinanced() {
        this.financedFilter = this.financed.slice();

        if (this.selectedPaidInput != null && this.selectedPaidInput !== undefined) {
            this.financedFilter = this.financedFilter.filter(element => element.paidInput === this.selectedPaidInput);
        }

        if (this.selectedGeneratedInvoice != null && this.selectedGeneratedInvoice !== undefined) {
            this.financedFilter = this.financedFilter.filter(element => element.generatedInvoice === this.selectedGeneratedInvoice);
        }

        this.onfilterCal({ filteredValue: this.financedFilter });
    }

    exportFile(item) {
        this.setCols2();

        setTimeout(function () {
            item.exportCSV();
        }, 500);
    }

    onfilterCal(event) {
        this.totalValueFinancing = 0;
        this.totalValueInit = 0;
        this.numberSolicitations = event.filteredValue.length;

        if (event.filteredValue !== null) {
            event.filteredValue.forEach(element => {
                this.totalValueFinancing += parseFloat(element.value_financed);
                this.totalValueInit += parseFloat(element.value_init);
            });
        }
    }

    setCols2() {
        this.cols2 = [
            { header: 'IDFin', field: 'id_financing' },
            { header: 'IDAssociado', field: 'id' },
            { header: 'Associado', field: 'name' },
            { header: 'Email', field: 'email' },
            { header: 'Cell', field: 'cellphone' },
            { header: 'CPF', field: 'cpf_cnpj' },
            { header: 'Valor financiado', field: 'value_financed' },
            { header: 'Parcelas', field: 'plots' },
            { header: 'Entrada', field: 'value_init' },
            { header: 'Dt Solicitação', field: 'request_date' },
            { header: 'P1', field: 'p1' },
            { header: 'P2', field: 'p2' },
            { header: 'P3', field: 'p3' },
            { header: 'P4', field: 'p4' },
            { header: 'P5', field: 'p5' },
            { header: 'P6', field: 'p6' },
            { header: 'Total', field: 'total' },
            { header: 'Endereço', field: 'street' },
            { header: 'Número', field: 'number' },
            { header: 'Complemento', field: 'complement' },
            { header: 'Bairro', field: 'neighborhood' },
            { header: 'Cidade', field: 'city' },
            { header: 'Estado', field: 'state' },
            { header: 'CEP', field: 'zipcode' },
            { header: 'Pais', field: 'country' }
        ];
    }
}
