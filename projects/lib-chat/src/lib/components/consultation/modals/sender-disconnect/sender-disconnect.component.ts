import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-sender-disconnect',
  templateUrl: './sender-disconnect.component.html',
  styleUrls: ['./sender-disconnect.component.css']
})
export class SenderDisconnectComponent implements OnInit {

  public objParams: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<SenderDisconnectComponent>
  ) { }

  ngOnInit() {
    this.objParams = this.data;

  }
}