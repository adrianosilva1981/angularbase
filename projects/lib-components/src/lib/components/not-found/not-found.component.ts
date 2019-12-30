import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'lib-components-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.less']
})
export class NotFoundComponent implements OnInit {

  @Input() linkHome = '/';

  constructor(
    private _router: Router
  ) { }

  ngOnInit() {
  }

  redirectToHome() {
    this._router.navigate([this.linkHome]);
  }

}
