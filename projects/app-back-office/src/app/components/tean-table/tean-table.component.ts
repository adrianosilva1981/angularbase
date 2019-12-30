import { Component, OnInit } from '@angular/core';
import { HyperToastsService, ExcelService } from 'lib-services';
import { SharedService } from '@app-back-office/services/shared.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-back-office-tean-table',
  templateUrl: './tean-table.component.html',
  styleUrls: ['./tean-table.component.less']
})
export class TeanTableComponent implements OnInit {

  public objTable: any = {};

  constructor(
    private _sharedService: SharedService,
    private _hyperToastsService: HyperToastsService,
    private _excelService: ExcelService,
    private _router: Router,
  ) {

    // teste somente acessa se estiver ativo mensal
    // this._sharedService.checkreseller().subscribe(
    //   (response: any) => {
    //     if (response.return) {
    //       if (!response.data.status_active) {
    //         this._hyperToastsService.addToast('warn', 'Atenção', 'Para ter acesso a esta área faça sua ativação mensal!');
    //         this._router.navigate(['office/home']);
    //       }
    //     } else {
    //       this._hyperToastsService.addToast('warn', 'Atenção!', response.msg);
    //       this._router.navigate(['office/home']);
    //     }
    //   },
    //   err => {
    //     this._hyperToastsService.addToast('error', 'Erro!', err);
    //     this._router.navigate(['office/home']);
    //   }

    // );

  }

  ngOnInit() {
    this.loadChilds();
  }

  loadChilds() {
    this._sharedService.getListChilds().subscribe(
      (response: any) => {
        if (response.return === true) {
          this.objTable = response.data;
        } else {
          this._hyperToastsService.addToast('warn', 'Atenção!', response.msg);
        }
      },
      err => { this._hyperToastsService.addToast('error', 'Erro!', err); }
    );
  }

  exportToExcel() {
    this._sharedService.netReportExcel().subscribe(
      (response: any) => {
        if (response.return === true) {
          this._excelService.exportAsExcelFile(response.data, { skipHeader: true }, 'YouHub_Connections');
        } else {
          this._hyperToastsService.addToast('warn', 'Atenção!', response.msg);
        }
      },
      err => { this._hyperToastsService.addToast('error', 'Erro!', err); }
    );
  }

  points() {
    this._router.navigate(['office/infopoints']);
  }
}
