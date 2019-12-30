import { Component, OnInit } from '@angular/core';
import { BroadcastEventService } from 'lib-services';

@Component({
  selector: 'app-hyper-store-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.less']
})
export class FooterComponent implements OnInit {
  public currentYear;

  constructor() {

    const date = new Date;
    this.currentYear = date.getFullYear();
  }

  ngOnInit() { }
}
