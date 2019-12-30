import { Injectable } from '@angular/core';
import { RequestOptions, Headers, Http } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';

import { ChatboxConsultationService } from './../chatbox-consultation.service';
import { BroadcastEventService } from 'hyper-jobs-services';

@Injectable()
export class ChatBoxService {

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

  getRecentChat(user?) {
    const headers = new Headers({
      'Authorization': 'Bearer ' + this._chatboxConsultationService.getUserToken(),
      'accept-language': this.locale,
      'Content-Type': 'application/json'
    });

    const parUser = user !== undefined && user !== 0 ? ('/' + user) : '';

    const options = new RequestOptions({ headers: headers }); // Create a request option

    return this._http.get(this.enviromment.apiUrl + 'chat/recent' + parUser, options)
      .map(res => res.json())
      .takeWhile(() => this.killAll)
      .catch(err => Observable.throw(err.json().error || 'Server error'));
  }

  getConversation(contact: number, size: number, page: number) {
    const headers = new Headers({
      'Authorization': 'Bearer ' + this._chatboxConsultationService.getUserToken(),
      'accept-language': this.locale,
      'Content-Type': 'application/json'
    });

    const options = new RequestOptions({ headers: headers }); // Create a request option

    return this._http.get(this.enviromment.apiUrl + 'chat/conversation/' + contact + '/' + size + '/' + page, options)
      .map(res => res.json())
      .takeWhile(() => this.killAll)
      .catch(err => Observable.throw(err.json().error || 'Server error'));
  }

  SendMessage(objMessage) {
    const headers = new Headers({
      Authorization: 'Bearer ' + this._chatboxConsultationService.getUserToken(),
      'accept-language': this.locale,
      'Content-Type': 'application/json'
    });

    const options = new RequestOptions({ headers: headers }); // Create a request option

    return this._http.post(this.enviromment.apiUrl + 'chat/conversation', JSON.stringify(objMessage), options)
      .map(res => res.json())
      .takeWhile(() => this.killAll)
      .catch(err => Observable.throw(err.json().error || 'Server error'));
  }

  getResume() {
    const headers = new Headers({
      'Authorization': 'Bearer ' + this._chatboxConsultationService.getUserToken(),
      'accept-language': this.locale,
      'Content-Type': 'application/json'
    });

    const options = new RequestOptions({ headers: headers }); // Create a request option

    return this._http.get(this.enviromment.apiUrl + 'chat/resume', options)
      .map(res => res.json())
      .takeWhile(() => this.killAll)
      .catch(err => Observable.throw(err.json().error || 'Server error'));
  }

  getStatusUsers(arrUsers: number[]) {
    const headers = new Headers({
      Authorization: 'Bearer ' + this._chatboxConsultationService.getUserToken(),
      'accept-language': this.locale,
      'Content-Type': 'application/json'
    });

    const options = new RequestOptions({ headers: headers }); // Create a request option
    const req = {
      'users': arrUsers
    };

    return this._http.post(this.enviromment.apiUrl + 'chat/status', JSON.stringify(req), options)
      .map(res => res.json())
      .takeWhile(() => this.killAll)
      .catch(err => Observable.throw(err.json().error || 'Server error'));
  }

  setChatMessageRead(idMessage) {
    const headers = new Headers({
      'Authorization': 'Bearer ' + this._chatboxConsultationService.getUserToken(),
      'accept-language': this.locale,
      'Content-Type': 'application/json'
    });

    const auxObj: any = { message: idMessage };
    const options = new RequestOptions({ headers: headers }); // Create a request option

    return this._http.put(this.enviromment.apiUrl + 'chat/read', JSON.stringify(auxObj), options)
      .map(res => res.json())
      .takeWhile(() => this.killAll)
      .catch(err => Observable.throw(err.json().error || 'Server error'));
  }

  getUserByUsernameOrMail(user) {
    const headers = new Headers({
      'Authorization': 'Bearer ' + this._chatboxConsultationService.getUserToken(),
      'accept-language': this.locale,
      'Content-Type': 'application/json'
    });

    const options = new RequestOptions({ headers: headers }); // Create a request option

    return this._http.get(this.enviromment.apiUrl + 'chat/contact/' + user, options)
      .map(res => res.json())
      .takeWhile(() => this.killAll)
      .catch(err => Observable.throw(err.json().error || 'Server error'));
  }

  addContacts(data) {
    const headers = new Headers({
      Authorization: 'Bearer ' + this._chatboxConsultationService.getUserToken(),
      'accept-language': this.locale,
      'Content-Type': 'application/json'
    });

    const options = new RequestOptions({ headers: headers }); // Create a request option
    const req = {
      'data': data
    };

    return this._http.post(this.enviromment.apiUrl + 'chat/contact/new', JSON.stringify(req), options)
      .map(res => res.json())
      .takeWhile(() => this.killAll)
      .catch(err => Observable.throw(err.json().error || 'Server error'));
  }
}
