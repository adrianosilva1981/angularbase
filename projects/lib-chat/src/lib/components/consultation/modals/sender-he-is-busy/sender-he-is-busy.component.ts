import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';


@Component({
  selector: 'app-sender-he-is-busy',
  templateUrl: './sender-he-is-busy.component.html',
  styleUrls: ['./sender-he-is-busy.component.css']
})
export class SenderHeIsBusyComponent implements OnInit {

  public objParams: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<SenderHeIsBusyComponent>
  ) { }

  ngOnInit() {
    this.objParams = this.data;

  }
}