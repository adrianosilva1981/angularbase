import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-receiver-offline',
  templateUrl: './receiver-offline.component.html',
  styleUrls: ['./receiver-offline.component.css']
})
export class ReceiverOfflineComponent implements OnInit {

  public objParams: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ReceiverOfflineComponent>
  ) { }

  ngOnInit() {
    this.objParams = this.data;

  }
}