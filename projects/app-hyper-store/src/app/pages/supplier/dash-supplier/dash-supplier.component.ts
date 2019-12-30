import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from '@app-hyper-store/services/shared.service';

@Component({
  selector: 'app-hyper-store-dash-supplier',
  templateUrl: './dash-supplier.component.html',
  styleUrls: ['./dash-supplier.component.less']
})
export class DashSupplierComponent implements OnInit {

  public objMenu = [
    {
      icon: 'credit_card',
      title: 'Validar Cupom Smart',
      text: 'Valide os Cupons Smart por QrCode ou Código',
      route: '/supplier/voucher/valid'
    },
    {
      icon: 'business',
      title: 'Registar Estabelecimento',
      text: 'Registre seu estabelecimento para poder criar seus Cupons Smart',
      route: '/supplier/company'
    },
    {
      icon: 'note_add',
      title: 'Cadastrar Cupom Smart',
      text: 'Registre os seus Cupons Smart',
      route: '/supplier/voucher-register'
    },
    {
      icon: 'note',
      title: 'Meus Cupons Smart',
      text: 'Veja todos os seus Cupons Smart criados',
      route: '/supplier/voucher-list'
    },
    {
      icon: 'attach_money',
      title: 'Extrato do Estabelecimento',
      text: 'Veja pagamentos e compras de Cupons Smarts',
      route: '/supplier/extract'
    },
  ];

  constructor(
    private _router: Router,
    private _sharedService: SharedService
  ) { }

  ngOnInit() {
    this._sharedService.addBreadCrumb(
      [
        { 'text': 'Dashboard', 'router': '/supplier/dash' }
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
