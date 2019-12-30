import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-sender-reject',
  templateUrl: './sender-reject.component.html',
  styleUrls: ['./sender-reject.component.css']
})
export class SenderRejectComponent implements OnInit {

  public objParams: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<SenderRejectComponent>
  ) { }

  ngOnInit() {
    this.objParams = this.data;

  }
}