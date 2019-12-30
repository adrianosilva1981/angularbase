import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';;

@Component({
  selector: 'app-call-evaluete',
  templateUrl: './call-evaluete.component.html',
  styleUrls: ['./call-evaluete.component.css']
})
export class CallEvalueteComponent implements OnInit {

  public params: any;
  public maskOptions: any = {};
  public valueResume;
  public objReturn: any = {
    rating: 0,
    comment: ''
  };
  public messageErrorMedia = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CallEvalueteComponent>
  ) { }

  ngOnInit() {
    const _self = this;
    this.params = this.data;
    this.valueResume = this.params.amount;

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
}
