import { Component, OnInit } from '@angular/core';
import { HyperToastsService } from 'lib-services';
import { environment } from '@env/app-consultant-adm';
import { SharedService } from '@app-consultant-adm/services/shared.service';
import { Router } from '@angular/router';
// tslint:disable:no-unused-expression

@Component({
    selector: 'app-consultant-adm-logo',
    templateUrl: './logo.component.html',
    styleUrls: ['./logo.component.less']
})
export class LogoComponent implements OnInit {
    public imageWidthDesktop = 850;
    public imageHeightDesktop = 100;
    public imageWidthMobile = 450;
    public imageHeightMobile = 200;

    public imgsDesktop = 'assets/img/image_default.png';
    public imgsMobile = 'assets/img/image_default.png';
    public imageUpload: any;
    private idShop: any;
    public urlRequest = '';
    public bearerToken = '';
    public pathBucket = '';
    public buttonTextUpload = '<i class="fas fa-plus"></i><span> Selecionar Logo</span>';

    constructor(
        private _router: Router,
        private _hyperToastsService: HyperToastsService,
        private _sharedService: SharedService,
    ) { }

    ngOnInit() {
        this.urlRequest = environment.apiPhpV2 + 'tools/upload';
        this.pathBucket = 'logo';

        this._sharedService.addBreadCrumb([
            { 'text': 'Dashboard', 'router': '/home' },
            { 'text': 'Aparência', 'router': '/skin/logo' },
            { 'text': 'Logo', 'router': '' }
        ]);

        this.getConsultants();
    }

    getConsultants() {
        this._sharedService.getConsultants().subscribe(
            response => {
                if (response.return) {
                    response.data.skin.nav.logo && (this.imgsDesktop = response.data.skin.nav.logo);
                    response.data.skin.nav.logoMobile && (this.imgsMobile = response.data.skin.nav.logoMobile);
                    this.idShop = response.data.idShop;
                } else {
                    this._hyperToastsService.addToast('warn', 'Atenção', 'Preencha os dados da loja para poder mudar a aparência');
                    this._router.navigate(['/settings/data-shop']);
                }
            },
            err => { this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro inesperado. Atualize a página e tente novamente'); }
        );
    }

    onUpload(imgDesktop, imgMobile) {
        imgDesktop && (this.imgsDesktop = '//' + imgDesktop);
        imgMobile && (this.imgsMobile = '//' + imgMobile);
        const skinForm = {
            skin: {
                nav: {
                    logo: this.imgsDesktop,
                    logoMobile: this.imgsMobile
                }
            }
        };
        this._sharedService.putLogo(this.idShop, skinForm).subscribe(
            response => {
                if (response.return) {
                    this._hyperToastsService.addToast('success', 'Sucesso', response.msg);
                } else {
                    this._hyperToastsService.addToast('warn', 'Atenção', response.msg);
                }
            },
            err => { this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro inesperado. Atualize a página e tente novamente'); }
        );
    }
}


