import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'lib-login-copy-right',
  templateUrl: './copy-right.component.html',
  styleUrls: ['./copy-right.component.less']
})
export class CopyRightComponent implements OnInit {

  public currentYear = (new Date()).getFullYear();

  constructor() { }

  ngOnInit() {
  }
}
