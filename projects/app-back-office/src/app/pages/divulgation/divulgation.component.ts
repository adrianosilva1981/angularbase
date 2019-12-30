import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HyperToastsService } from 'lib-services';
import { environment } from '@env/app-back-office';
import { SharedService } from '@app-back-office/services/shared.service';

@Component({
  selector: 'app-back-office-divulgation',
  templateUrl: './divulgation.component.html',
  styleUrls: ['./divulgation.component.less']
})
export class DivulgationComponent implements OnInit {

  public userObj: any;
  public emails = [];
  public selectedEmails = [];
  public mailbody = '';
  public link = '';
  public leadOK = false;
  public leadloading = false;
  public emailOk = false;

  constructor(
    private router: Router,
    private _hyperToastsService: HyperToastsService,
    private _sharedService: SharedService
  ) {
    this.getmyleads();
  }

  getmyleads() {
    this.leadloading = true;
    this._sharedService.getLeads('/email').subscribe(response => {
      if (response.return) {
        this.emails = response.data;
        this.leadOK = true;
        this.leadloading = false;
      } else {
        this.leadOK = false;
        this.leadloading = false;
        // this._alertsService.showMSG('warning', response.msg);
      }
    },
      err => {
        this.leadOK = false;
        this.leadloading = false;
        this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro inesperado. Atualize a página e tente novamente');
      }
    );
  }

  ngOnInit() {

    this.userObj = this._sharedService.getCookieReseller() || ''; // pega info do reseller
    this.link = environment.host + 'office/preregister?reseller=' + this.userObj.username;

  }

  goToRoute(path) {
    this.router.navigate(['office' + path]);
  }

  sendMail() {
    this.emailOk = true;
    const objmail = {
      email: [],
      message: this.mailbody + '<br> <b>Link para cadastro:</b> <a href=' + this.link + ' target=_blank>Clique aqui para participar!</a>'
    };
    this.selectedEmails.forEach(element => {
      objmail.email.push(element.email);
    });
    this._sharedService.sendMail(objmail).subscribe(response => {
      if (response.return) {
        this.emailOk = false;
        this._hyperToastsService.addToast('success', 'Sucesso', response.msg);
        this.selectedEmails = [];
        this.getmyleads();
        this.mailbody = '';
        this.router.navigate(['office/divulgation']);
      } else {
        this.emailOk = false;
        this._hyperToastsService.addToast('warn', 'Atenção', response.msg);
      }
    },
      err => {
        this.emailOk = false;
        this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro inesperado. Atualize a página e tente novamente');
      }
    );
  }
}
