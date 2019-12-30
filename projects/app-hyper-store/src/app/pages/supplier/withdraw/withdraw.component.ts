import { Component, OnInit } from '@angular/core';
import { SharedService } from '@app-hyper-store/services/shared.service';
import { Router } from '@angular/router';
import { HyperToastsService } from 'lib-services';

@Component({
  selector: 'app-hyper-store-withdraw',
  templateUrl: './withdraw.component.html',
  styleUrls: ['./withdraw.component.less']
})
export class WithdrawComponent implements OnInit {
  public objExtract: any = [];
  public obj: any = [];
  public dataSelected = [];
  private dataSelectedTotal = 0;
  public dataSelectedTotalFormated: string;
  public banks = [
    {
      accountname: 'BackOffice',
      accountnumber: '',
      agencynumber: '',
      id: '',
      idBank: '',
      operation: '',
      ownerdocument: null,
      ownername: '',
      desc: 'Receba diretamente o valor em sua conta no BackOffice'
    }
  ];
  public cols = [
    { field: 'id', header: 'Pedido(s)' },
    { field: 'statusText', header: 'Status' },
    { field: 'date', header: 'Data Pagamento' },
    { field: 'amountHtml', header: 'Valor' },
    { field: 'action', header: 'Ações' },

  ];
  public colsWithdraw = [
    { field: 'id', header: 'Pedido(s)' },
    { field: 'amountHtml', header: 'Valor' }

  ];
  public optionsStep = [
    {
      icon: 'fa-file-invoice-dollar',
      text: 'Pedidos'
    },
    {
      icon: 'fa-university',
      text: 'Contas'
    },
    {
      icon: 'fa-clipboard-check',
      text: 'Confirmação'
    }
  ];
  public step = 1;
  public indexBankSelected: any;
  public msgs = [];

  constructor(
    private _sharedService: SharedService,
    private _router: Router,
    private _toast: HyperToastsService
  ) {
    this._sharedService.getExtractItems().subscribe(
      (response: any) => {
        if (response.return && response.data.length > 0 && response.activated) {
          this.getSupplierInfo();
          this.objExtract = response.data;
          this.obj = response.data;
          this.objExtract.forEach(element => {
            element['statusText'] = element['paid'] == 1 ? 'Pago' : element['id_request'] != null ? 'Solicitado' : 'A receber';
            element['id'] = element['id_bso_payment'] == null ? element['id'] : element['id_bso_payment'];
            element['date'] = element['date_payment'] == null ? '**/**/****' : new Date(element['date_payment']).toLocaleDateString();
            element['amountHtml'] = Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(element['value_payment'] == null ? Number(element['total_supplier_value']) + Number(element['freight_value']) : element['value_payment']);
          });
        } else {
          if (response.activated) {
            this.msgs.push({
              severity: 'warn', summary: 'Prezado fornecedor, ', detail: 'nenhum pedido dentro do prazo pré estabelecido para solicitação de resgate'
            });
          } else {
            this.msgs.push({
              severity: 'warn', summary: 'Prezado fornecedor, ', detail: 'ative-se no <a href="https://office.youhub.com.br/">BackOffice</a> para então solicitar o resgate '
            });
          }
        }
      });
  }

  ngOnInit() {
    this._sharedService.addBreadCrumb(
      [
        { 'text': 'Dashboard', 'router': '/supplier/dash' },
        { 'text': 'Extrato Cupons Smart', 'router': '/supplier/extract' },
        { 'text': 'Solicitar Resgate', 'router': '' }
      ]
    );
  }
  onRowSelect(event) {
    this.dataSelected.push(event.data);
    this.dataSelectedTotal += Number(event.data.total_supplier_value) + Number(event.data.freight_value);

  }

  onRowUnselect(event) {
    const index = this.dataSelected.findIndex(x => x == event.data);
    this.dataSelected.splice(index, 1);

    this.dataSelectedTotal -= Number(event.data.total_supplier_value) + Number(event.data.freight_value);
  }

  selectDoc(selected) {
    const docs = JSON.parse(selected.photo_url);
    window.open('https://' + docs[0].url, '_blank');
  }

  getSupplierInfo() {
    this._sharedService.getSupplier().subscribe(
      response => {
        if (response.return) {
          const banks = response.data.banks.filter(item => {
            if (item.ownerdocument != null) {
              item.ownerdocument = item.ownerdocument.substring(0, item.ownerdocument.length - 4) + '****';
              return item;
            }
          });
          this.banks.push(...banks);
          if (response.data.banks.length > banks.length) {
            this._toast.addToast('warn', 'Atenção', 'Uma ou mais contas não possui CPF, favor cadastrar novamente a conta bancária');
          }
        }
      });
  }

  nextStep() {
    this.step++;
    this.dataSelectedTotalFormated = Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(this.dataSelectedTotal);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  bankSelect(idx) {
    this.indexBankSelected = idx;
    window.scrollTo({ top: 50000, behavior: 'smooth' });
  }
  withdraw() {
    const obj = {
      itens: this.dataSelected,
      idAccount: this.banks[this.indexBankSelected].id
    };
    this._sharedService.requestPayment(obj).subscribe(
      response => {
        if (response.return) {
          this._router.navigate(['/extract']);
          this._toast.addToast('success', 'Parabéns', response.msg);
        }
      }
    );
  }
}
