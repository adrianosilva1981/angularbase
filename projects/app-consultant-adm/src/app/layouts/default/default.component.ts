import { Component, OnInit, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import { SharedService } from '@app-consultant-adm/services/shared.service';
import { Router } from '@angular/router';
import { BroadcastEventService, HyperToastsService } from 'lib-services';

@Component({
  selector: 'app-consultant-adm-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.less']
})
export class DefaultComponent implements OnInit, AfterViewChecked {
  private linkDownload = '';
  private objMenu: any = [];
  public dataMenu: any = [];
  public clientHeight: number;

  constructor(
    private _router: Router,
    private _sharedService: SharedService,
    private cdRef: ChangeDetectorRef,
    private _hyperToastsService: HyperToastsService
  ) {
    this.setOwnerStore();
    this.setObjMenu();
    this.listenerRouterChange();

    this.clientHeight = window.innerHeight;
  }

  ngOnInit() {
    this.init(this._router.url);
  }

  init(router) {
    const aux = this.objMenu.filter(y => router.includes(y.link));

    this.dataMenu = this.objMenu.filter(x => x.routerGroup === router);
    this.dataMenu = this.dataMenu.length === 0 && aux.length !== 0 ? this.objMenu.filter(x => x.routerGroup === aux[0].routerGroup) : this.dataMenu;
  }

  listenerRouterChange() {
    BroadcastEventService.event('routerChange').subscribe(evt => {
      this.init(evt.url);
    });
  }

  setOwnerStore() {
    const objUser: any = this._sharedService.getUserObject();
    this.linkDownload = 'https://api2.hyper.jobs/tools/htmlToPDF.php?url=https://dash.hyper.jobs/consultant/services/catalog-print/' + objUser.id;

    this._sharedService.getConsultants().subscribe(
      response => {
        if (response.return) {
          this._sharedService.setOwnerStore(response.data);
          BroadcastEventService.event('onShowHyperPrd').emit(response.data.showHyperPrd);
        }
      },
      err => { this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro inesperado. Atualize a página e tente novamente'); }
    );
  }

  setObjMenu() {
    this.objMenu = [
      {
        'icon': 'build',
        'name': 'Dados da Loja',
        'link': '/settings/data-shop',
        'routerGroup': '/settings/data-shop'
      },
      {
        'icon': 'desktop_mac',
        'name': 'Domínio',
        'link': '/settings/domain',
        'routerGroup': '/settings/data-shop'
      },
      {
        'icon': 'group',
        'name': 'Redes Sociais',
        'link': '/settings/social',
        'routerGroup': '/settings/data-shop'
      },
      {
        'icon': 'image',
        'name': 'Logo',
        'link': '/skin/logo',
        'routerGroup': '/skin/logo'
      },
      {
        'icon': 'format_color_fill',
        'name': 'Cores',
        'link': '/skin/colors',
        'routerGroup': '/skin/logo'
      },
      // {
      //   'icon': 'chrome_reader_mode',
      //   'name': 'Visualizar',
      //   'link': '/services/catalog',
      //   'routerGroup': '/services/catalog'
      // },
      {
        'icon': 'description',
        'name': 'Gerar PDF',
        'link': this.linkDownload,
        'routerGroup': '/services/catalog'
      },
      // {
      //   'icon': 'print',
      //   'name': 'Imprimir Capa',
      //   'link': 'https://store.youhub.com.br/supplier/login',
      //   'routerGroup': '/services/catalog'
      // },
      // {
      //   'icon': 'add_shopping_cart',
      //   'name': 'Pedidos da Loja',
      //   'link': '/requests-shop',
      //   'routerGroup': '/requests-shop'
      // },
      {
        'icon': 'assignment',
        'name': 'Meus Serviços',
        'link': '/edit-services',
        'routerGroup': '/edit-services'
      },
      {
        'icon': 'add',
        'name': 'Cadastrar SERVIÇO',
        'link': '/register-service',
        'routerGroup': '/edit-services'
      },
      {
        'icon': 'work',
        'name': 'Revender SERVIÇOS',
        'link': '/manager-service',
        'routerGroup': '/edit-services'
      },

      {
        'icon': 'storage',
        'name': 'Meus Produtos',
        'link': '/edit-products',
        'routerGroup': '/edit-products'
      },
      {
        'icon': 'add_shopping_cart',
        'name': 'Cadastrar PRODUTO',
        'link': '/register-product',
        'routerGroup': '/edit-products'
      },
      {
        'icon': 'local_offer',
        'name': 'Revender PRODUTOS',
        'link': '/manager-product',
        'routerGroup': '/edit-products'
      },
      {
        'icon': 'person_add',
        'name': 'Dados FORNECEDOR',
        'link': '/register-supplier',
        'routerGroup': '/supplier-sales'
      },
      {
        'icon': 'shopping_cart',
        'name': 'Pedidos',
        'link': '/supplier-sales',
        'routerGroup': '/supplier-sales'
      },
      {
        'icon': 'show_chart',
        'name': 'Extrato',
        'link': '/extract',
        'routerGroup': '/supplier-sales'
      },
      {
        'icon': 'storage',
        'name': 'ESTABELECIMENTO',
        'link': '/guide/edit-company',
        'routerGroup': '/guide/company'
      },
      // {
      //   'icon': 'add',
      //   'name': 'Cadastrar ESTABELECIMENTO',
      //   'link': '/guide/register-company',
      //   'routerGroup': '/guide/company'
      // },
      {
        'icon': 'storage',
        'name': 'Cupons Smart',
        'link': '/guide/edit-gift-card',
        'routerGroup': '/guide'
      },
      // {
      //   'icon': 'add',
      //   'name': 'Cadastrar Cupom Smart',
      //   'link': '/guide/register-gift-card',
      //   'routerGroup': '/guide'
      // },
      {
        'icon': 'add_shopping_cart',
        'name': 'Voucher Smart',
        'link': '/guide/buy-pack',
        'routerGroup': '/guide/company'
      },
      {
        'icon': 'computer',
        'name': 'Link ativar Voucher Smart',
        'link': 'https://store.youhub.com.br/supplier/login',
        'routerGroup': '/guide/company',
        'logout': true
      },
      {
        'icon': 'pageview',
        'name': 'Impressão (CPM)',
        'link': '/publish/config/page-view',
        'routerGroup': '/publish/config'
      },
      {
        'icon': 'email',
        'name': 'E-mail Marketing',
        'link': '/publish/config/email-marketing',
        'routerGroup': '/publish/config'
      },
      {
        'icon': 'share',
        'name': 'Compartilhamento',
        'link': '/publish/config/sharing',
        'routerGroup': '/publish/config'
      },
      {
        'icon': 'people',
        'name': 'Post Instagram Youhub',
        'link': '/publish/config/post-instagram',
        'routerGroup': '/publish/config'
      },
      {
        'icon': 'people',
        'name': 'Post Facebook Youhub',
        'link': '/publish/config/post-facebook',
        'routerGroup': '/publish/config'
      }
    ];
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }
}
