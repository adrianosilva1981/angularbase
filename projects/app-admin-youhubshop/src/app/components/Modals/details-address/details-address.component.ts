import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogClose } from '@angular/material';
import * as _ from 'lodash';

@Component({
  selector: 'app-admin-youhubshop-details-address',
  templateUrl: './details-address.component.html',
  styleUrls: ['./details-address.component.less']
})
export class DetailsAddressComponent implements OnInit {
  cols = [];
  constructor(@Inject(MAT_DIALOG_DATA) private data: any, ) { }

  ngOnInit() {

    Object.keys(this.data).forEach(element => {
      this.cols.push({ field: element, header: _.upperFirst(_.lowerCase(element)) });
    });
  }

}
