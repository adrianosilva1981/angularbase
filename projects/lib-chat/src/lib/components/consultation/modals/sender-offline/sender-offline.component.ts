import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-sender-offline',
  templateUrl: './sender-offline.component.html',
  styleUrls: ['./sender-offline.component.css']
})
export class SenderOfflineComponent implements OnInit {

  public objParams: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<SenderOfflineComponent>
  ) { }

  ngOnInit() {
    this.objParams = this.data;

  }
}