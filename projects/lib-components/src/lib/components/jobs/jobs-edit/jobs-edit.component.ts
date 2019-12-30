import { Component, OnInit, Input } from '@angular/core';
import { SharedService } from '../../../services/shared.service';
import { HyperToastsService, BroadcastEventService } from 'lib-services';
import { Router } from '@angular/router';

@Component({
  selector: 'lib-components-jobs-edit',
  templateUrl: './jobs-edit.component.html',
  styleUrls: ['./jobs-edit.component.less']
})
export class JobsEditComponent implements OnInit {

  public hyperServices = [];
  show = true;
  public totalServices = 0;
  private idSupplier: any;
  constructor(
    private _sharedService: SharedService,
    private _hyperToastsService: HyperToastsService,
    private _router: Router
  ) { }

  ngOnInit() {
    this.getSupplierId();

    const obj = [
      { 'text': 'Dashboard', 'router': '/home' },
      { 'text': 'Seus Serviços', 'router': '' }
    ];

    BroadcastEventService.event('onBreadCrumb').emit(obj);

    BroadcastEventService.event('onDeleteProduct').subscribe(
      response => {
        if (response) {
          this.getService();
        }
      }
    );
  }

  getSupplierId() {
    this._sharedService.getSupplier().subscribe(
      response => {
        if (response.return) {
          this.idSupplier = response.data.id;
          this.getService();
        }
      },
      err => { this._hyperToastsService.addToast('error', 'Erro', err); }

    );
  }

  getService(page = 1) {
    const filter = {
      page: page,
      size: 15,
      idSupplier: this.idSupplier
    };
    this._sharedService.getServices(filter).subscribe(
      res => {
        if (res.data != '') {
          this.totalServices = res.totalProducts;
          this.hyperServices = [];
          this.hyperServices = this.hyperServices.concat(res.data);
          this._sharedService.saveProducts(this.hyperServices);
        } else {
          this.show = false;
        }
      }
    );
  }

  paginate(evt) {
    this.getService(evt.page + 1);
  }
}
