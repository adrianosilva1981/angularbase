import { Component, OnInit, Input, SimpleChanges, OnChanges, SimpleChange } from '@angular/core';
import { HyperCookieService, HyperToastsService } from 'lib-services';

@Component({
  selector: 'app-hyper-opportunity-thumbnail',
  templateUrl: './thumbnail.component.html',
  styleUrls: ['./thumbnail.component.less']
})
export class ThumbnailComponent implements OnInit, OnChanges {

  @Input() opportunity: any;
  @Input() viewType: any = 'grid';

  public _opportunity: any;
  public _viewType: any;
  public startNumber = 0;

  constructor(
    private _cookieServices: HyperCookieService,
    private _alertService: HyperToastsService
  ) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    const auxOpportunity: SimpleChange = changes.opportunity;
    const auxViewType: SimpleChange = changes.viewType;

    if (auxOpportunity) {
      this._opportunity = auxOpportunity.currentValue;
      this.startNumber = this._opportunity.profile ? this._opportunity.profile.rating : 0;
    }

    if (auxViewType) {
      this._viewType = auxViewType.currentValue;
    }

  }

  viewDetails() {
    const auth = this._cookieServices.getCookie_AUTH();
    if (auth.paidSubscription === 'Y') {
      location.href = 'https://dash.hyper.jobs/job-opportunities/detail/job/' + this._opportunity.id;
    } else {
      this._alertService.addToast('warn', '', 'Área destinada a assinante', );
    }
  }

}
