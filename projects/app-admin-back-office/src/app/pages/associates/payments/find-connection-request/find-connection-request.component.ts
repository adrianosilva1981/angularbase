import { Component, OnInit } from '@angular/core';
import { SharedService } from '@app-admin-back-office/services/shared.service';
import { HyperToastsService } from 'lib-services';
import { Router } from '@angular/router';

@Component({
    selector: 'app-admin-back-office-find-connection-request',
    templateUrl: './find-connection-request.component.html',
    styleUrls: ['./find-connection-request.component.less']
})
export class FindConnectionRequestComponent implements OnInit {

    public associates: any[] = [];
    public cols: any[] = [];

    constructor(
        private _sharedService: SharedService,
        private _hyperToastsService: HyperToastsService,
        private _router: Router,
    ) {

    }

    ngOnInit() { }

    setAssociates(query: string = null) {
        this._sharedService.getConnectionRequestAssociates(query).subscribe(
            response => {
                if (response.return) {
                    this.cols = [];
                    this.associates = [];
                    this.associates = response.data;
                    Object.keys(this.associates[0]).forEach((col: string) => { this.setCols(col); });
                } else {
                    this._hyperToastsService.addToast('warn', 'Atenção', response.msg);
                }
            },
            err => {
                this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro inesperado. Atualize a página e tente novamente');
                this._router.navigate(['/login']);
            }
        );
    }

    setCols(col: string) {
        switch (col) {
            case 'username': this.cols.push({ field: col, header: 'Código', }); break;
            case 'name': this.cols.push({ field: col, header: 'Nome', }); break;
            case 'email': this.cols.push({ field: col, header: 'Email', }); break;
            case 'cellphone': this.cols.push({ field: col, header: 'Celular', }); break;
            case 'cpf_cnpj': this.cols.push({ field: col, header: 'CPF/CNPJ', }); break;
        }
    }

    connectionRequest(username: string) {
        this._router.navigate(['/associates/payments/connections/' + username]);
    }
}
