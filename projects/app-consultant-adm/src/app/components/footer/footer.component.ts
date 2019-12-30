import { Component, OnInit } from '@angular/core';
import { SharedService } from '@app-consultant-adm/services/shared.service';

@Component({
  selector: 'app-consultant-adm-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.less']
})
export class FooterComponent implements OnInit {
  public currentYear;

  public placeHolders: any = {
    email: ''
  };

  constructor(
    private _sharedService: SharedService
  ) {
    const date = new Date;
    this.currentYear = date.getFullYear();
  }

  ngOnInit() {}
}
