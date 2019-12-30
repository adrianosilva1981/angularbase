import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DataTable } from 'primeng/primeng';
import { HyperToastsService, ExcelService } from 'lib-services';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/components/common/menuitem';
import { SharedService } from '@app-admin-back-office/services/shared.service';
// tslint:disable:no-unused-expression


@Component({
    selector: 'app-admin-back-office-details-info-monthly',
    templateUrl: './details-info-monthly.component.html',
    styleUrls: ['./details-info-monthly.component.less']
})
export class DetailsInfoMonthlyComponent implements OnInit {

    public items: MenuItem[] = this._sharedService.items;
    public interval: Date[] = this._activatedRoute.snapshot.queryParams.interval;
    public title: string = this._activatedRoute.snapshot.data.title;
    public associates: any[] = [];
    public cols: any[] = [];
    

    constructor(
        private _sharedService: SharedService,
        private _hyperToastsService: HyperToastsService,
        private _activatedRoute: ActivatedRoute,
        private _router: Router,
        private _excelService: ExcelService
    ) {
        this.setBreadCrumb();
        this.getSummaryDetailsMonthly();
    }

    ngOnInit() {
    }

    setBreadCrumb() {
        if (!this._activatedRoute.snapshot.queryParams.interval) {
            this._hyperToastsService.clear();
            this._hyperToastsService.addToast('warn', 'Atenção', 'Escolha um período para ter as informações');
            this._router.navigate(['/admin']);
            return;
        }
        this.items.splice(2, this.items.length);
        this.items.push({
            label: this.title,
            routerLink: ['/' + this._activatedRoute.snapshot.url[0].path, this._activatedRoute.snapshot.url[1].path, this._activatedRoute.snapshot.url[2].path],
            queryParams: { interval: this._activatedRoute.snapshot.queryParams.interval || null, paymentMethod: this._activatedRoute.snapshot.queryParams.paymentMethod || null },
        });
        try {
            if (this.items[1].label !== 'Mensalidade') {
                this._router.navigate(['/admin']);
                return;
            }
        } catch (TypeError) {
            this._router.navigate(['/admin']);
            return;
        }
    }

    exportExcel(dt: DataTable) {
        this._excelService.exportAsExcelFile(dt.filteredValue || dt.value, null, this.title);
    }

    getSummaryDetailsMonthly() {
        const data = { option: this._activatedRoute.snapshot.url[2].path, startDate: new Date(this.interval[0]).toDateString(), endDate: new Date(this.interval[1]).toDateString() };
        this._sharedService.getSummaryDetailsMonthly(data).subscribe(
            response => {
                if (response.return) {
                    this.associates = response.data;
                    Object.keys(this.associates[0]).forEach((col: string) => this.setCols(col));
                } else {
                    this._hyperToastsService.addToast('warn', 'Atenção', response.msg);
                    console.warn(response);
                }
            },
            err => {
                this._hyperToastsService.addToast('warn', 'Atenção', err.msg);
                console.error(err);
            }
        );

    }

    setCols(col: string) {
        switch (col) {
            case 'username': this.cols.push({ field: col, header: 'Código' }); break;
            case 'name': this.cols.push({ field: col, header: 'Nome' }); break;
            case 'email': this.cols.push({ field: col, header: 'Email' }); break;
            case 'reference_month': this.cols.push({ field: col, header: 'Pagamento Do Mês' }); break;
        }
    }

    
}