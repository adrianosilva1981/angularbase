import { Component, OnInit, Input } from '@angular/core';
import { SharedService } from '../../../services/shared.service';
import { HyperToastsService } from 'lib-services';
import { environment } from '@env/app-consultant-adm';

@Component({
  selector: 'app-consultant-adm-supplier',
  templateUrl: './supplier.component.html',
  styleUrls: ['./supplier.component.less']
})
export class SupplierComponent implements OnInit {

  public cols: any;
  public companies = [];
  public urlStore = environment.urlShop;

  constructor(
    private _sharedService: SharedService,
    private _hyperToastsService: HyperToastsService,
  ) { }

  ngOnInit() {
    this._sharedService.addBreadCrumb(
      [
        { 'text': 'Dashboard', 'router': '/home' },
        { 'text': 'Usuário', 'router': '' }
      ]
    );

    this.cols = [
      { field: 'company', header: 'Empresa' },
      { field: 'link-register', header: 'Link para cadastro' }
    ];

    this._sharedService.listCompaniesSupplier().subscribe(
      (response: any) => {
        if (response.return) {
          this.companies = response.data;
        } else {
          this._hyperToastsService.addToast('warn', 'Atenção', response.msg);
        }
      },
      err => { this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro ao listar as empresas.'); }
    );
  }

  copyUrl(value) {
    const selBox = document.createElement('textarea');

    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = environment.urlShop + 'supplier/login/' + value;

    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();

    document.execCommand('copy');
    document.body.removeChild(selBox);
  }

}
