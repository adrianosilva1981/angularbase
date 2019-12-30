import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-admin-youhubshop-navbar',
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
            label: 'Performance',
            icon: 'fas fa-chart-line',
            routerLink: ['/reports/performance'],
            command: (event?: any) => {
              this.display = false;
            },
          },
          {
            label: 'Produtos por Fornecedor',
            routerLink: ['/reports/productsBySupplier'],
            icon: 'fas fa-boxes',
            command: (event?: any) => {
              this.display = false;
            }
          },
          {
            label: 'Produtos',
            routerLink: ['/reports/products'],
            icon: 'fas fa-boxes',
            command: (event?: any) => {
              this.display = false;
            }
          },
          {
            label: 'Usuários',
            icon: 'fas fa-user',
            routerLink: ['/reports/users'],
            command: (event?: any) => {
              this.display = false;
            },
          },
        ]
      },

      {
        label: 'Financeiro',
        expanded: false,
        items: [
          {
            label: 'Pg Fornecedores',
            icon: 'fas fa-money-bill',
            routerLink: ['/financial/payments'],
            command: (event?: any) => {
              this.display = false;
            },
          },
          {
            label: 'Comissões',
            icon: 'fas fa-money-bill',
            routerLink: ['/financial/commissions'],
            command: (event?: any) => {
              this.display = false;
            },
          },
          {
            label: 'Pg Realizado Fornecedores',
            icon: 'fas fa-hand-holding-usd',
            routerLink: ['/financial/report-payments'],
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
