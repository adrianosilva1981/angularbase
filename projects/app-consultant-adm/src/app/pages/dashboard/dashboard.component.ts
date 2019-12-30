import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-consultant-adm-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.less']
})
export class DashboardComponent implements OnInit {
  public objMenu = [
    {
      icon: 'settings',
      title: 'Configurações',
      text: 'Configure ou altere os dados da loja, domínio e suas redes sociais',
      route: '/settings/data-shop'
    },
    {
      icon: 'palette',
      title: 'Aparência',
      text: 'Troque sua logo e as cores de sua loja',
      route: '/skin/logo'
    },
    {
      icon: 'info',
      title: 'Informações',
      text: 'Acompanhe os pedidos e seu extrato assim como suas informações como fornecedor',
      route: '/supplier-sales'
    },

    {
      icon: 'work',
      title: 'Produtos',
      text: 'Cadastre seus produtos <br> e/ou revenda produtos',
      route: '/edit-products'
    },
    {
      icon: 'assignment',
      title: 'Serviços',
      text: 'Cadastre seus serviços <br> e/ou revenda serviços',
      route: '/edit-services'
    },
    {
      icon: 'library_books',
      title: 'Catálogo',
      text: 'Visualize online seu catalogo ou gere um PDF para imprimir',
      route: '/services/catalog'
    },
    {
      icon: 'trending_up',
      title: 'Treinamento',
      text: 'Guia prático para você que pretende iniciar a carreira no mundo das vendas',
      route: 'assets/pdf/consultor-treinamento.pdf'
    },
    {
      icon: 'person_add',
      title: 'Guia Smart',
      text: 'Gerencie estabelecimentos',
      route: '/guide/edit-company'
    },
    {
      icon: 'person_add',
      title: 'Cupom Smart',
      text: 'Gerencie Cupons Smart',
      route: '/guide/edit-gift-card'
    },
    {
      icon: 'public',
      title: 'Publicidade',
      text: 'Configure suas publicidades',
      route: '/publish'
    }
  ];
  public msgs = [];
  constructor(
    private _router: Router
  ) { }

  ngOnInit() {
    this.msgs.push({
      severity: 'warn', summary: 'Prezado fornecedor, ', detail: '<br> Nosso Banco Digital continua suas atualizações e a data do Lançamento Oficial da Nova Plataforma HubBank ainda não foi divulgada e será em fevereiro. Em breve sairá a divulgação oficial da empresa. <br>      Durante este período, os pagamentos dos Fornecedores serão realizados através do BackOffice. <br>      -Os Fornecedores que se encontram com débito em qualquer Mês, atual ou passado, creditaremos o que tem a receber em seu BackOffice da YouHub, debitando as mensalidades pendentes, desta forma, estarão regularizando suas pendências, ficando em dia com as mensalidades.  <br>      Em caso de dúvidas, entre em contato com nosso suporte:<br>      Chat que fica no canto inferior direito de sua tela.<br>            Agradecemos sua compreensão.<br>      Atenciosamente,<br>      <b>Equipe YouHub</b>.'
    });

  }
  onRedirect(location) {
    if (location.indexOf('assets') === -1) {
      this._router.navigate([location]);
    } else {
      window.location.href = location;
    }
  }
}
