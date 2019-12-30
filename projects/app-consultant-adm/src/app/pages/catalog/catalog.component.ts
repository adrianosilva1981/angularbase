import { Component, OnInit } from '@angular/core';
import { SharedService } from '@app-consultant-adm/services/shared.service';
import { HyperToastsService } from 'lib-services';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-consultant-adm-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.less']
})
export class CatalogComponent implements OnInit {


  public allServices: any = [];
  public summary: any;
  public itensPerpage = 2;
  public arrayLength;
  public arrayPerPage = new Array(this.itensPerpage);
  public dataShop: any = {};
  public objUser: any = {};
  public accessAuthenticated = false;

  constructor(
    private _sharedService: SharedService,
    private _hyperToastsService: HyperToastsService,
    private _activatedRoute: ActivatedRoute,
    private _router: Router
  ) { }


  ngOnInit() {

    this._sharedService.addBreadCrumb(
      [
        { 'text': 'Dashboard', 'router': '/home' },
        { 'text': 'Catálogo', 'router': '/services/catalog' },
        { 'text': 'Visualizar', 'router': '' }
      ]
    );

    const _self = this;

    this.objUser = this._sharedService.getUserObject();

    this._activatedRoute.params.subscribe(
      params => {
        this.accessAuthenticated = params.user === undefined;
        const aux = this.objUser ? this.objUser.id : null;
        this.getAllServices(params.user);
        this.getConsultantData(aux || params.user, 'data_shop, subDomain');

      }
    );
  }

  getConsultantData(id = '', fields = '') {
    this._sharedService.getConsultants().subscribe(
      response => {
        if (response.return) {
          this.dataShop = response.data;
        }
      },
      err => { this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro inesperado. Atualize a página e tente novamente'); }
    );
  }

  getAllServices(consultant = null) {
    this._sharedService.getAllServices(consultant).subscribe(
      (response: any) => {
        if (response.return) {
          this.validateServices(response.data.services);
          this.validateSumary(response.data.summary);
        } else {
          this._hyperToastsService.addToast('error', 'Erro', 'Catálogo Indisponível');
        }
      },
      err => { this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro inesperado. Atualize a página e tente novamente'); }
    );
  }

  validateSumary(summary) {
    this.summary = summary;
  }

  validateServices(services) {

    /***********************************CODIGO SEM SEPARAÇÃO POR TIPOS************************************************* */
    // Remove os que possuer o services.id duplicado
    // const auxServices = [];
    /*Observable.merge(services).distinct((x: any) => x.id).subscribe(y => {
      auxServices.push(y);
    });

    this.allServices = auxServices;
    this.arrayLength = new Array(Math.ceil(this.allServices.length / this.itensPerpage));*/
    /***********************************CODIGO SEM SEPARAÇÃO POR TIPOS************************************************* */

    const arrAux: any = {};
    let arrMerged = [];

    // Separa por tipos
    services.forEach(element => {
      if (!arrAux[element.slug]) {
        arrAux[element.slug] = new Array;
      }
      arrAux[element.slug].push(element);
    });


    // Adiciona as posiçoes vazias
    Object.keys(arrAux).forEach(element => {
      const lengh = this.addEmpty(arrAux[element]);
      for (let index = 0; index < lengh; index++) {
        arrAux[element].push({ slug: element, type: null });
      }
    });

    // Volta para uma lista unica de obj
    Object.keys(arrAux).forEach(element => {
      arrMerged = arrMerged.concat(arrAux[element]);
    });

    this.allServices = arrMerged;
    this.arrayLength = new Array(Math.ceil(this.allServices.length / this.itensPerpage));

  }

  addEmpty(arr) {
    const tamanho = arr.length;
    const resp = tamanho / this.itensPerpage;
    let decimal;
    let result = 0;

    if (tamanho % this.itensPerpage !== 0) {
      decimal = (resp - Math.floor(resp));
      result = Math.ceil(Math.abs((decimal * this.itensPerpage) - this.itensPerpage));
    }
    return result;
  }

  paginateIndex(obj, page) {
    setTimeout(() => {
      const tpy = this.summary.find(x => x.slug === obj.slug);
      if (tpy) {
        const categ = tpy.category.find(x => x.description === obj.category);
        if (categ) {
          const jobs = categ.jobs.find(x => x.id === obj.id);
          if (jobs) {
            jobs.page = page + 1;
          }
        }
      }
    }, 100);
  }
}
