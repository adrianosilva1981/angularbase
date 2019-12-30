import { Component, OnInit } from '@angular/core';

declare var require: any;
const jsonSearch = require('global/data/search-opportunity.json');

@Component({
  selector: 'lib-navbar-app-hyper-opportunity',
  templateUrl: './app-hyper-opportunity.component.html',
  styleUrls: ['./app-hyper-opportunity.component.less']
})
export class AppHyperOpportunityComponent implements OnInit {

  public objOptonsSearch: any;

  constructor() { }

  ngOnInit(): void {
    this.objOptonsSearch = jsonSearch;
  }
}
