import { Injectable } from '@angular/core';
import { RequestOptions, Headers, Http } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';

import { ChatboxConsultationService } from './../chatbox-consultation.service';
import { BroadcastEventService } from 'hyper-jobs-services';

@Injectable()
export class ConsultationService {

  private enviromment: any;
  private killAll = true;
  public locale = 'pt-BR';

  constructor(
    private _http: Http,
    private _chatboxConsultationService: ChatboxConsultationService
  ) {
    this.enviromment = _chatboxConsultationService.getEnvironments();
    BroadcastEventService.event('takeWhile').subscribe(code => {
      this.killAll = code === '0';
    });
  }

  mountJsontoConsult(objConsultation: any) {
    const headers = new Headers({
      Authorization: 'Bearer ' + this._chatboxConsultationService.getUserToken(),
      'accept-language': this.locale,
      'Content-Type': 'application/json'
    });

    const options = new RequestOptions({ headers: headers }); // Create a request option

    return this._http.post(this.enviromment.apiUrl + 'consultation/create', JSON.stringify(objConsultation), options)
      .map(res => res.json())
      .takeWhile(() => this.killAll)
      .catch(err => Observable.throw(err.json().error || 'Server error'));
  }

  confirmInitConsultation(objInitConsultation: any) {
    const headers = new Headers({
      Authorization: 'Bearer ' + this._chatboxConsultationService.getUserToken(),
      'accept-language': this.locale,
      'Content-Type': 'application/json'
    });

    const options = new RequestOptions({ headers: headers }); // Create a request option

    return this._http.post(this.enviromment.apiUrl + 'consultation/confirm-receiver', JSON.stringify(objInitConsultation), options)
      .map(res => res.json())
      .takeWhile(() => this.killAll)
      .catch(err => Observable.throw(err.json().error || 'Server error'));
  }

  confirmInitConsultationProgress(idTransaction) {
    const headers = new Headers({
      Authorization: 'Bearer ' + this._chatboxConsultationService.getUserToken(),
      'accept-language': this.locale,
      'Content-Type': 'application/json'
    });

    const options = new RequestOptions({ headers: headers }); // Create a request option

    return this._http.get(this.enviromment.apiUrl + 'consultation/confirm-sender/' + idTransaction, options)
      .map(res => res.json())
      .takeWhile(() => this.killAll)
      .catch(err => Observable.throw(err.json().error || 'Server error'));
  }

  persistChatAutomatic(receiver, type) {
    const headers = new Headers({
      Authorization: 'Bearer ' + this._chatboxConsultationService.getUserToken(),
      'accept-language': this.locale,
      'Content-Type': 'application/json'
    });

    const arrayType = {
      begin_videocall: 'VIDEOCHAMADA INICIADA',
      begin_audiocall: 'AUDIOCHAMADA INICIADA',
      begin_call: 'CHAMADA INICIADA',
      end_videocall: 'VIDEOCHAMADA FINALIZADA',
      end_audiocall: 'AUDIOCHAMADA FINALIZADA',
      end_call: 'CHAMADA FINALIZADA'
    };

    const options = new RequestOptions({ headers: headers }); // Create a request option
    const objMessage = {
      user_receiver: receiver,
      text: arrayType[type],
      type: 'call'
    };

    return this._http.post(this.enviromment.apiUrl + 'chat/conversation', JSON.stringify(objMessage), options)
      .map(res => res.json())
      .takeWhile(() => this.killAll)
      .catch(err => Observable.throw(err.json().error || 'Server error'));
  }

  finishConsultation(transaction, reasonEnd) {
    const headers = new Headers({
      Authorization: 'Bearer ' + this._chatboxConsultationService.getUserToken(),
      'accept-language': this.locale,
      'Content-Type': 'application/json'
    });

    const options = new RequestOptions({ headers: headers }); // Create a request option
    const bodyPost = {
      id_transaction: transaction,
      reason_end: reasonEnd
    };

    return this._http.post(this.enviromment.apiUrl + 'consultation/finish', JSON.stringify(bodyPost), options)
      .map(res => res.json())
      .takeWhile(() => this.killAll)
      .catch(err => Observable.throw(err.json().error || 'Server error'));
  }

  getSituationTransaction(idTransaction) {
    const headers = new Headers({
      Authorization: 'Bearer ' + this._chatboxConsultationService.getUserToken(),
      'accept-language': this.locale,
      'Content-Type': 'application/json'
    });

    const options = new RequestOptions({ headers: headers }); // Create a request option

    return Observable
      .timer(0, 15000)
      .mergeMap(() => this._http.get(this.enviromment.apiUrl + 'consultation/situation/' + idTransaction, options)
        .map(res => res.json())
        .takeWhile(() => this.killAll)
        .catch(err => Observable.throw(err.json().error || 'Server error')));
  }

  getIceServer() {
    const bodyParam = {
      post_name: 'ice_servers',
      apiUser: 'tap4mobile',
      apiPass: 'Tap4toHyperJobs',
      preferenceClient: 'xirsys'
    };

    return this._http.post(this.enviromment.urlHjChat, JSON.stringify(bodyParam))
      .map(res => res.json())
      .takeWhile(() => this.killAll)
      .catch(err => Observable.throw(err.json().error || 'Server error'));
  }

  setDiscount(objDiscount: any) {
    const headers = new Headers({
      Authorization: 'Bearer ' + this._chatboxConsultationService.getUserToken(),
      'accept-language': this.locale,
      'Content-Type': 'application/json'
    });

    const options = new RequestOptions({ headers: headers }); // Create a request option

    return this._http.post(this.enviromment.apiUrl + 'consultation/discount', JSON.stringify(objDiscount), options)
      .map(res => res.json())
      .takeWhile(() => this.killAll)
      .catch(err => Observable.throw(err.json().error || 'Server error'));
  }

  setEvaluate(objEvaluate: any) {
    const headers = new Headers({
      Authorization: 'Bearer ' + this._chatboxConsultationService.getUserToken(),
      'accept-language': this.locale,
      'Content-Type': 'application/json'
    });

    const options = new RequestOptions({ headers: headers }); // Create a request option

    return this._http.post(this.enviromment.apiUrl + 'consultation/evaluate', JSON.stringify(objEvaluate), options)
      .map(res => res.json())
      .takeWhile(() => this.killAll)
      .catch(err => Observable.throw(err.json().error || 'Server error'));
  }
}