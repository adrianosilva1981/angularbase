import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../services/shared.service';
import { HyperCookieService, HyperToastsService } from 'lib-services';

@Component({
  selector: 'app-hyper-opportunity-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {

  currentPage = 1;
  public objOpportunity: any = [];
  public objFilter = {
    order: '',
    page: this.currentPage,
    size: '20',
    filter: {
      city: '',
      category: '',
      subcategory: '',
      ocupation: '',
      search: ''
    }
  };

  constructor(
    private _sharedService: SharedService,
    private _alertsService: HyperToastsService
  ) {

  }

  ngOnInit() {
    this.getOpportunities([], this.objFilter, true);
  }


  shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  getOpportunities(range = [], filt = {}, reset = true) {
    this._sharedService.getOpportunities(range, filt).subscribe(
      (response: any) => {
        if (response.return) {
          if (reset) {
            this.objOpportunity = [];
          }
          this.objOpportunity = this.objOpportunity.concat(response.data);
        } else {
          this._alertsService.addToast('warn', 'Atenção', response.msg);
        }
      },
      err => { this._alertsService.addToast('error', 'Erro', err); }
    );
  }

  loadMoreResults() {
    this.currentPage++;

    this.objFilter.page = this.currentPage;
    this.getOpportunities([], this.objFilter, false);
  }
}

