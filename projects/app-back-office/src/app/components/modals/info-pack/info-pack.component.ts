import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-back-office-info-pack',
  templateUrl: './info-pack.component.html',
  styleUrls: ['./info-pack.component.less']
})
export class InfoPackComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit() {
  }

}
