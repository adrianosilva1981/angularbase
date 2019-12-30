import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-receiver-call',
  templateUrl: './receiver-call.component.html',
  styleUrls: ['./receiver-call.component.css']
})
export class ReceiverCallComponent implements OnInit {

  public objInit: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ReceiverCallComponent>
  ) { }

  ngOnInit() {
    this.objInit = this.data;
  }

}
