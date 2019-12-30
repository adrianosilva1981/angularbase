import { SharedService } from '@app-back-office/services/shared.service';
import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';


@Component({
  selector: 'app-back-office-info-debits',
  templateUrl: './info-debits.component.html',
  styleUrls: ['./info-debits.component.less']
})
export class InfoDebitsComponent implements OnInit {

  public images: any[] = [];
  public _data: any;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this._data = data.resultD.data;
  }


  ngOnInit() { }

}
