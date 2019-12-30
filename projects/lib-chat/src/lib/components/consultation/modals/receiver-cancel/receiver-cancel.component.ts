import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-receiver-cancel',
  templateUrl: './receiver-cancel.component.html',
  styleUrls: ['./receiver-cancel.component.css']
})
export class ReceiverCancelComponent implements OnInit {

  public objInit: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ReceiverCancelComponent>
  ) { }

  ngOnInit() {
    this.objInit = this.data;
    // console.log(this.objInit);
  }
}