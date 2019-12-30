import { HyperToastsService, ExcelService } from 'lib-services';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/components/common/menuitem';
import { SharedService } from '@app-admin-back-office/services/shared.service';
import { DataTable } from 'primeng/primeng';
// tslint:disable:no-unused-expression

@Component({
    selector: 'app-admin-back-office-info-connections-by-grid',
    templateUrl: './info-connections-by-grid.component.html',
    styleUrls: ['./info-connections-by-grid.component.less']
})
export class InfoConnectionsByGridComponent implements OnInit {

    public items: MenuItem[] = this._sharedService.items;
    public interval: Date[] = this._activatedRoute.snapshot.queryParams.interval;
    public infoGrids: any[] = [];
    public searchGrids: any[] = [];
    public query: String = '';

    constructor(
        private _sharedService: SharedService,
        private _hyperToastsService: HyperToastsService,
        private _activatedRoute: ActivatedRoute,
        private _router: Router,
        private _excelService: ExcelService
    ) {
        this.setBreadCrumb();
        this.getSummaryGrids();
    }

    ngOnInit() {
    }

    setBreadCrumb() {
        this.items.splice(1, this.items.length);
        this.items.push({
            label: 'Conexões Por Grade',
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

    getSummaryGrids() {
        const data = { startDate: new Date(this.interval[0]).toDateString(), endDate: new Date(this.interval[1]).toDateString() };
        this._sharedService.getSummaryGrids(data).subscribe(
            response => {
                if (response.return) {
                    this.searchGrids = this.infoGrids = response.data;
                    this.infoGrids.forEach(item => { item.grid_info = JSON.parse(item.grid_info); });
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

    searchGrid(query: string) {
        this.searchGrids = this.infoGrids;
        if (query.length) {
            this.searchGrids = this.infoGrids.filter((grid: any) =>
                grid.grid_info.manager.username.includes(query)
                || grid.grid_info.manager.name.includes(query)
                || grid.grid_info.director.username.includes(query)
                || grid.grid_info.director.name.includes(query)
            );
        }
    }

    exportExcel(dt: DataTable) {
        const data = dt.value.map(grid => ({ 'Célula': grid.grid_info.cell, 'Gerente': grid.grid_info.manager.username + '-' + grid.grid_info.manager.name, 'Diretor': grid.grid_info.director.username + '-' + grid.grid_info.director.name, 'Pré-cadastros': grid.pre_connections, 'Conexões': grid.connections }));
        this._excelService.exportAsExcelFile(data, null, 'Conexões Por Grade de' + new Date(this.interval[0]).toDateString() + 'até ' + new Date(this.interval[1]).toDateString());
    }

}
