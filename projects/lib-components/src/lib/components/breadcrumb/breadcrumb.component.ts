import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { BroadcastEventService } from 'lib-services';

@Component({
  selector: 'lib-components-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.less']
})
export class BreadcrumbComponent implements OnInit, OnDestroy {

  private subscriptRouter = new Subscription;
  private subscriptBread = new Subscription;
  private subscriptReset = new Subscription;
  private resetBreadCrumb = true;


  public objBreadCrumb: any = {};

  constructor(
    private _router: Router
  ) {
    this.subscriptRouter = this._router.events.subscribe(
      evt => {
        if (evt instanceof NavigationEnd && this.resetBreadCrumb) {
          BroadcastEventService.event('onBreadCrumb').emit(null);
        }
      }
    );
  }

  ngOnInit() {
    this.subscriptBread = BroadcastEventService.event('onBreadCrumb').subscribe(
      data => {
        this.objBreadCrumb = data;
      }
    );

    this.subscriptReset = BroadcastEventService.event('onResetBreadCrumbOnRouterChange').subscribe(
      data => {
        this.resetBreadCrumb = data;
      }
    );
  }

  gotoRouter(evt) {
    this._router.navigate([evt]);
  }

  ngOnDestroy() {
    this.subscriptRouter.unsubscribe();
    this.subscriptBread.unsubscribe();
    this.subscriptReset.unsubscribe();
  }

}
