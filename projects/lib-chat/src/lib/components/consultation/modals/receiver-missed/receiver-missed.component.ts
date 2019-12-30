import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-receiver-missed',
  templateUrl: './receiver-missed.component.html',
  styleUrls: ['./receiver-missed.component.css']
})
export class ReceiverMissedComponent implements OnInit {

  public objParams: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ReceiverMissedComponent>
  ) { }

  ngOnInit() {
    this.objParams = this.data;

  }
}