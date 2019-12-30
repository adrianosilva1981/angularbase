import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-sender-call',
  templateUrl: './sender-call.component.html',
  styleUrls: ['./sender-call.component.css']
})
export class SenderCallComponent implements OnInit {

  public params: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<SenderCallComponent>
  ) { }

  ngOnInit() {
    this.params = this.data;
  }
}