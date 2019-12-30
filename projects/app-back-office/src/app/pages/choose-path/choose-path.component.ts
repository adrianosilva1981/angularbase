import { InfoRescueComponent } from './../../components/modals/info-rescue/info-rescue.component';
import { InfoDebitsComponent } from './../../components/modals/info-debits/info-debits.component';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HyperToastsService, BroadcastEventService } from 'lib-services';
import { environment } from '@env/app-back-office';
import { SharedService } from '@app-back-office/services/shared.service';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-back-office-choose-path-container',
  templateUrl: './choose-path.component.html',
  styleUrls: ['./choose-path.component.less']
})
export class ChoosePathContainerComponent implements OnInit {

  public finance = false;
  public link = '';
  public userObj: any = {};
  public resseler: any = {};

  public info: any = {};
  public viewinfo = false;

  public voucher: any = {};
  public voucherok = false;
  public upglade_plan = false;

  public urlBillet: any = {};

  public images: any[] = []; // tem que iniciar com algum valor se não ele não roda


  constructor(
    public _dialog: MatDialog,
    private _router: Router,
    private _sharedService: SharedService,
    private _hyperToastsService: HyperToastsService,
  ) {
    //this.setImages();
    // this.getFinancing();
  }

  ngOnInit() {
    this.atualizauserObj();

    BroadcastEventService.event('changestatus').subscribe(
      response => {
        this.atualizauserObj();
      });

    BroadcastEventService.event('changeLink').emit('home');

    this._sharedService.getDashBoard().subscribe(response => {
      if (response.return) {
        this.info = response.data;
        this.viewinfo = true;
        //console.log(this.info);

        this._sharedService.getVoucherResseler().subscribe(response2 => {
          // console.log(response2);
          if (response2.return) {
            this.voucherok = true;
            this.voucher = response2.data[0].voucher_number;
          } else {
            this.voucherok = false;
          }
        },
          err => {
            this.voucherok = false;
            this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro inesperado. Atualize a página e tente novamente');
          }
        );

      } else {
        this.viewinfo = true;
        this._hyperToastsService.addToast('warn', 'Atenção', response.msg);
      }
    },
      err => {
        this.viewinfo = true;
        this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro inesperado. Atualize a página e tente novamente');
      }
    );

  }

  getFinancing() {
    this._sharedService.getFlagFinance().subscribe(
      response => {
        if (response.return) {
          this.finance = response.data;
          // console.log(this.finance);
        }
      },
      err => {
        this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro inesperado. Atualize a página e tente novamente');
      }
    );
  }

  atualizauserObj() {
    this._sharedService.getinfoResseler().subscribe(
      response => {
        if (response.return) {
          this.userObj = response.data;
          this.link = environment.host + 'office/preregister?reseller=' + this.userObj.username;
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

  isOS() {
    return navigator.userAgent.match(/ipad|iphone/i);
  }

  copyMessage(text: string) {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = text;
    document.body.appendChild(selBox);
    if (this.isOS()) {
      const range = document.createRange();
      range.selectNodeContents(selBox);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      selBox.setSelectionRange(0, 999999);
    } else {
      selBox.focus();
      selBox.select();
    }
    document.execCommand('copy');
    document.body.removeChild(selBox);

    this._hyperToastsService.addToast('success', 'Sucesso', 'Link Copiado!');
  }

  preregister() {
    this._router.navigate(['office/preregister'], { queryParams: { 'reseller': this.userObj.username } });
  }

  paybitcoin() {
    this._router.navigate(['office/bitcoins']);
  }

  viewtree() {
    this._router.navigate(['office/tree']);
  }

  prepaid() {
    this._router.navigate(['office/prepaidcard']);
  }

  upgrade() {
    this._router.navigate(['office/upgrade']);
  }

  pay() {
    this._router.navigate(['office/access']);
  }

  payMonthly() {
    this._router.navigate(['office/monthly']);
  }

  payfinance() {
    this._router.navigate(['office/financing']);
  }

  travelpoint() {
    this._router.navigate(['office/travel']);
  }

  viewPre() {
    this._router.navigate(['office/tree'], { queryParams: { 'pos': 2 } });
  }

  viewInactive() {
    this._router.navigate(['office/tree'], { queryParams: { 'pos': 3 } });
  }

  setImages() {
    this._sharedService.getImages('BANNER').subscribe(
      response => {
        if (response.return) {
          this.images = response.data;
          this.images.forEach((image: any) => image.url_mobile = 'http://' + image.url_mobile);
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

  getLink(identifier){
    
    switch(identifier){
     
      case 'a':
      return window.open("http://edz.la/CEEI4?a=31193610","_blank");
      
      case 'b':
      return window.open("https://my.eduzz.com/user?prd=95712","_blank");


      case 'c':
      return window.open("https://vimeo.com/312572417","_blank");
     
    }
  
  }

}

