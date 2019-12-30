import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.less']
})
export class SidenavComponent implements OnInit {

  public listMenus = [
    { group: '', route: '' }
  ];

  constructor() { }

  ngOnInit() {
  }

}
