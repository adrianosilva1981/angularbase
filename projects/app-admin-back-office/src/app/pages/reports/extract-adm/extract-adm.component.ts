import { DataTable } from 'primeng/primeng';
import { SelectItem } from 'primeng/api';
import { HyperToastsService } from '../../../../../../lib-services/src/lib/services/hyper-toasts.service';
import { SharedService } from '@app-admin-back-office/services/shared.service';
import { Component, OnInit, ɵConsole } from '@angular/core';
import { ExcelService } from 'lib-services';
import { ItemsControl } from '@ngu/carousel/src/ngu-carousel/ngu-carousel.interface';

@Component({
  selector: 'app-admin-back-office-extract-adm',
  templateUrl: './extract-adm.component.html',
  styleUrls: ['./extract-adm.component.less']
})
export class ExtractAdmComponent implements OnInit {
  public total: Number = 0;
  public extract: any[] = [];
  public title="Extrato Administrativo";
  public cols: any[] = [
    { field: 'auth_name', header: 'Autorizador' },
    { field: 'reseller_username', header: 'Código' },
    { field: 'reseller_name', header: 'Nome' },
    { field: 'value', header: 'Valor'},
    { field: 'type', header: 'Tipo' }

  ];
  public items: SelectItem[] = [
    { label: 'Todos', value: null },
    { label: 'Crédito', value: 'credit' },
    { label: 'Debito', value: 'debit' }
  ];
  
 


  constructor(
    private _sharedService: SharedService,
    private _hyperToastsService: HyperToastsService,
    private _excelService: ExcelService
  ) {
    this.getExtractInfoAdm();

  }

  ngOnInit() {
  }


  getExtractInfoAdm() {
    this.total = 0;
    this._sharedService.getExtractInfoAdm().subscribe(
      response => {
        if (response.return) {
          this.extract = response.data;
        }
        this.extract.forEach(row => {
          row.value = parseFloat(row.value);
          this.total += row.value;
        });
      }
    );
  }

  getTotal(type, dt: DataTable) {
    setTimeout(() => {
      this.total = (dt.filteredValue || dt.value)
        .map(item => item.value)
        .reduceRight((sum, value) => sum + value);
    }, dt.filterDelay);
  }

  exportExcel(dt: DataTable) {
    this._excelService.exportAsExcelFile(dt.filteredValue || dt.value, null, this.title);
}
  
}


