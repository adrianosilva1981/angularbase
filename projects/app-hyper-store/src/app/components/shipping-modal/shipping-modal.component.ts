import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-hyper-store-shipping-modal',
  templateUrl: './shipping-modal.component.html',
  styleUrls: ['./shipping-modal.component.less']
})
export class ShippingModalComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ShippingModalComponent>,
    @Inject(MAT_DIALOG_DATA) public _data: any
  ) { }

  ngOnInit() { }

  closeModal() {
    this.dialogRef.close(this._data);
  }
}
