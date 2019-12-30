import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from '@env/app-lps';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor(
    private _httpClient: HttpClient,

  ) { }


  // salva leads**************************
  sendLeads(lead): any {
    const httpOptions = {
      headers: new HttpHeaders()
        .set('accept-language', 'pt-BR')
        .set('Content-Type', 'application/json')
    };
    return this._httpClient.post(environment.apiPhpV2 + 'lead', lead, httpOptions);
  }

}
