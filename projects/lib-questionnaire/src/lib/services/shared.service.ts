import { Injectable, Inject } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { HyperCookieService, CheckoutParameter } from 'lib-services';

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

  registerContent(data): any {
    const headers = new HttpHeaders()
      .set('accept-language', this.locale)
      .set('Content-Type', 'application/json');
    //.set('Authorization', 'Bearer ' + this.getUserToken());

    return this._httpClient.post(this.environments.apiPhp + 'questionnaire', data, { headers: headers });
  }

  verifyQuestionnaire(id, type, relation = '0'): any {
    const headers = new HttpHeaders()
      .set('accept-language', this.locale)
      .set('Content-Type', 'application/json');
    //.set('Authorization', 'Bearer ' + this.getUserToken());

    return this._httpClient.get(this.environments.apiPhp + 'questionnaire/verify/' + id + '/' + type + '/' + relation, { headers: headers });
  }

  updateContent(data): any {
    const headers = new HttpHeaders()
      .set('accept-language', this.locale)
      .set('Content-Type', 'application/json');
    //.set('Authorization', 'Bearer ' + this.getUserToken());

    return this._httpClient.put(this.environments.apiPhp + 'questionnaire', data, { headers: headers });
  }

  deleteContent(id_questionnaire): any {
    const headers = new HttpHeaders()
      .set('accept-language', this.locale)
      .set('Content-Type', 'application/json');
    //.set('Authorization', 'Bearer ' + this.getUserToken());

    return this._httpClient.delete(this.environments.apiPhp + 'questionnaire/' + id_questionnaire, { headers: headers });
  }

  registerQuestion(data): any {
    const headers = new HttpHeaders()
      .set('accept-language', this.locale)
      .set('Content-Type', 'application/json');
    //.set('Authorization', 'Bearer ' + this.getUserToken());

    return this._httpClient.post(this.environments.apiPhp + 'questionnaire/quiz', data, { headers: headers });
  }

  getAllQuiz(id_questionnaire): any {
    const headers = new HttpHeaders()
      .set('accept-language', this.locale)
      .set('Content-Type', 'application/json');
    //.set('Authorization', 'Bearer ' + this.getUserToken());

    return this._httpClient.get(this.environments.apiPhp + 'questionnaire/quiz/' + id_questionnaire, { headers: headers });
  }

  getQuizDetails(id_quiz): any {
    const headers = new HttpHeaders()
      .set('accept-language', this.locale)
      .set('Content-Type', 'application/json');
    //.set('Authorization', 'Bearer ' + this.getUserToken());

    return this._httpClient.get(this.environments.apiPhp + 'questionnaire/quiz/details/' + id_quiz, { headers: headers });
  }

  updateQuestion(data): any {
    const headers = new HttpHeaders()
      .set('accept-language', this.locale)
      .set('Content-Type', 'application/json');
    //.set('Authorization', 'Bearer ' + this.getUserToken());

    return this._httpClient.put(this.environments.apiPhp + 'questionnaire/quiz', data, { headers: headers });
  }

  deleteQuestion(id_quiz): any {
    const headers = new HttpHeaders()
      .set('accept-language', this.locale)
      .set('Content-Type', 'application/json');
    //.set('Authorization', 'Bearer ' + this.getUserToken());

    return this._httpClient.delete(this.environments.apiPhp + 'questionnaire/quiz/' + id_quiz, { headers: headers });
  }

  sendAnswers(data): any {
    const headers = new HttpHeaders()
      .set('accept-language', this.locale)
      .set('Content-Type', 'application/json');
    //.set('Authorization', 'Bearer ' + this.getUserToken());

    return this._httpClient.post(this.environments.apiPhp + 'questionnaire/answers', data, { headers: headers });
  }

  getAnswers(id_questionnaire, relation): any {
    const headers = new HttpHeaders()
      .set('accept-language', this.locale)
      .set('Content-Type', 'application/json');
    //.set('Authorization', 'Bearer ' + this.getUserToken());

    return this._httpClient.get(this.environments.apiPhp + 'questionnaire/answers/' + id_questionnaire + '/' + relation, { headers: headers });
  }

  getAllQuizRaffle(id_questionnaire): any {
    const headers = new HttpHeaders()
      .set('accept-language', this.locale)
      .set('Content-Type', 'application/json');
    //.set('Authorization', 'Bearer ' + this.getUserToken());

    return this._httpClient.get(this.environments.apiPhp + 'questionnaire/quiz/raffle/' + id_questionnaire, { headers: headers });
  }
}
