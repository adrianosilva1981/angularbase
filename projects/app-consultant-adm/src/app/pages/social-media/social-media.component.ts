import { Component, OnInit } from '@angular/core';
import { SharedService } from '@app-consultant-adm/services/shared.service';
import { HyperCookieService, HyperToastsService, BroadcastEventService } from 'lib-services';

@Component({
  selector: 'app-consultant-adm-social-media',
  templateUrl: './social-media.component.html',
  styleUrls: ['./social-media.component.less']
})
export class SocialMediaComponent implements OnInit {

  private idShop: any;

  public urls = [
    {
      name: 'facebook',
      prefix: 'https://www.facebook.com/',
      url: '',
      icon: 'fa-facebook',
    },
    {
      name: 'twitter',
      prefix: 'https://www.twitter.com/',
      url: '',
      icon: 'fa-twitter',
    },
    {
      name: 'pinterest',
      prefix: 'https://www.pinterest.com/',
      url: '',
      icon: 'fa-pinterest',
    },
    {
      name: 'instagram',
      prefix: 'https://www.instagram.com/',
      url: '',
      icon: 'fa-instagram',
    },
    {
      name: 'google',
      prefix: 'https://plus.google.com/',
      url: '',
      icon: 'fa-google-plus',
    },
    {
      name: 'youtube',
      prefix: 'https://www.youtube.com/',
      url: '',
      icon: 'fa-youtube',
    },
  ];
  private objForm = {
    social_media: []
  };
  constructor(
    private _sharedService: SharedService,
    private _hyperCookieService: HyperCookieService,
    private _hyperToastsService: HyperToastsService
  ) {

  }

  ngOnInit() {
    this._sharedService.addBreadCrumb(
      [
        { 'text': 'Dashboard', 'router': '/home' },
        { 'text': 'Configurações', 'router': '/settings/social' },
        { 'text': 'Redes Sociais', 'router': '' }
      ]
    );
    this._sharedService.getConsultants().subscribe(
      response => {
        if (response.return) {
          this.idShop = response.data.idShop;

          response.data.social_media.forEach(element => {
            this.urls.find(obj => obj.name === element.name.toLowerCase()).url = element.url.split('.com/')[1];
          });
        } else {
          this._hyperToastsService.addToast('warn', 'Atenção', response.msg);
        }
      },
      err => { this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro inesperado. Atualize a página e tente novamente'); }
    );
  }
  send() {
    const aux = JSON.parse(JSON.stringify(this.urls.filter(x => x.url !== '')));
    aux.forEach(element => {
      element.url.replace(/\s+/g, '');
      element.url = element.prefix + element.url;
      delete element.prefix;
    });
    this.objForm.social_media = aux;
    this._sharedService.postSocial(this.idShop, this.objForm).subscribe(
      response => {
        if (response.return) {
          this._hyperToastsService.addToast('success', 'Parabéns', response.msg);
        } else {
          this._hyperToastsService.addToast('warn', 'Atenção', response.msg);
        }
      },
      err => { this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro inesperado. Atualize a página e tente novamente'); }
    );
    //////////////////
    //// send aux ////
    //////////////////


  }

}
