import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HyperCookieService } from 'lib-services';

@Injectable({
  providedIn: 'root'
})
export class NodeService {
  public socketNode: any;
  public classStatusChat = 'hjStatusUserChat_';
  public urlHjChat = '';
  public locale = 'pt-BR';

  constructor(
    @Inject('environments') private environments: any,
    private _httpClient: HttpClient,
    private _hyperCookieService: HyperCookieService
  ) {
    this.urlHjChat = this.environments.urlHjChat;
  }

  getUserObject() {
    return this._hyperCookieService.getCookie_AUTH();
  }

  getUserToken() {
    const cookie: any = this.getUserObject;
    if (cookie && Object(cookie.JWT)) {
      return cookie.JWT;
    }
  }

  setSocketNode(conn) {
    this.socketNode = conn;
  }

  setStatusUser(id, status) {
    const arrayElementHtml = document.getElementsByClassName(this.classStatusChat + id);

    for (let i = 0; i < arrayElementHtml.length; i++) {
      arrayElementHtml[i].classList.remove('online', 'offline', 'busy');
      arrayElementHtml[i].classList.add(status);
    }
  }

  checkUserStatusInView(id) {
    const arrayElementHtml = document.getElementsByClassName(this.classStatusChat + id);
    if (arrayElementHtml !== undefined || arrayElementHtml !== null) {
      return arrayElementHtml.length > 0;
    } else {
      return false;
    }
  }

  getUsersInView() {
    const arrayElementInView = document.querySelectorAll('[class*=hjStatusUserChat_]');
    let arrayClass = [];
    const arrayClassName = [];

    for (let i = 0; i < arrayElementInView.length; i++) {
      arrayClass = arrayElementInView[i].className.split(/\s+/);

      arrayClass.map(item => {
        if (item.includes('hjStatusUserChat_')) {
          arrayClassName.push(item.replace('hjStatusUserChat_', ''));
        }
      });
    }
    return arrayClassName;
  }

  getUserChat() {
    const headers = new HttpHeaders()
      .set('accept-language', this.locale)
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.getUserToken());

    return this._httpClient.get(this.environments.apiPhp + 'chat/user', { headers: headers });
  }

  mountJsontoConsult(objConsultation: any) {
    const headers = new HttpHeaders()
      .set('accept-language', this.locale)
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.getUserToken());

    return this._httpClient.post(this.environments.apiPhp + 'consultation/create', objConsultation, { headers: headers });
  }

  confirmInitConsultation(objInitConsultation: any) {
    const headers = new HttpHeaders()
      .set('accept-language', this.locale)
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.getUserToken());

    return this._httpClient.post(this.environments.apiPhp + 'consultation/confirm-receiver', objInitConsultation, { headers: headers });
  }

  confirmInitConsultationProgress(idTransaction) {
    const headers = new HttpHeaders()
      .set('accept-language', this.locale)
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.getUserToken());

    return this._httpClient.get(this.environments.apiPhp + 'consultation/confirm-sender/' + idTransaction, { headers: headers });
  }

  persistChatAutomatic(receiver, type) {
    const headers = new HttpHeaders()
      .set('accept-language', this.locale)
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.getUserToken());

    const arrayType = {
      begin_videocall: 'VIDEOCHAMADA INICIADA',
      begin_audiocall: 'AUDIOCHAMADA INICIADA',
      begin_call: 'CHAMADA INICIADA',
      end_videocall: 'VIDEOCHAMADA FINALIZADA',
      end_audiocall: 'AUDIOCHAMADA FINALIZADA',
      end_call: 'CHAMADA FINALIZADA'
    };

    const objMessage = {
      user_receiver: receiver,
      text: arrayType[type],
      type: 'call'
    };

    return this._httpClient.post(this.environments.apiPhp + 'chat/conversation', objMessage, { headers: headers });
  }

  finishConsultation(transaction, reasonEnd) {
    const headers = new HttpHeaders()
      .set('accept-language', this.locale)
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.getUserToken());

    const bodyPost = {
      id_transaction: transaction,
      reason_end: reasonEnd
    };

    return this._httpClient.post(this.environments.apiPhp + 'consultation/finish', bodyPost, { headers: headers });
  }

  getSituationTransaction(idTransaction) {
    const headers = new HttpHeaders()
      .set('accept-language', this.locale)
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.getUserToken());

    return this._httpClient.get(this.environments.apiPhp + 'consultation/situation/' + idTransaction, { headers: headers });
  }

  getIceServer() {
    const bodyParam = {
      post_name: 'ice_servers',
      apiUser: 'tap4mobile',
      apiPass: 'Tap4toHyperJobs',
      preferenceClient: 'xirsys'
    };

    return this._httpClient.post(this.environments.urlHjChat + 'consultation/finish', bodyParam);
  }

  setDiscount(objDiscount: any) {
    const headers = new HttpHeaders()
      .set('accept-language', this.locale)
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.getUserToken());

    return this._httpClient.post(this.environments.apiPhp + 'consultation/discount', objDiscount, { headers: headers });
  }

  setEvaluate(objEvaluate: any) {
    const headers = new HttpHeaders()
      .set('accept-language', this.locale)
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.getUserToken());

    return this._httpClient.post(this.environments.apiPhp + 'consultation/evaluate', objEvaluate, { headers: headers });
  }

}
