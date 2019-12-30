import { Component, OnInit } from '@angular/core';
import { SharedService } from '@app-back-office/services/shared.service';
import { HyperToastsService, BroadcastEventService } from 'lib-services';
import swal from 'sweetalert2';


@Component({
  selector: 'app-back-office-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.less']
})
export class NavbarComponent implements OnInit {

  isNavbarCollapsed = false;
  display = false;

  public userObj: any = {};
  public resseler: any = {};
  public link = '';
  public flagDownloads = false;
  public flagFinanceiro = false;
  public flagLoja = false;
  public flagKit = false;
  public flagVouchers = false;

  constructor(
    private _sharedService: SharedService,
    private _hyperToastsService: HyperToastsService
  ) {
    this.atualizauserObj();
  }

  ngOnInit() {

    BroadcastEventService.event('changestatus').subscribe(
      response => {
        this.atualizauserObj();
      });

    BroadcastEventService.event('changeLink').subscribe(
      response => {
        this.link = response;
      });

    if (this.link === '') {
      this.link = 'home';
    }
  }

  atualizauserObj() {
    this._sharedService.getinfoResseler().subscribe(
      response => {
        if (response.return) {
          this.userObj = response.data;
          console.log(this.userObj);
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

  suport() {
    swal({
      imageUrl: 'assets/img/logo_youhub.png',
      imageWidth: 200,
      width: 600,
      title: 'Suporte',
      html: 'Você pode entrar em contato conosco diretamente pelo Chat ou pelo email:<br> <span style="color: green;"><u>suporte@youhub.com.br</u></span>.'
      /*html: 'Você pode entrar em contato conosco diretamente pelo whatsapp:<br> <img src="assets/img/whatsapp.png"> <span style="color: green;"><b>(11) 94373-6885</b></span> <br> <br> Se preferir entre em contato pelo email:<br> <span style="color: green;"><u>suporte@youhub.com.br</u></span> <br><br><span style="color: #999; font-size: 12px;">Se você estiver usando o navegador Google Chrome <a href="http://api.whatsapp.com/send?1=pt_BR&phone=5511943736885&text=Ol%C3%A1%2C%20obrigado%20por%20entrar%20em%20contato%20com%20YOUHUB.%20Mande%20uma%20mensagem%20para%20iniciarmos%20nosso%20atendimento." target="_blank">Clique aqui</a>.'*/
    });
  }

  clickDownloads() {
    this.flagDownloads = !this.flagDownloads;
  }

  clickFinanceiro() {
    this.flagFinanceiro = !this.flagFinanceiro;
  }

  clickLoja() {
    this.flagLoja = !this.flagLoja;
  }

  clickKit() {
    this.flagKit = !this.flagKit;
  }

  clickVourchers() {
    this.flagVouchers = !this.flagVouchers;
  }

  oncloseSidebarMenu() {
    BroadcastEventService.event('sidebarMenu').emit(false);
  }
}
