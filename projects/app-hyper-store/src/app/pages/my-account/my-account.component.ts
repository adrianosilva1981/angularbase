import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from '@app-hyper-store/services/shared.service';

@Component({
  selector: 'app-hyper-store-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.less']
})
export class MyAccountComponent implements OnInit {

  public objMenu: any = [];

  constructor(
    private _router: Router,
    private _sharedService: SharedService
  ) {
  }

  ngOnInit() {
    this._sharedService.addBreadCrumb(
      [
        { 'text': 'Minha Conta', 'router': '' }
      ]
    );
    this.mountMenu();
  }

  mountMenu() {
    this.objMenu = [
      {
        icon: 'fa-cubes',
        title: 'Meus Pedidos',
        text: 'Rastrear, devolver ou comprar novamente',
        route: 'my-requests'
      },
      {
        icon: 'fa-heart',
        title: 'Favoritos',
        text: 'Compre o que está na sua lista de desejo',
        route: 'favorites'
      }
    ];
  }

  onRedirect(location) {
    if (location.indexOf('http') === -1) {
      this._router.navigate(['/' + location]);
    } else {
      window.location.href = location;
    }
  }

}
