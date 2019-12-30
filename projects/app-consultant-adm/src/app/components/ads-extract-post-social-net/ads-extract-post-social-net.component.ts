import { Component, OnInit, Input } from '@angular/core';
import { SharedService } from '@app-consultant-adm/services/shared.service';
import { HyperToastsService } from 'lib-services';

@Component({
  selector: 'app-consultant-adm-ads-extract-post-social-net',
  templateUrl: './ads-extract-post-social-net.component.html',
  styleUrls: ['./ads-extract-post-social-net.component.less']
})
export class AdsExtractPostSocialNetComponent implements OnInit {

  @Input() action = '';
  @Input() publicity: any;

  public extracts = [];
  public qtdTotal = 0;
  public qtdDelivered = 0;

  cols = [
    { field: 'idExtract', header: 'Código' },
    { field: 'url_post', header: 'Url post' },
  ];

  constructor(
    private _sharedService: SharedService,
    private _hyperToastsService: HyperToastsService
  ) { }

  ngOnInit() {
    if (this.publicity) {
      this._sharedService.listPublicityExtract('post_youhub', this.publicity.id, this.action).subscribe(
        (response: any) => {
          if (response.return) {
            this.extracts = response.data;
            this.qtdTotal = this.publicity[this.action];
            this.qtdDelivered = response.data.length;
          }
        },
        err => { this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro inesperado. Atualize a página e tente novamente'); }
      );
    }
  }
}
