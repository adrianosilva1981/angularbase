import { Component, OnInit, Inject } from '@angular/core';
import { SharedService } from '@app-back-office/services/shared.service';
import { HyperToastsService } from 'lib-services';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-back-office-spread',
  templateUrl: './spread.component.html',
  styleUrls: ['./spread.component.less']
})
export class SpreadComponent implements OnInit {

  public listShare = [];
  public menuSelect = 0;
  public menu: any = [
    {
      text: 'Ver sua Equipe Matriz',
      icon: 'tab-facebook',
      pos: 0,
      socialNet: 'facebook'
    },
    {
      text: 'Ver sua Equipe Unilevel',
      icon: 'tab-instagram',
      pos: 1,
      socialNet: 'instagram'
    }
  ];

  public posts = [];
  public cols = [
    { field: 'description', header: 'Conteudo' },
    { field: 'startDate', header: 'Data Início' },
    { field: 'endDate', header: 'Data Limite' },
    { field: 'nrShare', header: 'Nr° há compartilhar' }
  ];

  public txtImage = 'Upload print do compartilhamento';
  public urlRequest = '';
  public pathBucket = '';

  public listImageUpload = [];

  constructor(
    @Inject('environments') private environment: any,
    private _sharedService: SharedService,
    private _hyperToastsService: HyperToastsService,
  ) { }

  ngOnInit() {
    this.urlRequest = this.environment.apiPhpV2 + 'tools/upload';
    this.pathBucket = 'post-users';

    this.listAdsToUser('facebook');
  }

  listAdsToUser(socialNet: String) {
    this._sharedService.listAdsToUser(this._sharedService.getCookieReseller().id_hj, socialNet).subscribe(
      (response: any) => {
        if (response.return) {
          this.listShare = response.data;
          const pipe = new DatePipe('en-Us');
          this.listShare.map(element => {
            element.startDate = pipe.transform(element.startDate, 'dd/MM/yyyy');
            element.endDate = pipe.transform(element.endDate, 'dd/MM/yyyy');
          });
        } else {
          this._hyperToastsService.addToast('warn', 'Atenção', response.msg);
          this.listShare = [];
        }
      },
      error => { this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro inesperado. Atualize a página e tente novamente'); }
    );
  }

  card(elem) {
    this.listAdsToUser(elem.socialNet);
  }

  onUpload(evt: any, share: any) {
    const listImages: any = share.prints;

    const auxPush = { urlImage: 'https://' + evt, created: new Date() };

    listImages.push(auxPush);

    this.txtImage = 'Trocar Imagem';
    share.prints = listImages;

    // Salvar imagem
    const data = {
      idUserShared: share.idSharedUser,
      idAdsShare: share.idShare,
      urlImage: auxPush
    };

    this._sharedService.addSharePrint(data).subscribe(
      (response: any) => {
        if (response.return) {
          this._hyperToastsService.addToast('success', 'Sucesso', 'Upload realizado com sucesso');
        }
      },
      error => { this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro inesperado. Atualize a página e tente novamente'); }
    );
  }
}
