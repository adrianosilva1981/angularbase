import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-sender-missed',
  templateUrl: './sender-missed.component.html',
  styleUrls: ['./sender-missed.component.css']
})
export class SenderMissedComponent implements OnInit {

  public objParams: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<SenderMissedComponent>
  ) { }

  ngOnInit() {
    this.objParams = this.data;

  }
}