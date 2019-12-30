import { Component, OnInit, Injectable } from '@angular/core';
import { SharedService } from '../../../services/shared.service';
import { HyperToastsService } from 'lib-services';
import { Router } from '@angular/router';
import { BroadcastEventService } from 'lib-services';
@Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'lib-components-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.less']
})
export class EditProductComponent implements OnInit {
  public hyperProducts = [];
  show = true;
  public totalProducts = 0;
  private idSupplier: any;
  constructor(
    private _sharedService: SharedService,
    private _hyperToastsService: HyperToastsService
  ) { }

  ngOnInit() {
    const obj = [
      { 'text': 'Dashboard', 'router': '/home' },
      { 'text': 'Meus Produtos', 'router': '' }
    ];

    BroadcastEventService.event('onBreadCrumb').emit(obj);

    this.getSupplierId();
  }

  getSupplierId() {
    this._sharedService.getSupplier().subscribe(
      response => {
        if (response.return) {
          this.idSupplier = response.data.id;
          this.getProduct();
        }
      },
      err => { this._hyperToastsService.addToast('error', 'Erro', err); }

    );
  }

  getProduct(page = 1) {
    const filter = {
      page: page,
      size: 15,
      idSupplier: this.idSupplier
    };
    this._sharedService.getProducts(filter).subscribe(
      res => {
        if (res.data != '') {
          this.totalProducts = res.totalProducts;
          this.hyperProducts = [];
          this.hyperProducts = this.hyperProducts.concat(res.data);
          this._sharedService.saveProducts(this.hyperProducts);
        } else {
          this.show = false;
        }
      }
    );
  }

  paginate(evt) {
    this.getProduct(evt.page + 1);
  }


}

