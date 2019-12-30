import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-consultant-shop-address-form-modal',
  templateUrl: './address-form-modal.component.html',
  styleUrls: ['./address-form-modal.component.less']
})
export class AddressFormModalComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<AddressFormModalComponent>,
    @Inject(MAT_DIALOG_DATA) public _data: any
  ) { }

  ngOnInit() {
  }

  addressRegistered(evt) {
    this.dialogRef.close(evt);
  }
}
