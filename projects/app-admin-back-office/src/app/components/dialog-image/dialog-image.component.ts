import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-admin-back-office-dialog-image',
  templateUrl: './dialog-image.component.html',
  styleUrls: ['./dialog-image.component.less']
})
export class DialogImageComponent implements OnInit {

  public data: any;
  constructor(
    public dialogRef: MatDialogRef<DialogImageComponent>,
    @Inject(MAT_DIALOG_DATA) public _data: any
  ) {
    this.data = _data;
     // console.log(this.data);
  }

  ngOnInit() {
  }

}
