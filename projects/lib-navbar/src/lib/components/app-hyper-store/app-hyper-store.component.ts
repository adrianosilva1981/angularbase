import { Component, OnInit } from '@angular/core';

declare var require: any;
const jsonSearch = require('global/data/search-store.json');

@Component({
  selector: 'lib-navbar-app-hyper-store',
  templateUrl: './app-hyper-store.component.html',
  styleUrls: ['./app-hyper-store.component.less']
})
export class AppHyperStoreComponent implements OnInit {

  public objOptonsSearch: any;

  constructor() { }

  ngOnInit(): void {
    this.objOptonsSearch = jsonSearch;
  }
}
