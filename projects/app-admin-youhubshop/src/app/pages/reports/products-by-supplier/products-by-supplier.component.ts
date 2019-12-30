import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { SharedService } from '@app-admin-youhubshop/services/shared.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-admin-youhubshop-products-by-supplier',
  templateUrl: './products-by-supplier.component.html',
  styleUrls: ['./products-by-supplier.component.less']
})
export class ProductsBySupplierComponent implements OnInit {

  public suppliers: any[] = [];
  public cols: { header: String; field: String }[] = [
    { header: 'Código', field: 'id_user' },
    { header: 'Responsável', field: 'name' },
    { header: 'CPF', field: 'CPF' },
    { header: 'Email', field: 'mail' }
  ];

  constructor(
    private _sharedService: SharedService,
    private _router: Router
  ) {
    this.setSuppliers();
  }

  ngOnInit() {
  }

  setSuppliers(): any {
    this.suppliers = [];
    this._sharedService.getSuppliers().subscribe(
      response => {
        if (response.return) {
          this.suppliers = response.data;
        } else {
          console.warn(response);
        }
      },
      err => {
        console.error(err);
      }
    );
  }

  selectSupplier(supplier: any) {
    this._router.navigate(['/reports/productsBySupplier', supplier.id_user]);
  }
}
