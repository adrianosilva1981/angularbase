import { DataTable } from 'primeng/primeng';
import { HyperToastsService, ExcelService } from 'lib-services';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/components/common/menuitem';
import { SharedService } from '@app-admin-back-office/services/shared.service';
// tslint:disable:no-unused-expression

@Component({
    selector: 'app-admin-back-office-info-pre-registration',
    templateUrl: './info-pre-registration.component.html',
    styleUrls: ['./info-pre-registration.component.less']
})
export class InfoPreRegistrationComponent implements OnInit {

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
        this.getSummaryPreRegistration();
    }

    ngOnInit() {
    }

    setBreadCrumb() {
        this.items.splice(1, this.items.length);
        this.items.push({
            label: this.title,
            routerLink: ['/' + this._activatedRoute.snapshot.url[0].path, this._activatedRoute.snapshot.url[1].path],
            queryParams: { interval: this._activatedRoute.snapshot.queryParams.interval || null },
        });
        try {
            if (this.items[0].label !== 'Adminstração') {
                this._router.navigate(['/admin']);
                return;
            }
        } catch (TypeError) {
            this._router.navigate(['/admin']);
            return;
        }
    }

    exportExcel(dt: DataTable) {
        this._excelService.exportAsExcelFile(dt.filteredValue || dt.value, null, 'Pré-cadastros');
    }

    getSummaryPreRegistration() {
        const data = { startDate: new Date(this.interval[0]).toDateString(), endDate: new Date(this.interval[1]).toDateString() };
        this._sharedService.getSummaryPreRegistration(data).subscribe(
            response => {
                if (response.return) {
                    this.associates = response.data;
                    Object.keys(this.associates[0]).forEach((col: string) => { this.setCols(col); });
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
        }
    }

}