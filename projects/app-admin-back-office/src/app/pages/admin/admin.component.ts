import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/components/common/menuitem';
import { SharedService } from '@app-admin-back-office/services/shared.service';
import { HyperToastsService } from 'lib-services';
import { Calendar } from 'primeng/primeng';
// tslint:disable:no-unused-expression

@Component({
    selector: 'app-admin-back-office-admin',
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.less']
})
export class AdminComponent implements OnInit {

    public items: MenuItem[] = this._sharedService.items = [];
    @ViewChild('interval') public interval: Calendar;
    public connections: Number = -2;
    public preRegistration: Number = -2;
    public monthly: Number = -2;
    public financing: Number = -2;
    public connectionsByGrid: Number = -2;
    public consumption_itens: Number = -2;
    public consumption_value: Number = -2;
    public consumption_point: Number = -2;
    public graduation: Number = -2;
    public rescue: Number = -2;
    public packs: Number = -2;
    public packs_used: Number = -2;
    public kits: Number = -2;

    constructor(
        private _sharedService: SharedService,
        private _activatedRoute: ActivatedRoute,
        private _hyperToastsService: HyperToastsService,
        private _router: Router
    ) {
        this.setBreadCrumb();
    }

    ngOnInit() {
        if (this._activatedRoute.snapshot.queryParams.interval) {
            this.interval.value = [new Date(this._activatedRoute.snapshot.queryParams.interval[0]), new Date(this._activatedRoute.snapshot.queryParams.interval[1])];
            setTimeout(() => { this.interval.updateInputfield(); }, 1);
        }
    }

    setBreadCrumb() {
        this.items.push({
            label: 'Adminstração',
            routerLink: ['/' + this._activatedRoute.snapshot.url[0].path],
            queryParams: { interval: this._activatedRoute.snapshot.queryParams.interval || null },
        });
        this._activatedRoute.snapshot.queryParams.interval && this.getInfo(this._activatedRoute.snapshot.queryParams.interval);
    }

    changeDate(interval: Date[]) {
        if (!interval[1]) { return; }
        const item: MenuItem = this.items.pop();
        item.queryParams = { interval: interval };
        this.items.push(item);
        this.getInfo(interval);
    }

    getInfo(intervalDate: Date[]) {
        const interval: Date[] = [new Date(intervalDate[0]), new Date(intervalDate[1])];
        this.getInfoConnections(interval);
        this.getInfoPreRegistration(interval);
        this.getInfoMonthly(interval);
        this.getInfoFinancing(interval);
        this.getInfoConnectionsByGrid(interval);
        this.getInfoConsumption(interval);
        this.getInfoGraduation(interval);
        this.getInfoRescue(interval);
        this.getInfoPaks(interval);
        this.getInfoKits(interval);
    }

    getInfoConnections(interval: Date[]) {
        this.connections = 0;
        const data = {
            option: 0,
            startDate: interval[0].toDateString(),
            endDate: interval[1].toDateString()
        };
        this._sharedService.getSummary(data).subscribe(
            response => {
                if (response.return) {
                    this.connections = response.data.connections || -1;
                } else {
                    this._hyperToastsService.addToast('warn', 'Atenção', response.msg);
                    console.warn(response);
                }
            },
            err => {
                this._hyperToastsService.addToast('error', 'Erro', err.msg);
                console.error(err);
            }
        );
    }

    getInfoPreRegistration(interval: Date[]) {
        this.preRegistration = 0;
        const data = {
            option: 1,
            startDate: interval[0].toDateString(),
            endDate: interval[1].toDateString()
        };
        this._sharedService.getSummary(data).subscribe(
            response => {
                if (response.return) {
                    this.preRegistration = response.data.pre_registration || -1;
                } else {
                    this._hyperToastsService.addToast('warn', 'Atenção', response.msg);
                    console.warn(response);
                }
            },
            err => {
                this._hyperToastsService.addToast('error', 'Erro', err.msg);
                console.error(err);
            }
        );
    }

    getInfoMonthly(interval: Date[]) {
        this.monthly = 0;
        const data = {
            option: 2,
            startDate: interval[0].toDateString(),
            endDate: interval[1].toDateString()
        };
        this._sharedService.getSummary(data).subscribe(
            response => {
                if (response.return) {
                    this.monthly = response.data.monthly || -1;
                } else {
                    this._hyperToastsService.addToast('warn', 'Atenção', response.msg);
                    console.warn(response);
                }
            },
            err => {
                this._hyperToastsService.addToast('error', 'Erro', err.msg);
                console.error(err);
            }
        );
    }

