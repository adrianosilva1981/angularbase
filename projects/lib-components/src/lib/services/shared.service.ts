import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Http, RequestOptions, ResponseContentType, Headers } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';

import { HyperCookieService } from 'lib-services';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  public locale = 'pt-BR';
  private products: any;

  constructor(
    @Inject('environments') private environments: any,
    private _httpClient: HttpClient,
    private _hyperCookieService: HyperCookieService,
    private _httpDownload: Http
  ) { }

  downloadBankSlip(url): Observable<any> {
    const headers = new Headers({
      'Content-Type': 'application/json'
    });

    const options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Blob });

    return this._httpDownload.get(url, options)
      .map((res) => {
        return new Blob([res.blob()], { type: 'application/pdf' });
      });
  }


  //Retorna o token do usuário no cookie****************************************
  getUserToken() {
    const cookieName = this.environments.defaultCookieName;

    const cookieVal = cookieName ? this._hyperCookieService.getCookie_GENERIC(cookieName) : this._hyperCookieService.getCookie_AUTH();
    if (cookieVal && Object(cookieVal.JWT)) {
      return cookieVal.JWT;
    }
    return false;
  }
  //Retorna o token do usuário no cookie****************************************
  getUser() {
    const cookieName = this.environments.defaultCookieName;

    const cookieVal = cookieName ? this._hyperCookieService.getCookie_GENERIC(cookieName) : this._hyperCookieService.getCookie_AUTH();
    if (cookieVal && Object(cookieVal.JWT)) {
      return cookieVal;
    }
    return false;
  }

  //Retorna o saldo do usuário logado*******************************************
  getUserBalance() {
    const headers = new HttpHeaders()
      .set('accept-language', this.locale)
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.getUserToken());

    return this._httpClient.get(this.environments.apiPhp + 'user/balance', { headers: headers });
  }

  // Realiza o chekcout com os dados passados**********************************
  checkout(data) {
    const headers = new HttpHeaders()
      .set('accept-language', this.locale)
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.getUserToken())
      .set('x-consultant', ((data.woner > 0) ? data.woner : ''));

    return this._httpClient.post(this.environments.apiPhpV2 + 'checkout', data, { headers: headers });
  }

  //Retorna as moedas********************************************
  getCurrencies() {
    const headers = new HttpHeaders()
      .set('accept-language', this.locale)
      .set('Content-Type', 'application/json');

    return this._httpClient.get(this.environments.apiPhpV2 + 'shop/coin/', { headers: headers });
  }

  //Retorna as categorias********************************************
  getCategories() {
    const headers = new HttpHeaders()
      .set('accept-language', this.locale)
      .set('Content-Type', 'application/json');

    return this._httpClient.get(this.environments.apiPhpV2 + 'shop/category/', { headers: headers });
  }

  getDepartments() {
    const headers = new HttpHeaders()
      .set('accept-language', this.locale)
      .set('Content-Type', 'application/json');

    return this._httpClient.get(this.environments.apiPhpV2 + 'shop/department/', { headers: headers });
  }


  //Adiciona Produto********************************************
  postProduct(product): any {
    const headers = new HttpHeaders()
      .set('accept-language', this.locale)
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.getUserToken());

    return this._httpClient.post(this.environments.apiPhpV2 + 'shop/product/', product, { headers: headers });
  }

  //Adiciona Fornecedor********************************************
  postSupplier(supplier): any {
    const headers = new HttpHeaders()
      .set('accept-language', this.locale)
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.getUserToken());

    return this._httpClient.post(this.environments.apiPhpV2 + 'shop/supplier/', supplier, { headers: headers });
  }

  //lista Fornecedor********************************************
  getSupplier(): any {
    const headers = new HttpHeaders()
      .set('accept-language', this.locale)
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.getUserToken());

    return this._httpClient.get(this.environments.apiPhpV2 + 'shop/supplier', { headers: headers });
  }

  getCEPByAddress(uf, city, street) {
    return this._httpClient.get(this.environments.apiSearchCEP + uf + '/' + city + '/' + street + '/json/');
  }

  // UPLOAD IMAGENS
  postImageS3(path, file, urlApi): any {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('path', path);

    const headers = new HttpHeaders()
      .set('accept-language', 'pt-BR')
      .set('Authorization', 'Bearer ' + this.getUserToken());

    return this._httpClient.post(urlApi, formData, { headers: headers });
  }

  getAddressCep(cep): any {
    const headers = new HttpHeaders()
      .set('accept-language', 'pt-BR')
      .set('Content-Type', 'application/json');
    return this._httpClient.get('https://viacep.com.br/ws/' + cep + '/json/', { headers: headers });

  }

  // RETORNA A LISTA DE CATEGORIAS
  getCategory() {
    const headers = new HttpHeaders()
      .set('accept-language', 'pt-BR')
      .set('Content-Type', 'application/json');

    return this._httpClient.get(this.environments.apiPhpV2 + 'shop/category/', { headers: headers });
  }

  // RETORNA A LISTA DE SUBCATEGORIAS DE UMA CATEGORIA ESPECIFICA
  getSubCategory(cat) {
    const headers = new HttpHeaders()
      .set('accept-language', 'pt-BR')
      .set('Content-Type', 'application/json');

    return this._httpClient.get(this.environments.apiPhp + 'shared/subcategory/' + cat, { headers: headers });
  }

  // RETORNA A LISTA DE LINGUAGENS
  getLanguage() {
    const headers = new HttpHeaders()
      .set('accept-language', 'pt-BR')
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.getUserToken());

    return this._httpClient.get(this.environments.apiPhp + 'shared/language', { headers: headers });
  }

  // RETORNA A LISTA DE TIPOS DE JOB
  getJobType() {
    const headers = new HttpHeaders()
      .set('accept-language', 'pt-BR')
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.getUserToken());

    return this._httpClient.get(this.environments.apiPhp + 'shared/job-type', { headers: headers });
  }

  // RETORNA A LISTA DE MOEDAS
  getCois() {
    const headers = new HttpHeaders()
      .set('accept-language', 'pt-BR')
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.getUserToken());

    return this._httpClient.get(this.environments.apiPhp + 'shared/coin', { headers: headers });
  }

  //lista os produtos********************************************
  getProducts(filter): any {
    const headers = new HttpHeaders()
      .set('accept-language', this.locale)
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.getUserToken());

    return this._httpClient.put(this.environments.apiPhpV2 + 'products/allproducts', filter, { headers: headers });
  }
  //lista os servicos********************************************
  getServices(filter): any {
    const headers = new HttpHeaders()
      .set('accept-language', this.locale)
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.getUserToken());

    return this._httpClient.put(this.environments.apiPhpV2 + 'services/allservices', filter, { headers: headers });
  }

  saveProducts(data) {
    this.products = data;
  }

  getLocalProduct(id) {
    if (this.products) {
      const prd = this.products.find(x => x.id === id);
      return prd;
    } else {
      return false;
    }
  }

  //deleta o produtos********************************************
  deleteProducts(obj): any {
    const headers = new HttpHeaders()
      .set('accept-language', this.locale)
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.getUserToken());

    return this._httpClient.put(this.environments.apiPhpV2 + 'products/remove', obj, { headers: headers });
  }
  //deleta o produtos********************************************
  deleteService(obj): any {
    const headers = new HttpHeaders()
      .set('accept-language', this.locale)
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.getUserToken());

    return this._httpClient.put(this.environments.apiPhpV2 + 'services/remove', obj, { headers: headers });
  }

  //lista os bancos********************************************
  getBanks(): any {
    const headers = new HttpHeaders()
      .set('accept-language', this.locale)
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.getUserToken());

    return this._httpClient.get(this.environments.apiPhpV2 + 'tools/get-banks', { headers: headers });
  }

  // Ativa voucher tornando usuario prime****************************************
  postVoucher(voucher): any {
    const headers = new HttpHeaders()
      .set('accept-language', this.locale)
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.getUserToken());

    return this._httpClient.post(this.environments.apiPhpV2 + 'vouchers/activateVoucher', voucher, { headers: headers });
  }

  //Retorna saldo do usuario netmarketing***********************************************
  getBalanceNetMarketing(): any {
    const httpOptions = {
      headers: new HttpHeaders()
        .set('accept-language', this.locale)
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + this.getUserToken())
    };

    return this._httpClient.get(this.environments.apiNetmarketing + 'reseller/balance', httpOptions);
  }

  //Cria serviço***********************************************
  postService(data): any {
    const httpOptions = {
      headers: new HttpHeaders()
        .set('accept-language', this.locale)
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + this.getUserToken())
    };

    return this._httpClient.post(this.environments.apiPhpV2 + 'services/register', data, httpOptions);
  }

  //Get skill***********************************************
  getSkills(): any {
    const httpOptions = {
      headers: new HttpHeaders()
        .set('accept-language', this.locale)
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + this.getUserToken())
    };

    return this._httpClient.get(this.environments.apiPhpV2 + 'services/skills', httpOptions);
  }
  //Registra o usuário na HyperJobs**********************************************
  registerInHJ(data) {
    const headers = new HttpHeaders()
      .set('accept-language', this.locale)
      .set('Content-Type', 'application/json');

    return this._httpClient.post(this.environments.apiPhp + 'shop/customer', data, { headers: headers });
  }


}