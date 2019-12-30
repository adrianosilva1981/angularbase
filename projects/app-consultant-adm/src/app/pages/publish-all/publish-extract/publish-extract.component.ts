import { Component, OnInit } from '@angular/core';
import { SharedService } from '@app-consultant-adm/services/shared.service';
import { HyperToastsService } from 'lib-services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-consultant-adm-publish-extract',
  templateUrl: './publish-extract.component.html',
  styleUrls: ['./publish-extract.component.less']
})
export class PublishExtractComponent implements OnInit {

  public publicity: any;
  public rowGroupMetadata: any;
  public selectMenu = 'cpm';

  public menus = [
    {
      label: 'Impressão (CPM)',
      action: 'cpm'
    },
    {
      label: 'E-mail Marketing',
      action: 'email'
    },
    {
      label: 'Compartilhamento',
      action: 'share'
    },
    {
      label: 'Post Instagram',
      action: 'post-instagram'
    },
    {
      label: 'Post Facebook',
      action: 'post-facebook'
    }
  ];

  constructor(
    private _router: Router,
    private _sharedService: SharedService,
    private _hyperToastsService: HyperToastsService
  ) { }

  ngOnInit() {
    this.publicity = this._sharedService.getPublish();

    if (this.publicity === undefined) {
      this._router.navigate(['/publish']);
    } else {
      this._sharedService.addBreadCrumb(
        [
          { 'text': 'Dashboard', 'router': '/home' },
          { 'text': 'Publicidades', 'router': '/publish' },
          { 'text': 'Extrato - ' + this.publicity.name, 'router': '' },
        ]
      );
    }
  }

  onSelectMenu(action) {
    this.selectMenu = action;
  }
}
