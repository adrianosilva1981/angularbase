import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '@env/app-admin';
import { HyperCookieService } from 'lib-services';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  public locale = 'pt-BR';

  constructor(
    private _httpClient: HttpClient,
    private _hyperCookieService: HyperCookieService,
    private _router: Router
  ) { }


  getUserObject() {
    const cookieVal = this._hyperCookieService.getCookie_AUTH();

    if (cookieVal) {
      return cookieVal;
    } else {
      this._router.navigate(['/login']);
    }
  }

  //Retorna o token do usuário no cookie****************************************
  getUserToken() {
    const cookieVal = this.getUserObject();
    if (cookieVal) {
      if (cookieVal.JWT) {
        return cookieVal.JWT;
      } else {
        // Abrir Modal de login
      }
    } else {
      // Abrir Modal de login
    }
  }


  //Retorna as moedas********************************************
  getCurrencies() {
    const headers = new HttpHeaders()
      .set('accept-language', this.locale)
      .set('Content-Type', 'application/json');

    return this._httpClient.get(environment.apiPhpV2 + 'shop/coin/', { headers: headers });
  }

  //Retorna as categorias********************************************
  getCategories() {
    const headers = new HttpHeaders()
      .set('accept-language', this.locale)
      .set('Content-Type', 'application/json');

    return this._httpClient.get(environment.apiPhpV2 + 'shop/category/', { headers: headers });
  }


}
