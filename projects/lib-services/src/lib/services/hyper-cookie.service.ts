import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CookiesService, CookiesOptions } from '@ngx-utils/cookies';

const IP = /\b((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\.|$)){4}\b/;

@Injectable({
    providedIn: 'root'
})
export class HyperCookieService {
    public cookieOptions: CookiesOptions;

    private expireCookie = new Date();
    private shopCartCookieName = 'hj-shopcart';
    private languageCookieName = 'hj-language';
    private favoritesCookieName = 'hj-favorites';
    private affiliatedCookieName = 'hj-affiliated';
    private authCookieName = 'youhub';
    private domainCookie = '.youhub.com.br';

    constructor(
        @Inject(PLATFORM_ID) private platformId: Object,
        @Inject('environments') private environments: any,
        private _cookiesService: CookiesService
    ) {
        this.shopCartCookieName = this.environments.shopCartCookieName ? this.environments.shopCartCookieName : 'hj-shopcart';
        this.languageCookieName = this.environments.languageCookieName ? this.environments.languageCookieName : 'hj-language';
        this.favoritesCookieName = this.environments.favoritesCookieName ? this.environments.favoritesCookieName : 'hj-favorites';
        this.affiliatedCookieName = this.environments.affiliatedCookieName ? this.environments.affiliatedCookieName : 'hj-affiliated';
        this.authCookieName = this.environments.authCookieName ? this.environments.authCookieName : 'youhub';
        this.domainCookie = this.environments.domainCookie ? this.environments.domainCookie : '.youhub.com.br';

        this.initCookie();
    }

    initCookie() {
        if (isPlatformBrowser(this.platformId)) {
            this.cookieOptions = {
                expires: this.expireCookie,
                domain: window.location.hostname === 'localhost' || IP.test(window.location.hostname) ? window.location.hostname : this.domainCookie,
                path: '/',
                secure: false,
                httpOnly: false
            };
        }
    }

    mountConcatName(cnt) {
        return cnt === '' ? '' : ('-' + cnt);
    }

    // REMOVE TODOS OS COOKIES EXISTENTES*********************************************************
    deleteAllCookies() {
        this._cookiesService.removeAll();
    }

    // COOKIE DE AUTENTICAÇÃO*********************************************************************
    setCookie_AUTH(cookieVal) {
        if (isPlatformBrowser(this.platformId)) {
            const dateNow = new Date();
            this.expireCookie.setTime(this.expireCookie.getTime() + (10 * 365 * 24 * 60 * 60 * 1000));
            this.cookieOptions.expires = this.expireCookie;
            this._cookiesService.putObject(this.authCookieName, cookieVal, this.cookieOptions);
        }
    }
    getCookie_AUTH(): any {
        if (isPlatformBrowser(this.platformId)) {
            return this._cookiesService.getObject(this.authCookieName);
        }
        return undefined;
    }
    deleteCookie_AUTH() {
        if (isPlatformBrowser(this.platformId)) {
            this._cookiesService.remove(this.authCookieName, { domain: this.cookieOptions.domain });
        }
    }


    // COOKIE DE CARRINHO DE COMPRA***************************************************************
    setCookie_SHOPCART(cookieVal, concatName = '') {
        if (isPlatformBrowser(this.platformId)) {
            const dateNow = new Date();
            // this.expireCookie.setTime(this.expireCookie.getTime() + (10 * 365 * 24 * 60 * 60 * 1000));
            this.expireCookie.setTime(dateNow.getTime() + 43200000);
            this.cookieOptions.expires = this.expireCookie;
            this._cookiesService.putObject(this.shopCartCookieName + this.mountConcatName(concatName), cookieVal, this.cookieOptions);
        }
    }
    getCookie_SHOPCART(concatName = ''): any {
        if (isPlatformBrowser(this.platformId)) {
            return this._cookiesService.getObject(this.shopCartCookieName + this.mountConcatName(concatName));
        }
        return undefined;
    }
    deleteCookie_SHOPCART(concatName = '') {
        if (isPlatformBrowser(this.platformId)) {
            this._cookiesService.remove(this.shopCartCookieName + this.mountConcatName(concatName), { domain: this.cookieOptions.domain });
        }
    }


