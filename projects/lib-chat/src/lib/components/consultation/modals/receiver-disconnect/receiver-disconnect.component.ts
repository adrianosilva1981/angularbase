import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-receiver-disconnect',
  templateUrl: './receiver-disconnect.component.html',
  styleUrls: ['./receiver-disconnect.component.css']
})
export class ReceiverDisconnectComponent implements OnInit {

  public objParams: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ReceiverDisconnectComponent>
  ) { }

  ngOnInit() {
    this.objParams = this.data;

  }
}
