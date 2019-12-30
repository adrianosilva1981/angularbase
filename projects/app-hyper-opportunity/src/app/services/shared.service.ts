import { Injectable } from '@angular/core';
import { HyperCookieService, BroadcastEventService } from 'lib-services';
import { Router } from '@angular/router';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from '@env/app-hyper-opportunity';
import { Observable } from 'rxjs/Observable';


@Injectable({
  providedIn: 'root'
})
export class SharedService {

  public locale = 'pt-BR';

  constructor(
    private _hyperCookieService: HyperCookieService,
    private _router: Router,
    private _httpClient: HttpClient
  ) { }

  breadCrumb(data) {
    BroadcastEventService.event('onBreadCrumb').emit(data);
  }

  getUserObject() {
    const cookieVal = this._hyperCookieService.getCookie_AUTH();
    if (cookieVal) {
      return cookieVal;
    }
    return false;
  }

  //Retorna o token do usuário no cookie****************************************
  getUserToken() {
    const cookieVal = this.getUserObject();
    if (cookieVal && Object(cookieVal.JWT)) {
      return cookieVal.JWT;
    }
  }


  //Retorna os oportunidades disponiveis********************************
  getOpportunities(range: string[] = [], filter = {}) {
    const httpOptions = {
      headers: new HttpHeaders()
        .set('accept-language', this.locale)
        .set('Content-Type', 'application/json')
    };

    const auxRange = range.length !== 0 ? ('/' + range.join(',')) : '';

    return this._httpClient.put(environment.apiPhp + 'job/sponsor/hyperOpportunity' + auxRange, filter, httpOptions);
  }

  //Retorna o plano de Worker***********************
  getPlanHomeWorker() {
    const httpOptions = {
      headers: new HttpHeaders()
        .set('accept-language', this.locale)
        .set('Content-Type', 'application/json')
    };

    return this._httpClient.get(environment.apiPhp + 'shared/plan-home-worker', httpOptions);
  }

  //Retorna a lista de categorias do profissionais***********************
  getProfessionalCategories() {
    const httpOptions = {
      headers: new HttpHeaders()
        .set('accept-language', this.locale)
        .set('Content-Type', 'application/json')
    };

    return this._httpClient.get(environment.apiPhp + 'shared/category', httpOptions);
  }

  //Retorna um plano especifico***********************
  getSpecificPlan(idPlan) {
    const httpOptions = {
      headers: new HttpHeaders()
        .set('accept-language', this.locale)
        .set('Content-Type', 'application/json')
    };

    return this._httpClient.get(environment.apiPhp + 'shared/plan/' + idPlan, httpOptions);
  }

  //Retorna a lista de Subcategorias do profissionais***********************
  getProfessionalSubCategories(category) {
    const httpOptions = {
      headers: new HttpHeaders()
        .set('accept-language', this.locale)
        .set('Content-Type', 'application/json')
    };

    return this._httpClient.get(environment.apiPhp + 'shared/subcategory/' + category, httpOptions);
  }

  //Cria uma assinatura***********************
  createSignature(body) {
    const httpOptions = {
      headers: new HttpHeaders()
        .set('accept-language', this.locale)
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + this.getUserToken())
    };

    return this._httpClient.post(environment.apiPhp + 'user/createSignatureHome', body, httpOptions);
  }


  //Registra o usuário na HyperJobs**********************************************
  registerInHJ(data) {
    const headers = new HttpHeaders()
      .set('accept-language', this.locale)
      .set('Content-Type', 'application/json');

    return this._httpClient.post(environment.apiPhp + 'shop/customer', data, { headers: headers });
  }

  checkCode(code) {
    const headers = new HttpHeaders()
      .set('accept-language', this.locale)
      .set('Content-Type', 'application/json');

    return this._httpClient.get(environment.apiPhp + 'user/code/' + code, { headers: headers });
  }

  activateCode(body) {
    const headers = new HttpHeaders()
      .set('accept-language', this.locale)
      .set('Content-Type', 'application/json');

    return this._httpClient.post(environment.apiPhp + 'shop/activate_code', body, { headers: headers });
  }
}
