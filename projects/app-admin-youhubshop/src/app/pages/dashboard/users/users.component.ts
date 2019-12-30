import { Component, OnInit, ViewChild } from '@angular/core';
import { SharedService } from '@app-admin-youhubshop/services/shared.service';
import { MenuItem } from 'primeng/components/common/menuitem';
import { ActivatedRoute, Router } from '@angular/router';
import { HyperToastsService } from 'lib-services';
import { Calendar } from 'primeng/primeng';

@Component({
    selector: 'app-admin-youhubshop-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.less']
})
export class UsersComponent implements OnInit {

    public items: MenuItem[] = this._sharedService.items;
    public users: any[] = [];
    public interval: Date[] = this._activatedRoute.snapshot.queryParams.interval;
    public cols: { header: string, field: string }[] = [
        { header: 'Código', field: 'id' },
        { header: 'Nome', field: 'name' },
        { header: 'Email', field: 'email' },
        { header: 'CPF', field: 'cpf' }
    ];
    public type: { label: string, value: string }[] = [
        { label: 'Escolha...', value: null },
        { label: 'Normal', value: 'NORMAL' },
        { label: 'Prime', value: 'PRIME' },
        { label: 'Associado', value: 'ASSOCIATE' }
    ];

    constructor(
        private _sharedService: SharedService,
        private _activatedRoute: ActivatedRoute,
        private _router: Router,
        private _hyperToastsService: HyperToastsService
    ) {
        this.setBreadCrumb();
        this.getInfoUsers();
    }

    ngOnInit() { }

    setBreadCrumb() {
        this.items.splice(1, this.items.length);
        this.items.push({
            label: 'Usuários',
            routerLink: ['/' + this._activatedRoute.snapshot.url[0].path, this._activatedRoute.snapshot.url[1].path],
            queryParams: { interval: this._activatedRoute.snapshot.queryParams.interval || null }
        });
        try {
            if (this.items[0].label !== 'Dashboard') {
                this._router.navigate(['/']);
                return;
            }
        } catch (TypeError) {
            this._router.navigate(['/']);
            return;
        }
    }

    getInfoUsers() {
        this._sharedService.getInfoUsers().subscribe(
            response => {
                if (response.return) {
                    this.users = response.data;
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

    redirect(...routes: String[]) {
        this._router.navigate(['/dash', ...routes]);
    }

}
