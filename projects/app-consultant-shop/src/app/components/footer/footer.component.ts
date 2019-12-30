import { Component, OnInit } from '@angular/core';
import { SharedService } from '@app-consultant-shop/services/shared.service';
import { BroadcastEventService } from 'lib-services';

@Component({
  selector: 'app-consultant-shop-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.less']
})
export class FooterComponent implements OnInit {

  public objConsultant: any = {};
  public currentYear;
  public markers: any = [];

  constructor(
    private _sharedService: SharedService,
  ) {
    const date = new Date;
    this.currentYear = date.getFullYear();
  }

  ngOnInit() {
    this.objConsultant = this._sharedService.getOwnerStore();
    this.getAddresMap(this.objConsultant.address_shop.address + ', ' + this.objConsultant.address_shop.number + ', ' + this.objConsultant.address_shop.neighborhood + ', ' + this.objConsultant.address_shop.city + ', ' + this.objConsultant.address_shop.state);
  }

  getAddresMap(addr) {
    this._sharedService.addrGoogleMaps(addr).subscribe(
      (response: any) => {
        if (response.status === 'OK') {
          this.markers = response.results;
        }
      }
    );
  }

}
