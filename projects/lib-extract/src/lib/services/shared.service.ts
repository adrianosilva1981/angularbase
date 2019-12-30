import { Injectable, Inject } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { HyperCookieService, CheckoutParameter } from 'lib-services';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  public locale = 'pt-BR';
  private checkout_parameter: CheckoutParameter;
  constructor(
    @Inject('environments') private environments: any,
    private _httpClient: HttpClient,
    private _hyperCookieService: HyperCookieService

  ) { }

  getUserToken() {
    const cookieVal = this._hyperCookieService.getCookie_AUTH();
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
  getUserExtract(): any {
    const headers = new HttpHeaders()
      .set('accept-language', this.locale)
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.getUserToken());

    return this._httpClient.get(this.environments.apiPhp + 'all/extract', { headers: headers });
  }

  setCheckoutParameter(value) {
    this.checkout_parameter = value;
  }
  getCheckoutParameter(): CheckoutParameter {
    return this.checkout_parameter;
  }

  getAllBanks(): any {
    const headers = new HttpHeaders()
      .set('accept-language', this.locale)
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.getUserToken());

    return this._httpClient.get(this.environments.apiPhp + 'all/banks/BRA', { headers: headers });
  }

  getUserBanks(): any {
    const headers = new HttpHeaders()
      .set('accept-language', this.locale)
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.getUserToken());

    return this._httpClient.get(this.environments.apiPhp + 'user/listAccountBank', { headers: headers });
  }
  postNewUserBank(data): any {
    const headers = new HttpHeaders()
      .set('accept-language', this.locale)
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.getUserToken());

    return this._httpClient.post(this.environments.apiPhp + 'user/newAccountBank', data, { headers: headers });
  }
  getUserBalance(): any {
    const headers = new HttpHeaders()
      .set('accept-language', this.locale)
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.getUserToken());

    return this._httpClient.get(this.environments.apiPhp + 'user/balance', { headers: headers });
  }
  postWithdrawValue(data): any {
    const headers = new HttpHeaders()
      .set('accept-language', this.locale)
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.getUserToken());

    return this._httpClient.post(this.environments.apiPhp + 'user/rescueCredit', data, { headers: headers });
  }
  getWithdrawList(): any {
    const headers = new HttpHeaders()
      .set('accept-language', this.locale)
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.getUserToken());

    return this._httpClient.get(this.environments.apiPhp + 'user/list-withdraw', { headers: headers });
  }
  postInsertCredit(data): any {
    const headers = new HttpHeaders()
      .set('accept-language', this.locale)
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.getUserToken());

    return this._httpClient.post(this.environments.apiPhp + 'user/insertCredit', data, { headers: headers });
  }
}
