import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-call-discount',
  templateUrl: './call-discount.component.html',
  styleUrls: ['./call-discount.component.css']
})
export class CallDiscountComponent implements OnInit {

  public params: any;
  public maskOptions: any = {};
  public valueResume;
  public objReturn: any = {
    discount: 0,
    type: 'value'
  };

  public messageErrorMedia = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CallDiscountComponent>
  ) { }

  ngOnInit() {
    const _self = this;
    this.params = this.data;
    this.valueResume = this.params.amount;

    setTimeout(function () {
      _self.selectType();
      _self.objReturn.discount = 0;
    }, 500);

    if (this.data.errorMedia !== undefined) {
      if (this.data.errorMedia.myError == true) {
        this.messageErrorMedia = 'Tivemos problemas para capturar sua media.';
      } else if (this.data.errorMedia.message == 'errorSenderCall') {
        this.messageErrorMedia = this.data.errorMedia.data.call_user.name + ' teve problemas para realizar a chamada.';
      } else {
        this.messageErrorMedia = this.data.errorMedia.data.call_receiver_user.name + ' teve problemas para aceitar a chamada.';
      }
    }
  }

  selectType() {
    this.verifyValues();
    switch (this.objReturn.type) {
      case 'value':
        this.maskOptions = {
          prefix: 'R$ ',
          thousands: '.',
          decimal: ',',
          align: 'left'
        }
        break;
      case 'percent':
        this.maskOptions = {
          prefix: '',
          suffix: '%',
          precision: 0,
          thousands: '.',
          align: 'left'
        }
        break;
    }
  }
  verifyValues() {
    if (this.objReturn.type === 'percent' && this.objReturn.discount > 100) {
      this.objReturn.discount = 100;
    }
  }
}