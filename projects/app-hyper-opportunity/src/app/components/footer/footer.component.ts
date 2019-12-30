import { Component, OnInit } from '@angular/core';
import { BroadcastEventService } from 'lib-services';

@Component({
  selector: 'app-hyper-opportunity-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.less']
})
export class FooterComponent implements OnInit {
  public listServices: any;
  public currentYear;

  public placeHolders: any = {
    email: ''
  };
  constructor(
  ) {
    const date = new Date;
    this.currentYear = date.getFullYear();

    BroadcastEventService.event('attFooter').subscribe(
      listService => {
        this.listServices = listService;
      }
    );
  }

  ngOnInit() {

  }

}
