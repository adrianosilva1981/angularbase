import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem } from 'primeng/components/common/menuitem';
import { HyperToastsService, ExcelService } from 'lib-services';
import { SharedService } from '@app-admin-youhubshop/services/shared.service';

@Component({
  selector: 'app-admin-youhubshop-details-suppliers',
  templateUrl: './details-suppliers.component.html',
  styleUrls: ['./details-suppliers.component.less']
})
export class DetailsSuppliersComponent implements OnInit {

  public items: MenuItem[] = this._sharedService.items;
  public interval: Date[] = this._activatedRoute.snapshot.queryParams.interval;
  public supplier: any;
  public orders: any[];
  public cols: { header: string, field: string }[] = [];
  public colsUser: { header: string, field: string }[] = [];
  public total: Number = 0;

  constructor(
    private _sharedService: SharedService,
    private _activatedRoute: ActivatedRoute,
    private _hyperToastsService: HyperToastsService,
    private _excelService: ExcelService,
    private _router: Router
  ) { }

  ngOnInit() {
    this.getInfoDetailsSuppliers();
  }

  getInfoDetailsSuppliers() {
    const data = { idSupplier: this._activatedRoute.snapshot.params.idSupplier, startDate: new Date(this.interval[0]).toISOString().split('T')[0], endDate: new Date(this.interval[1]).toISOString().split('T')[0] };
    this._sharedService.getInfoDetailsSuppliers(data).subscribe(
      response => {
        if (response.return) {
          this.supplier = response.data.supplier;
          this.orders = response.data.sales;
          this.orders.map(element => {
            element.userBuyer = JSON.parse(element.userBuyer);
          });
          Object.keys(this.orders[0].userBuyer[0]).forEach((col: string) => { this.setColsUser(col); });
          Object.keys(this.orders[0]).forEach((col: string) => { this.setCols(col); });
          this.setBreadCrumb();
        } else {
          this._hyperToastsService.addToast('warn', 'Atenção', response.msg);
        }
      },
      err => {
        this._hyperToastsService.addToast('warn', 'Atenção', err.msg);
        console.error(err);
      }
    );
  }

  setBreadCrumb() {
    if (!this._activatedRoute.snapshot.queryParams.interval) {
      this._hyperToastsService.clear();
      this._hyperToastsService.addToast('warn', 'Atenção', 'Escolha um período para ter as informações');
      this._router.navigate(['/']);
      return;
    }

    this.items.splice(2, this.items.length);
    this.items.push({
      label: this.supplier.name,
      routerLink: ['/' + this._activatedRoute.snapshot.url[0].path, this._activatedRoute.snapshot.url[1].path, this._activatedRoute.snapshot.url[2].path, this._activatedRoute.snapshot.url[3].path],
      queryParams: { interval: this._activatedRoute.snapshot.queryParams.interval || null },
    });
    try {
      if (this.items[1].label !== 'Fornecedores') {
        this._router.navigate(['/']);
        return;
      }
    } catch (TypeError) {
      this._router.navigate(['/']);
      return;
    }
  }

  setCols(col: string) {
    switch (col) {
      case 'id': this.cols.push({ field: col, header: 'Código' }); break;
      case 'title': this.cols.push({ field: col, header: 'Produto' }); break;
      case 'quantity': this.cols.push({ field: col, header: 'Disponivel' }); break;
      case 'quantitySales': this.cols.push({ field: col, header: 'Vendido' }); break;
      case 'valueTotal': this.cols.push({ field: col, header: 'Valor Total' }); break;
    }
  }

  setColsUser(col: string) {
    switch (col) {
      case 'id': this.colsUser.push({ field: col, header: 'Código' }); break;
      case 'name': this.colsUser.push({ field: col, header: 'Usuário' }); break;
      case 'main_value': this.colsUser.push({ field: col, header: 'Valor Bruto' }); break;
      case 'supply_value': this.colsUser.push({ field: col, header: 'Valor Recebido' }); break;
      case 'payment_method': this.colsUser.push({ field: col, header: 'Método Pagamento' }); break;
      case 'date_payment': this.colsUser.push({ field: col, header: 'Data Pagamento' }); break;
    }
  }
}
