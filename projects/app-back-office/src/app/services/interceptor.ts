import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';

import { HyperToastsService, HyperCookieService } from 'lib-services';
import { environment } from '@env/app-back-office';
import { SharedService } from '@app-back-office/services/shared.service';

import * as jwt_decode from 'jwt-decode';

@Injectable()
export class Interceptor implements HttpInterceptor {

    public userNameCompany: string;

    constructor(
        private _hyperCookieService: HyperCookieService,
        private _hyperToastsService: HyperToastsService,
        private _sharedService: SharedService,
        private router: Router
    ) {


    }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // console.log(request);

        if (request.headers.get('Authorization')) {
            // teste se JWT expirou

            const token = this._sharedService.getUserToken();

            const decoded = jwt_decode(token);
            //console.log(decoded.exp);

            const dateAtual = new Date(new Date().toUTCString()).toLocaleString();
            //console.log(dateAtual);

            const dateToken = new Date(decoded.exp * 1000).toLocaleString();
            //console.log(dateToken);

            if (dateToken === undefined) {
                this._hyperToastsService.addToast('warn', 'Atenção', 'Você não tem acesso a esta área!');
                this._sharedService.deleteAllCookies();
                this.router.navigate(['office/login']);
            } else {
                if (dateAtual > dateToken) {
                    this._hyperToastsService.addToast('warn', 'Atenção', 'Você não tem acesso a esta área!');
                    this._sharedService.deleteAllCookies();
                    this.router.navigate(['office/login']);
                }
            }

        }

        return next.handle(request).do((event: HttpEvent<any>) => {
            if (event instanceof HttpResponse) {
                // do stuff with response if you want

                if (request.url.indexOf(environment.apiUrl) !== -1) {
                    const newJWT = event.body.JWT;
                    if (newJWT) {
                        const auxDefault = this._hyperCookieService.getCookie_GENERIC(environment.defaultCookieName);
                        const auxExtra = this._hyperCookieService.getCookie_GENERIC(environment.youhubCookieName);

                        if (auxDefault) {
                            auxDefault.JWT = newJWT;
                            this._hyperCookieService.setCookie_GENERIC(auxDefault, environment.defaultCookieName);
                        }

                        if (auxExtra) {
                            auxExtra.JWT = newJWT;
                            this._hyperCookieService.setCookie_GENERIC(auxExtra, environment.youhubCookieName);
                        }
                    }
                }
            }
        }, (err: any) => {
            if (err instanceof HttpErrorResponse) {
                if (err.status === 401) {

                    this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro inesperado. Atualize a página e tente novamente');
                    this._sharedService.deleteAllCookies();
                    this.router.navigate(['office/login']); // redirect to the login route
                }
                if (err.status === 408) {

                    this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro inesperado. Atualize a página e tente novamente');
                    this._sharedService.deleteAllCookies();
                    this.router.navigate(['office/login']); // redirect to the login route
                }
            }
        });
    }

}
