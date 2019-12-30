import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-lps-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.less']
})
export class ContainerComponent implements OnInit {

  public lpToBuild = 'lp-hub-bank';

  constructor() { }

  ngOnInit() {
  }

}
