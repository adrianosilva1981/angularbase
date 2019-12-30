import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-consultant-shop-search-subdomain',
  templateUrl: './search-subdomain.component.html',
  styleUrls: ['./search-subdomain.component.less']
})
export class SearchSubdomainComponent implements OnInit {

  public subdomain;

  constructor(
    private _router: Router
  ) { }

  ngOnInit() {
  }

  gotoStore() {
    this._router.navigate(['/store/' + this.subdomain]);
  }

}
