import { Component, OnInit } from '@angular/core';
import { SharedService } from '@app-consultant-adm/services/shared.service';

@Component({
  selector: 'app-consultant-adm-sub-navbar',
  templateUrl: './sub-navbar.component.html',
  styleUrls: ['./sub-navbar.component.less']
})
export class SubNavbarComponent implements OnInit {

  public sidebarView: Boolean = false;
  public consultantObj: any = {};

  constructor(
    private _sharedService: SharedService
  ) { }

  ngOnInit() {
    setTimeout(() => {
      this.consultantObj = this._sharedService.getOwnerStore();
    }, 500);
  }

  showMessage() {
    this.consultantObj = this._sharedService.getOwnerStore();

    if (this.consultantObj) {
      if (!this.consultantObj.subDomain) {
        alert('Preencha seu subdomino');
      } else if (!this.consultantObj.address_shop.zipCode) {
        alert('Preencha os dados da loja');
      }
    }
  }

}
