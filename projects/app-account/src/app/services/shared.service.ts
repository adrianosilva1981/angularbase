import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { HyperCookieService } from 'lib-services';
import { Router } from '@angular/router';
import { environment } from '@env/app-account';
import { Observable } from 'rxjs';

import { DeliveryAddress } from '@app-account/models/deliveryAddress';
import { Address } from '@app-account/models/address';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  private profilePic2Upload: File;

  constructor(
    private http: HttpClient,
    private _hyperCookieService: HyperCookieService,
    private _router: Router,
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

  //Retorna o perfil do usuário logado******************************************
  getUserProfile() {
    const headers = new HttpHeaders()
      .set('accept-language', 'pt-BR')
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.getUserToken());

    return this.http.get(environment.apiPhp + 'user', { headers: headers });
  }

  //Verifica se um username esta disponivel*********************************************
  checkUsernameExists(username) {
    const headers = new HttpHeaders()
      .set('accept-language', 'pt-BR')
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.getUserToken());

    return this.http.get(environment.apiPhp + 'user/check/username/' + username, { headers: headers });
  }

  //Atualiza os dados pessoais do usuário*********************************************
  updatePersonalData(obj) {
    const headers = new HttpHeaders()
      .set('accept-language', 'pt-BR')
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.getUserToken());

    return this.http.post(environment.apiPhp + 'user/profile/shop', obj, { headers: headers });
  }

  //Retorna os endereços cadastrados*********************************************
  /*getListAddress(): Observable<DeliveryAddress> {
    const headers = new HttpHeaders()
      .set('accept-language', 'pt-BR')
      .set('Content-Type', 'application/json')
      .set('x-access-token', this.getUserToken());

    return this.http.get<DeliveryAddress>(environment.apiNode + 'customers/address', { headers: headers });
  }

  pullAddress(idAddress) {
    const headers = new HttpHeaders()
      .set('accept-language', 'pt-BR')
      .set('Content-Type', 'application/json')
      .set('x-access-token', this.getUserToken());

    return this.http.get(environment.apiNode + 'customers/address/remove/' + idAddress, { headers: headers });
  }

  setDeliveryAddress(idAddress) {
    const headers = new HttpHeaders()
      .set('accept-language', 'pt-BR')
      .set('Content-Type', 'application/json')
      .set('x-access-token', this.getUserToken());

    return this.http.get(environment.apiNode + 'customers/address/delivery/' + idAddress, { headers: headers });
  }

  pushAddress(objToPush: Address) {
    const headers = new HttpHeaders()
      .set('accept-language', 'pt-BR')
      .set('Content-Type', 'application/json')
      .set('x-access-token', this.getUserToken());

    return this.http.post(environment.apiNode + 'customers/address', objToPush, { headers: headers });
  }*/

  getAddresByCEP(cep) {
    return this.http.get(environment.apiSearchCEP + cep + '/json');
  }

  getCEPByAddress(uf, city, street) {
    return this.http.get(environment.apiSearchCEP + uf + '/' + city + '/' + street + '/json/');
  }

  //Retorna os cartões cadastrados*********************************************
  getMyCreditCards() {
    const headers = new HttpHeaders()
      .set('accept-language', 'pt-BR')
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.getUserToken());

    return this.http.get(environment.apiPhp + 'user/listCardCredit', { headers: headers });
  }

  //Delete o cartão cadastrados*********************************************
  deleteMyCreditCard(idCC) {
    const headers = new HttpHeaders()
      .set('accept-language', 'pt-BR')
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.getUserToken());

    return this.http.put(environment.apiPhp + 'user/deleteCardCredit', { id_card: idCC }, { headers: headers });
  }

  //Adiciona o ccartão de crédito*********************************************
  addCreditCard(body) {
    const headers = new HttpHeaders()
      .set('accept-language', 'pt-BR')
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.getUserToken());

    return this.http.post(environment.apiPhp + 'user/registerCardCredit', body, { headers: headers });
  }

  // informação do usuario
  getMyProfile() {
    const headers = new HttpHeaders()
      .set('accept-language', 'pt-BR')
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.getUserToken());

    return this.http.get(environment.apiPhp + 'user/profileUser', { headers: headers });
  }

   setProfilePic(file) {
     this.profilePic2Upload = file;
   }

   getProfilePic() {
     return this.profilePic2Upload;
   }

   updateUserPhoto(objProfile) {
    const headers = new HttpHeaders()
    .set('accept-language', 'pt-BR')
    .set('Content-Type', 'application/json')
    .set('Authorization', 'Bearer ' + this.getUserToken());

    return this.http.put(environment.apiPhp + 'user/updateUserPhoto', JSON.stringify(objProfile), { headers: headers });
  }

}
