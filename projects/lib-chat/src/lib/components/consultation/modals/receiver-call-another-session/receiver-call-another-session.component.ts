import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-receiver-call-another-session',
  templateUrl: './receiver-call-another-session.component.html',
  styleUrls: ['./receiver-call-another-session.component.css']
})
export class ReceiverCallAnotherSessionComponent implements OnInit {

  public objParams: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ReceiverCallAnotherSessionComponent>
  ) { }

  ngOnInit() {
    this.objParams = this.data;
  }
}