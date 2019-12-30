import { Component, OnInit, Input } from '@angular/core';
import { SharedService } from '@app-consultant-adm/services/shared.service';
import { HyperToastsService } from 'lib-services';

@Component({
  selector: 'app-consultant-adm-ads-extract-cpm',
  templateUrl: './ads-extract-cpm.component.html',
  styleUrls: ['./ads-extract-cpm.component.less']
})
export class AdsExtractCpmComponent implements OnInit {

  @Input() publicity: any;

  public extracts = [];
  public qtdTotal = 0;
  public qtdDelivered = 0;
  public qtdLoginView = 0;

  public cols = [
    { field: 'id_extract', header: 'Código' },
    { field: 'id_product', header: 'Código Produto' },
    { field: 'name_product', header: 'Produto' },
    { field: 'name_user', header: 'Usuário' },
    { field: 'created', header: 'Data de Visualização' },
    { field: 'ip', header: 'IP' }
  ];

  constructor(
    private _sharedService: SharedService,
    private _hyperToastsService: HyperToastsService
  ) { }

  ngOnInit() {
    if (this.publicity) {
      this._sharedService.listPublicityExtract('cpm', this.publicity.id).subscribe(
        (response: any) => {
          if (response.return) {
            this.extracts = response.data;
            this.qtdTotal = this.extracts[0].qtdCpm;
            this.qtdDelivered = this.extracts.length;
            this.extracts.forEach(element => {
              if (element.id_user > 0) {
                this.qtdLoginView++;
              }
            });
          }
        },
        err => { this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro inesperado. Atualize a página e tente novamente'); }
      );
    }
  }
}
