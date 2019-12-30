import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-admin-back-office-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.less']
})
export class NavbarComponent implements OnInit {

  items: MenuItem[];
  display = false;

  constructor(
    private _router: Router
  ) {

    this.items = [
      {
        label: 'Dashboard',
        icon: 'fas fa-handshake',
        routerLink: ['/dash'],
        command: (event?: any) => {
          this.display = false;
        },
      },
      {
        label: 'Adminstração',
        icon: 'fas fa-unlock-alt',
        routerLink: ['/admin'],
        command: (event?: any) => {
          this.display = false;
        },
      },
      {
        label: 'Layout',
        expanded: false,
        items: [
          {
            label: 'Imagens BackOffice',
            routerLink: ['/layout/image-backoffice'],
            icon: 'fas fa-images',
            command: (event?: any) => {
              this.display = false;
            },
          },
          {
            label: 'Upload Imagem',
            routerLink: ['/layout/upload-image'],
            icon: 'fas fa-image',
            command: (event?: any) => {
              this.display = false;
            },
          },
        ]
      },
      {
        label: 'Lista Gerencial',
        expanded: false,
        items: [
          {
            label: 'Células',
            expanded: false,
            items: [
              {
                label: 'Cadastrar',
                routerLink: ['/cells/add'],
                icon: 'fas fa-plus',
                command: (event?: any) => {
                  this.display = false;
                }
              },
              {
                label: 'Editar',
                routerLink: ['/cells/edit'],
                icon: 'fas fa-edit',
                command: (event?: any) => {
                  this.display = false;
                }
              }
            ]
          },
          {
            label: 'Grades',
            expanded: false,
            items: [
              {
                label: 'Cadastrar Manager',
                routerLink: ['/cells/grids/add'],
                icon: 'fas fa-plus',
                command: (event?: any) => {
                  this.display = false;
                }
              },
              {
                label: 'Editar Managers',
                routerLink: ['/cells/grids/edit'],
                icon: 'fas fa-edit',
                command: (event?: any) => {
                  this.display = false;
                }
              },
              {
                label: 'Configurar Managers',
                routerLink: ['/cells/grids/config'],
                icon: 'fas fa-cog',
                command: (event?: any) => {
                  this.display = false;
                }
              }
            ]
          }
        ]
      },
      {
        label: 'Relatórios',
        expanded: false,
        items: [
          {
            label: 'Vendas',
            routerLink: ['/reports/pack-sold'],
            icon: 'fas fa-exchange-alt',
            command: (event?: any) => {
              this.display = false;
            },
          },
          {
            label: 'Saques',
            icon: 'fas fa-dollar-sign',
            routerLink: ['/reports/discharge'],
            command: (event?: any) => {
              this.display = false;
            },
          },
          {
            label: 'Bonificações',
            icon: 'fas fa-chart-line',
            routerLink: ['/reports/bonifications'],
            command: (event?: any) => {
              this.display = false;
            },
          },
          {
            label: 'Batimento Financeiro',
            icon: 'fa fa-money',
            routerLink: ['/reports/financial-closing'],
            command: (event?: any) => {
              this.display = false;
            },
          },
          {
            label: 'Qualificações',
            icon: 'fas fa-trophy',
            routerLink: ['/reports/qualification'],
            command: (event?: any) => {
              this.display = false;
            },
          },
          {
            label: 'Faturamento de comissões',
            icon: 'fas fa-percentage',
            routerLink: ['/reports/percentage'],
            command: (event?: any) => {
              this.display = false;
            },
          },
          {
            label: 'Top 10 Saques',
            icon: 'fas fa-user',
            routerLink: ['/reports/top-ten'],
            command: (event?: any) => {
              this.display = false;
            },
          },
          {
            label: 'Top 10 Recebidos',
            icon: 'fas fa-user',
            routerLink: ['/reports/top-ten-received'],
            command: (event?: any) => {
              this.display = false;
            },
          },
          {
            label: 'Indicados dos Associados',
            icon: 'fas fa-link',
            routerLink: ['/reports/info-indicated'],
            command: (event?: any) => {
              this.display = false;
            },
          },
          {
            label: 'Monitoramento',
            icon: 'fas fa-chart-pie',
            command: (event?: any) => {
              window.open('http://monitoramento.youhub.com.br', '_blank');
              this.display = false;
            },
          },
          {
            label: 'Cartão Pré-pago',
            icon: 'far fa-credit-card',
            routerLink: ['/reports/prepaid-card'],
            command: (event?: any) => {
              this.display = false;
            },
          },
          {
            label: 'Extrato Admin',
            icon: 'fas fa-dollar-sign',
            routerLink: ['/reports/extract'],
            command: (event?: any) => {
              this.display = false;
            },
          },
        ]
      },
      {
        label: 'Associados',
        expanded: false,
        items: [
          {
            label: 'Alteração',
            icon: 'fas fa-user-edit',
            routerLink: ['/associates/associate-edit'],
            command: (event?: any) => {
              this.display = false;
            },
          },
          {
            label: 'Pagamentos',
            expanded: false,
            items: [
              {
                label: 'Financiamento',
                expanded: false,
                items: [
                  {
                    label: 'Conexão',
                    icon: 'fas fa-user-plus',
                    routerLink: ['/associates/payments/financing/connections'],
                    command: (event?: any) => {
                      this.display = false;
                    },
                  },
                  {
                    label: 'Parcelas',
                    icon: 'fas fa-user-plus',
                    routerLink: ['/associates/payments/financing/plots'],
                    command: (event?: any) => {
                      this.display = false;
                    },
                  },
                ]
              },
              {
                label: 'Solicitação Financiamento',
                icon: 'fas fa-calculator',
                routerLink: ['/associates/payments/financing-request'],
                command: (event?: any) => {
                  this.display = false;
                },
              },
              {
                label: 'Solicitação de Pagamento',
                icon: 'fas fa-user-plus',
                routerLink: ['/associates/payments/payment-request'],
                command: (event?: any) => {
                  this.display = false;
                },
              },
              {
                label: 'Conexões',
                icon: 'fas fa-user-plus',
                routerLink: ['/associates/payments/connections'],
                command: (event?: any) => {
                  this.display = false;
                },
              },
              {
                label: 'Mensalidade',
                icon: 'fas fa-user-plus',
                routerLink: ['/associates/payments/monthly'],
                command: (event?: any) => {
                  this.display = false;
                },
              },
            ]
          },
          {
            label: 'Lista por Estado',
            icon: 'fas fa-globe-americas',
            routerLink: ['/associates/state'],
            command: (event?: any) => {
              this.display = false;
            },
          },
          {
            label: 'Validação',
            icon: 'fas fa-lock-open',
            routerLink: ['/associates/validation'],
            command: (event?: any) => {
              this.display = false;
            },
          },
          {
            label: 'Pendentes de aprovação',
            icon: 'fas fa-user-clock',
            routerLink: ['/associates/pending-approval'],
            command: (event?: any) => {
              this.display = false;
            }
          },
          {
            label: 'Ativos com pagamento manual',
            icon: 'fas fa-hand-holding-usd',
            routerLink: ['/associates/manual-payment'],
            command: (event?: any) => {
              this.display = false;
            }
          },
          {
            label: 'Solicitação de Saque',
            icon: 'fas fa-dollar-sign',
            routerLink: ['/associates/request-discharge'],
            command: (event?: any) => {
              this.display = false;
            }
          },
          {
            label: 'Crédito',
            icon: 'far fa-credit-card',
            routerLink: ['/associates/credit'],
            command: (event?: any) => {
              this.display = false;
            }
          },
          {
            label: 'Saldo',
            icon: 'fas fa-chart-line',
            routerLink: ['/associates/balance'],
            command: (event?: any) => {
              this.display = false;
            }
          },
          {
            label: 'Débito',
            icon: 'fas fa-credit-card',
            routerLink: ['/associates/debit'],
            command: (event?: any) => {
              this.display = false;
            }
          },
          // {
          //   label: 'Aprovação de Financiamento',
          //   icon: 'fas fa-thumbs-up',
          //   routerLink: ['/associates/financing'],
          //   command: (event?: any) => {
          //     this.display = false;
          //   }
          // },
          {
            label: 'Pacote',
            expanded: false,
            items: [
              {
                label: 'Aprovação',
                icon: 'fas fa-cubes',
                expanded: false,
                routerLink: ['/associates/pack/approval'],
                command: (event?: any) => {
                  this.display = false;
                }
              },
              {
                label: 'Solicitação',
                icon: 'fas fa-cubes',
                expanded: false,
                routerLink: ['/associates/pack/request'],
                command: (event?: any) => {
                  this.display = false;
                }
              },
            ]
          },
        ]
      },
      {
        label: 'Perfil',
        expanded: false,
        items: [
          {
            label: 'Alterar Senha',
            routerLink: ['/profile/change-password'],
            icon: 'fas fa-key',
            command: (event?: any) => {
              this.display = false;
            },
          },
        ]
      },


    ];
  }

  ngOnInit() {

  }

}
