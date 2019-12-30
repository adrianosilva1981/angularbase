import { Component, OnInit } from '@angular/core';
import { BroadcastEventService, HyperToastsService } from 'lib-services';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'lib-extract-withdraw',
  templateUrl: './withdraw.component.html',
  styleUrls: ['./withdraw.component.less']
})
export class WithdrawComponent implements OnInit {
  public newBankAcc = new FormGroup({
    bank_number: new FormControl('', Validators.compose([Validators.required])),
    operation: new FormControl('', Validators.compose([Validators.required])),
    agency_number: new FormControl('', Validators.compose([Validators.required])),
    digitAg: new FormControl(),
    account_number: new FormControl('', Validators.compose([Validators.required])),
    digitAcc: new FormControl()
  });
  public typeAcc = [
    { label: 'Conta Corrente', value: 'CC' },
    { label: 'Conta Poupança', value: 'CP' }
  ];
  public listBank = [];
  public userBank = [];
  public selectedBank: any;
  public userBalance: any;
  public withdrawValue: number;
  public listWithdraw: any;

  public cols = [
    { field: 'title', header: 'Banco' },
    { field: 'amount', header: 'Valor' },
    { field: 'payment_date', header: 'Data' }
  ];
  constructor(
    private _service: SharedService,
    private _HyperToastsService: HyperToastsService
  ) { }

  ngOnInit() {
    BroadcastEventService.event('onBreadCrumb').emit([
      { 'text': 'Meu saldo', 'router': '/extract' },
      { 'text': 'Resgatar crédito', 'router': '' }
    ]);
    this._service.getAllBanks().subscribe(x => {
      x.data.forEach(element => {
        const aux = {
          label: element.title, value: element.code
        };
        this.listBank.push(aux);
      });
    });
    this.getUserBank();
    this._service.getUserBalance().subscribe(x => {
      this.userBalance = x.data[0];
    });
    this._service.getWithdrawList().subscribe(x => {
      if (x.return) {
        this.listWithdraw = x.data;
      }
    });
  }

  registerAcc() {
    if (this.newBankAcc.valid) {
      this.newBankAcc.get('agency_number').setValue(this.newBankAcc.get('agency_number').value + '-' + this.newBankAcc.get('digitAg').value);
      this.newBankAcc.get('account_number').setValue(this.newBankAcc.get('account_number').value + '-' + this.newBankAcc.get('digitAcc').value);
      this._service.postNewUserBank(this.newBankAcc.value).subscribe(
        x => {
          this._HyperToastsService.addToast('success', '', x.msg);
          this.getUserBank();
        }
      );
      this.newBankAcc.reset();
    }
  }

  getUserBank() {
    this.userBank = [];
    this._service.getUserBanks().subscribe(x => {
      if (x.return) {
        x.data.forEach(element => {
          const aux = {
            label: element.title, value: element
          };
          this.userBank.push(aux);
        });
      }
    });
  }
  withdraw() {
    if (this.withdrawValue < 30) {
      return this._HyperToastsService.addToast('warn', 'Atenção', 'Valor a ser resgatado incorreto ou inferior ao minimo de R$ 30,00');
    }
    if (this.withdrawValue - 12 > this.userBalance.balance) {
      return this._HyperToastsService.addToast('warn', 'Atenção', 'Valor a ser resgatado superior ao saldo disponível');
    }
    const withdrawObj = {
      id: this.selectedBank.id,
      coinRescue: 'BRL',
      amountRescue: this.withdrawValue
    };
  }
}
