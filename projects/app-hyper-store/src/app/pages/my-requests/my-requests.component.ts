import { Component, OnInit } from '@angular/core';
import { HyperToastsService } from 'lib-services';
import { SharedService } from '@app-hyper-store/services/shared.service';

@Component({
  selector: 'app-hyper-store-my-requests',
  templateUrl: './my-requests.component.html',
  styleUrls: ['./my-requests.component.less']
})
export class MyRequestsComponent implements OnInit {

  public listOrders: any;
  public filterSearch = '';
  public listOrderReadyOnly: any;

  constructor(
    private _sharedService: SharedService,
    private _hyperToastsService: HyperToastsService
  ) {
    this.listOrders = [];
  }

  ngOnInit() {
    this.getOrders();
    this._sharedService.addBreadCrumb(
      [
        { 'text': 'Minha Conta', 'router': '/my-account' },
        { 'text': 'Meus Pedidos', 'router': '' }
      ]
    );
  }

  getOrders() {
    this._sharedService.getOrders().subscribe(
      (response: any) => {
        this.listOrders = response.data;
        this.listOrderReadyOnly = response.data;
      },
      err => { this._hyperToastsService.addToast('error', 'Error', err); }
    );
  }

  filterChanged(evt) {
    this.listOrders = this.listOrderReadyOnly.filter(x => x.id.includes(evt));
  }
}
