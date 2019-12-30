import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-sender-i-am-busy',
  templateUrl: './sender-i-am-busy.component.html',
  styleUrls: ['./sender-i-am-busy.component.css']
})
export class SenderIAmBusyComponent implements OnInit {

  public objParams: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<SenderIAmBusyComponent>
  ) { }

  ngOnInit() {
    this.objParams = this.data;

  }
}