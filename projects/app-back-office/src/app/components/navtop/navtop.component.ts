import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { SharedService } from '@app-back-office/services/shared.service';
import { HyperToastsService, BroadcastEventService } from 'lib-services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-back-office-navtop',
  templateUrl: './navtop.component.html',
  styleUrls: ['./navtop.component.less']
})
export class NavtopComponent implements OnInit {

  public userObj: any = {};
  public resseler: any = {};
  public drop = false;
  public images: any[] = []; // tem que iniciar com algum valor se não ele não roda

  constructor(
    private _router: Router,
    private _sharedService: SharedService,
    private _hyperToastsService: HyperToastsService,
  ) {
    this.atualizauserObj();
    // this.setImages();
  }

  ngOnInit() {
    BroadcastEventService.event('changestatus').subscribe(
      response => {
        this.atualizauserObj();
      });
  }

  atualizauserObj() {
    this._sharedService.getinfoResseler().subscribe(
      response => {
        if (response.return) {
          this.userObj = response.data;
          // console.log(this.userObj);
        } else {
          this._hyperToastsService.addToast('warn', 'Atenção', response.msg);
        }
      },
      err => {
        this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro inesperado. Atualize a página e tente novamente');
      }
    );
  }

  logout() {
    this._sharedService.logout();
  }

  onShowSidebarMenu() {
    BroadcastEventService.event('sidebarMenu').emit(true);
  }

  setImages() {
    this._sharedService.getImages('BANNER').subscribe(
      response => {
        if (response.return) {
          this.images = response.data;
          this.images.forEach((image: any) => image.url_desktop = 'http://' + image.url_desktop);
        } else {
          console.error(response);
        }
      },
      err => {
        console.error(err);
      }
    );
  }

  redirect(link: string) {
    window.location.replace(link);
  }
}
