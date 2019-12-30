import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { HyperCookieService } from 'lib-services';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  public locale = 'pt-BR';

  constructor(
    @Inject('environments') private environments: any,
    private _httpClient: HttpClient,
    private _hyperCookieService: HyperCookieService
  ) { }

  //Retorna o token do usuário no cookie****************************************
  getUserToken() {
    const cookieVal = this._hyperCookieService.getCookie_AUTH();
    if (cookieVal && Object(cookieVal.JWT)) {
      return cookieVal.JWT;
    }
    return false;
  }

  //VERIFICA O EMAIL DIGITADO********************************************
  verifyEmail(mail) {
    const headers = new HttpHeaders()
      .set('accept-language', this.locale)
      .set('Content-Type', 'application/json');

    return this._httpClient.get(this.environments.apiPhp + 'user/verify/' + mail, { headers: headers });
  }

  //REALIZA O LOGIN NA PLATAFORMA********************************************
  login(data) {
    const headers = new HttpHeaders()
      .set('accept-language', this.locale)
      .set('Content-Type', 'application/json');

    return this._httpClient.get(this.environments.apiPhp + 'user/login/' + data.email + '/' + data.password, { headers: headers });
  }

  //REALIZA O ENVIO DE RECUPERAÇÃO DE SENHA*******************************************
  sendEmailRecovey(obj) {
    // const headers = new HttpHeaders()
    //   .set('accept-language', this.locale)
    //   .set('Content-Type', 'application/json');

    // const auxObj: any = { 'mail': obj.email };

    // return this._httpClient.put(this.environments.apiPhp + 'user/forgotPassword', auxObj, { headers: headers });

    const header = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Accept-Language', 'pt-BR');

    return this._httpClient.post<any>(this.environments.apiNetmarketing + 'reseller/forgotpassword', obj, { headers: header });
  }

  //ENVIA O EMAIL DE CONFIRMAÇÃO DE CADASTRO*******************************************
  confirmEmail(obj) {
    const headers = new HttpHeaders()
      .set('accept-language', this.locale)
      .set('Content-Type', 'application/json');

    return this._httpClient.put(this.environments.apiPhp + 'user/mailConfirmation', obj, { headers: headers });
  }

  //MUDA A SENHA ATUAL*******************************************
  resetPassword(obj) {
    const headers = new HttpHeaders()
      .set('accept-language', this.locale)
      .set('Content-Type', 'application/json');

    return this._httpClient.put(this.environments.apiPhp + 'user/recoverPassword', obj, { headers: headers });
  }

  //CONFIRMA EMAIL*******************************************
  receiverMailConfirmation(obj) {
    const headers = new HttpHeaders()
      .set('accept-language', this.locale)
      .set('Content-Type', 'application/json');

    return this._httpClient.put(this.environments.apiPhp + 'user/receivedMailConfirmation', obj, { headers: headers });
  }
}