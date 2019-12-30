import { Component, OnInit, Input, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hyper-store-thumbnail-user',
  templateUrl: './thumbnail-user.component.html',
  styleUrls: ['./thumbnail-user.component.less']
})
export class ThumbnailUserComponent implements OnInit, OnChanges {

  @Input() user: any;

  public _user: any;
  public startNumber = 0;

  constructor(
    private _router: Router
  ) { }

  ngOnInit() { }

  ngOnChanges(changes: SimpleChanges) {
    const auxUser: SimpleChange = changes.user;

    if (auxUser) {
      this._user = auxUser.currentValue;
      this.startNumber = this._user.profile ? this._user.profile.rating : 0;
    }
  }

  viewDetails() {
    this._router.navigate(['/department/professional/' + this._user.id]);
  }

}