    // COOKIE DE PRODUTOS FAVORITOS****************************************************************
    setCookie_FAVORITES(cookieVal, concatName = '') {
        if (isPlatformBrowser(this.platformId)) {
            const dateNow = new Date();
            this.expireCookie.setTime(this.expireCookie.getTime() + (10 * 365 * 24 * 60 * 60 * 1000));
            this.cookieOptions.expires = this.expireCookie;
            this._cookiesService.putObject(this.favoritesCookieName + this.mountConcatName(concatName), cookieVal, this.cookieOptions);
        }
    }
    getCookie_FAVORITES(concatName = ''): any {
        if (isPlatformBrowser(this.platformId)) {
            return this._cookiesService.getObject(this.favoritesCookieName + this.mountConcatName(concatName));
        }
        return undefined;
    }
    deleteCookie_FAVORITES(concatName = '') {
        if (isPlatformBrowser(this.platformId)) {
            this._cookiesService.remove(this.favoritesCookieName + this.mountConcatName(concatName), { domain: this.cookieOptions.domain });
        }
    }


    // COOKIE DE IDIOMA****************************************************************************
    setCookie_LANGUAGE(cookieVal, concatName = '') {
        if (isPlatformBrowser(this.platformId)) {
            const dateNow = new Date();
            this.expireCookie.setTime(this.expireCookie.getTime() + (10 * 365 * 24 * 60 * 60 * 1000));
            this.cookieOptions.expires = this.expireCookie;
            this._cookiesService.putObject(this.languageCookieName + this.mountConcatName(concatName), cookieVal, this.cookieOptions);
        }
    }
    getCookie_LANGUAGE(concatName = ''): any {
        if (isPlatformBrowser(this.platformId)) {
            return this._cookiesService.getObject(this.languageCookieName + this.mountConcatName(concatName));
        }
        return undefined;
    }
    deleteCookie_LANGUAGE(concatName = '') {
        if (isPlatformBrowser(this.platformId)) {
            this._cookiesService.remove(this.languageCookieName + this.mountConcatName(concatName), { domain: this.cookieOptions.domain });
        }
    }


    // COOKIE DE AFILIADOS*************************************************************************
    setCookie_AFFILIATED(cookieVal, concatName = '') {
        if (isPlatformBrowser(this.platformId)) {
            const dateNow = new Date();
            this.expireCookie.setTime(this.expireCookie.getTime() + (24 * 60 * 60 * 1000));
            this.cookieOptions.expires = this.expireCookie;
            this._cookiesService.putObject(this.affiliatedCookieName + this.mountConcatName(concatName), cookieVal, this.cookieOptions);
        }
    }
    getCookie_AFFILIATED(concatName = ''): any {
        if (isPlatformBrowser(this.platformId)) {
            return this._cookiesService.getObject(this.affiliatedCookieName + this.mountConcatName(concatName));
        }
        return undefined;
    }
    deleteCookie_AFFILIATED(concatName = '') {
        if (isPlatformBrowser(this.platformId)) {
            this._cookiesService.remove(this.affiliatedCookieName + this.mountConcatName(concatName), { domain: this.cookieOptions.domain });
        }
    }

    // COOKIE GENÉRICO*************************************************************************
    setCookie_GENERIC(cookieVal, cookieName) {
        if (isPlatformBrowser(this.platformId)) {
            const dateNow = new Date();
            this.expireCookie.setTime(this.expireCookie.getTime() + (24 * 60 * 60 * 1000));
            this.cookieOptions.expires = this.expireCookie;
            this._cookiesService.putObject(cookieName, cookieVal, this.cookieOptions);
        }
    }
    getCookie_GENERIC(cookieName): any {
        if (isPlatformBrowser(this.platformId)) {
            return this._cookiesService.getObject(cookieName);
        }
        return undefined;
    }
    deleteCookie_GENERIC(cookieName) {
        if (isPlatformBrowser(this.platformId)) {
            this._cookiesService.remove(cookieName, { domain: this.cookieOptions.domain });
        }
    }
}