    getInfoFinancing(interval: Date[]) {
        this.financing = 0;
        const data = {
            option: 3,
            startDate: interval[0].toDateString(),
            endDate: interval[1].toDateString()
        };
        this._sharedService.getSummary(data).subscribe(
            response => {
                if (response.return) {
                    this.financing = response.data.financing || -1;
                } else {
                    this._hyperToastsService.addToast('warn', 'Atenção', response.msg);
                    console.warn(response);
                }
            },
            err => {
                this._hyperToastsService.addToast('error', 'Erro', err.msg);
                console.error(err);
            }
        );
    }

    getInfoConnectionsByGrid(interval: Date[]) {
        this.connectionsByGrid = 0;
        const data = {
            option: 4,
            startDate: interval[0].toDateString(),
            endDate: interval[1].toDateString()
        };
        this._sharedService.getSummary(data).subscribe(
            response => {
                if (response.return) {
                    this.connectionsByGrid = response.data.connections_by_grid || -1;
                } else {
                    this._hyperToastsService.addToast('warn', 'Atenção', response.msg);
                    console.warn(response);
                }
            },
            err => {
                this._hyperToastsService.addToast('error', 'Erro', err.msg);
                console.error(err);
            }
        );
    }

    getInfoConsumption(interval: Date[]) {
        this.consumption_itens = 0;
        this.consumption_value = 0;
        this.consumption_point = 0;
        const data = {
            option: 5,
            startDate: interval[0].toDateString(),
            endDate: interval[1].toDateString()
        };
        this._sharedService.getSummary(data).subscribe(
            response => {
                if (response.return) {
                    this.consumption_itens = response.data.consume || -1;
                    this.consumption_value = response.data.value || -1;
                    this.consumption_point = response.data.points || -1;
                } else {
                    this._hyperToastsService.addToast('warn', 'Atenção', response.msg);
                    console.warn(response);
                }
            },
            err => {
                this._hyperToastsService.addToast('error', 'Erro', err.msg);
                console.error(err);
            }
        );
    }

    getInfoGraduation(interval: Date[]) {
        this.graduation = 0;
        const data = {
            option: 6,
            startDate: interval[0].toDateString(),
            endDate: interval[1].toDateString()
        };
        this._sharedService.getSummary(data).subscribe(
            response => {
                if (response.return) {
                    this.graduation = response.data.graduation || -1;
                } else {
                    this._hyperToastsService.addToast('warn', 'Atenção', response.msg);
                    console.warn(response);
                }
            },
            err => {
                this._hyperToastsService.addToast('error', 'Erro', err.msg);
                console.error(err);
            }
        );
    }
    getInfoRescue(interval: Date[]) {
        this.rescue = 0;
        const data = {
            option: 7,
            startDate: interval[0].toDateString(),
            endDate: interval[1].toDateString()
        };
        this._sharedService.getSummary(data).subscribe(
            response => {
                if (response.return) {
                    this.rescue = response.data.rescue || -1;
                } else {
                    this._hyperToastsService.addToast('warn', 'Atenção', response.msg);
                    console.warn(response);
                }
            },
            err => {
                this._hyperToastsService.addToast('error', 'Erro', err.msg);
                console.error(err);
            }
        );
    }

    getInfoPaks(interval: Date[]) {
        this.packs = 0;
        this.packs_used = 0;
        const data = {
            option: 8,
            startDate: interval[0].toDateString(),
            endDate: interval[1].toDateString()
        };
        this._sharedService.getSummary(data).subscribe(
            response => {
                if (response.return) {
                    this.packs = response.data.packs || -1;
                    this.packs_used = response.data.used || -1;
                } else {
                    this._hyperToastsService.addToast('warn', 'Atenção', response.msg);
                    console.warn(response);
                }
            },
            err => {
                this._hyperToastsService.addToast('error', 'Erro', err.msg);
                console.error(err);
            }
        );
    }

    getInfoKits(interval: Date[]) {
        this.kits = 0;
        const data = {
            option: 9,
            startDate: interval[0].toDateString(),
            endDate: interval[1].toDateString()
        };
        this._sharedService.getSummary(data).subscribe(
            response => {
                if (response.return) {
                    this.kits = response.data.kits || -1;
                } else {
                    this._hyperToastsService.addToast('warn', 'Atenção', response.msg);
                    console.warn(response);
                }
            },
            err => {
                this._hyperToastsService.addToast('error', 'Erro', err.msg);
                console.error(err);
            }
        );
    }

    redirect(interval: Date[] = [], ...route: string[]) {
        if (!(interval[0] && interval[1])) {
            this._hyperToastsService.addToast('warn', 'Atenção', 'Escolha um período para ter as informações');
            return;
        }
        this._router.navigate(route, { queryParams: { interval: interval } });
    }

}
