import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BroadcastEventService } from 'lib-services';

@Component({
  selector: 'app-account-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {
  public objMenu = [
    {
      icon: 'photo_camera',
      title: 'Minha Foto',
      text: 'Alterar sua foto de perfil.',
      route: '/my-photo'
    },
    {
      icon: 'account_circle',
      title: 'Meus Dados',
      text: 'Alterar login, senha, nome ou celular.',
      route: '/personal-data'
    },
    {
      icon: 'room',
      title: 'Endereços',
      text: 'Alterar ou incluir seus endereços.',
      route: '/my-addresses'
    },
    {
      icon: 'credit_card',
      title: 'Formas de Pagamento',
      text: 'Alterar ou incluir novos cartões para pagamento.',
      route: '/my-credit-cards'
    }
  ];

  constructor(
    private _router: Router
  ) { }

  ngOnInit() {

    BroadcastEventService.event('onBreadCrumb').emit(
      [
        { 'text': 'Minha Conta', 'router': '/home' },
      ]
    );
  }

  onRedirect(location) {
    if (location.indexOf('assets') === -1) {
      this._router.navigate([location]);
    } else {
      window.location.href = location;
    }
  }

}
