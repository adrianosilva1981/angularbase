import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivateCodeComponent } from '@app-hyper-opportunity/components/activate-code/activate-code.component';
import { SharedService } from '@app-hyper-opportunity/services/shared.service';
import { BroadcastEventService } from 'lib-services';

declare var require: any;
const jsonSearch = require('global/data/search-opportunity.json');

@Component({
  selector: 'app-hyper-opportunity-sub-navbar',
  templateUrl: './sub-navbar.component.html',
  styleUrls: ['./sub-navbar.component.less']
})
export class SubNavbarComponent implements OnInit {

  public objOptonsSearch: any;
  public sidebarView: Boolean = false;
  public userData: any = {};

  constructor(
    private _dialog: MatDialog,
    private _sharedService: SharedService
  ) { }

  ngOnInit() {
    this.objOptonsSearch = jsonSearch;
    this.userData = this._sharedService.getUserObject();

    BroadcastEventService.event('listenerLoginComponent').subscribe(
      userData => {
        if (userData.JWT) {
          this.userData = userData;
        }
      }
    );
  }

  goTO(url) {
    window.location.href = url;
  }
  activateCode() {
    const dialogRef = this._dialog.open(ActivateCodeComponent, {
      data: 'parameters',
      panelClass: 'globalModalHJ'
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }

}
