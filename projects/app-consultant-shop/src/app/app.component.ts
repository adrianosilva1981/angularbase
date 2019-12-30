import { Component, OnInit, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-consultant-shop-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private _router: Router
  ) {
    this._router.events.subscribe(
      evt => {
        this.document.scrollingElement.scrollTop = 0;
      }
    );
    // if (evt instanceof NavigationEnd && this.resetBreadCrumb) {
    //   BroadcastEventService.event('onBreadCrumb').emit(null);
    // }
  }

  ngOnInit() { }
}
