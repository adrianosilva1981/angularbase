import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '@env/app-back-office';
import { HyperCookieService, HyperToastsService } from 'lib-services';

@Injectable({
    providedIn: 'root'
})
export class SharedService {

    constructor(
        private _hyperCookieService: HyperCookieService,
        private _http: HttpClient,
        private _router: Router,
        private _hyperToastsService: HyperToastsService
    ) { }

    deleteAllCookies() {
        this._hyperCookieService.deleteCookie_GENERIC(environment.defaultCookieName);
        this._hyperCookieService.deleteCookie_GENERIC(environment.youhubCookieName);
        // this._hyperCookieService.deleteAllCookies();
    }

    //Retorna o token do usuário no cookie****************************************
    getUserToken() {
        const aux = this._hyperCookieService.getCookie_GENERIC(environment.defaultCookieName);
        if (aux && Object(aux.JWT)) {
            return aux.JWT;
        }
        this._hyperToastsService.addToast('warn', 'Atenção', 'Sua Sessão expirou, faça login novamente!');
        this._router.navigate(['office/login']);
    }

    getCookieReseller() {
        const aux = this._hyperCookieService.getCookie_GENERIC(environment.defaultCookieName);
        if (aux) {
            return aux;
        }
        this._hyperToastsService.addToast('warn', 'Atenção', 'Sua Sessão expirou, faça login novamente!');
        this._router.navigate(['office/login']);
    }

    login(slug, email, password) {
        return this._http.get<any>(environment.apiUrl + '/reseller/login/' + slug + '/' + email + '/' + password);
    }

    logout() {
        this.deleteAllCookies();
        this._router.navigate(['office/login']);
    }

    getCEP(cep) {
        const header = new HttpHeaders().set('Content-Type', 'application/json').set('Accept-Language', 'pt-BR');
        return this._http.get<any>(environment.apiUrl + '/shared/cep/' + cep, { headers: header });
    }


    updateReseller(objreseller) {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.put<any>(environment.apiUrl + '/reseller/update', objreseller, { headers: header });
    }

    getImages(type: string) {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR');
        return this._http.get<any>(environment.apiUrl + '/shared/getImages/' + type, { headers: header });
    }

    getDocuments() {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.get<any>(environment.apiUrl + '/shared/getDocuments', { headers: header });
    }

    updatePhotoProfile(objPhoto) {
        const header = new HttpHeaders()
            //  .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.post<any>(environment.apiUrl + '/reseller/update-photo-profile', objPhoto, { headers: header });
    }

    validateImageDocument(objPhoto) {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.post<any>(environment.apiUrl + '/reseller/documents/upload', objPhoto, { headers: header });
    }

    registerReseller(objreseller) {
        const header = new HttpHeaders()
            // .set('deploy', 'true')
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.put<any>(environment.apiUrl + '/reseller/complete-register', objreseller, { headers: header });
    }

    preRegisterReseller(objreseller) {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR');
        return this._http.post<any>(environment.apiUrl + '/reseller/pre-register', objreseller, { headers: header });
    }

    validadeReseller(userNameReseller, slug) {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR');
        return this._http.get<any>(environment.apiUrl + '/reseller/validate/username/' + userNameReseller + '/' + slug, { headers: header });
    }

    getAccesPlans(slug) {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR');
        return this._http.get<any>(environment.apiUrl + '/business/plans/' + slug, { headers: header });
    }

    getInfoPlan(idPlan, slug, voucher) {
        let numberVoucher = '';
        if (voucher !== '') {
            numberVoucher = '/' + voucher;
        }
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR');
        return this._http.get<any>(environment.apiUrl + '/business/plan/' + slug + '/' + idPlan + numberVoucher, { headers: header });
    }

    getPlansUpgrade(slug) {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.get<any>(environment.apiUrl + '/business/upgrade/plans/' + slug, { headers: header });
    }

    accessPlanCheckout(objcheckout) {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.post<any>(environment.apiUrl + '/checkout/plan/new', objcheckout, { headers: header });
    }

    upgradePlanCheckout(objcheckout) {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.post<any>(environment.apiUrl + '/checkout/plan/upgrade', objcheckout, { headers: header });
    }

    getMyCards() { // cartoes de credito cadastrados
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.get<any>(environment.apiUrl + '/checkout/my-credit-cards', { headers: header });
    }

    // metodo para testes - nao faz checkout real
    accessCheckout1(objcheckout) {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.post<any>(environment.apiUrl + '/reseller/checkout1', objcheckout, { headers: header });
    }

    addLeads(leadsArray) {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.post<any>(environment.apiUrl + '/reseller/leads', leadsArray, { headers: header });
    }

    getLeads(search) {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.get<any>(environment.apiUrl + '/reseller/leads' + search, { headers: header });
    }

    removeLead(id) {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.delete<any>(environment.apiUrl + '/reseller/lead/' + id, { headers: header });
    }

    updateLeads(lead) {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.put<any>(environment.apiUrl + '/reseller/lead', lead, { headers: header });
    }

    sendMail(obj) {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.post<any>(environment.apiUrl + '/reseller/email', obj, { headers: header });
    }

    validVoucher(voucher, slug) {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.get<any>(environment.apiUrl + '/business/plans/voucher/validate/' + slug + '/' + voucher, { headers: header });
    }

    getCompanies() {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR');
        return this._http.get<any>(environment.apiUrl + '/business', { headers: header });
    }

    getinfoResseler() {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.get<any>(environment.apiUrl + '/reseller', { headers: header });
    }

    getExtract(page, rowsperpage, type_balance, days_period, type_bonus) {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.get<any>(environment.apiUrl + '/reseller/extract/point/' + page + '/' + rowsperpage + '/' + type_balance + '/' + days_period + '/' + type_bonus, { headers: header });
    }

    getteam(type, id, username) {
        let parUsername = '';
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        if (username != '') {
            parUsername = '/' + username;
        } else {
            parUsername = '';
        }
        return this._http.get<any>(environment.apiUrl + '/reseller/team/' + type + '/' + id + parUsername, { headers: header });
    }

    getDashBoard() {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.get<any>(environment.apiUrl + '/reseller/dashboard/info', { headers: header });
    }

    forgotPassword(obj) {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR');

        return this._http.post<any>(environment.apiUrl + '/reseller/forgotpassword', obj, { headers: header });
    }

    resetPassword(obj) {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR');
        return this._http.post<any>(environment.apiUrl + '/reseller/resetpassword', obj, { headers: header });
    }

    NewCounterSign(obj) {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR');
        return this._http.post<any>(environment.apiUrl + '/reseller/newcountersign', obj, { headers: header });
    }

    forgotCounterSign(obj) {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.post<any>(environment.apiUrl + '/reseller/forgotcountersign', obj, { headers: header });
    }

    removeCard(id) {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.delete<any>(environment.apiUrl + '/checkout/delete/credit-card/' + id, { headers: header });
    }

    getUrlBillet(type) {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        type = type ? '/' + type : '';
        return this._http.get<any>(environment.apiUrl + '/checkout/plan/billets' + type, { headers: header });
    }

    postAssociation(obj) {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.post<any>(environment.apiUrl + '/checkout/buy/association', obj, { headers: header });
    }

    getAssociation() {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.get<any>(environment.apiUrl + '/checkout/buy/association', { headers: header });
    }

    getpackages(type) {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.get<any>(environment.apiUrl + '/checkout/packages/' + type, { headers: header });
    }

    checkreseller() {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.put(environment.apiUrl + '/reseller/check', {}, { headers: header });
    }

    //recaptcha********************************************************************
    reCaptcha(data) {
        const headers = new HttpHeaders()
            .set('accept-language', 'pt-BR')
            .set('Content-Type', 'application/json');
        return this._http.put(environment.apiPhp + 'shared/recaptcha', data, { headers: headers });
    }

    getEvents() {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.get<any>(environment.apiUrl + '/event/list', { headers: header });
    }

    postCheckoutEvent(obj) {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.post<any>(environment.apiUrl + '/checkout/event/ticket', obj, { headers: header });
    }

    getVoucherResseler() {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.get<any>(environment.apiUrl + '/checkout/voucher', { headers: header });
    }

    getPrepaid() {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.get<any>(environment.apiUrl + '/checkout/card/prepaid', { headers: header });
    }

    postPrepaid(obj) {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.post<any>(environment.apiUrl + '/checkout/card/prepaid', obj, { headers: header });
    }

    getRescue() {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.get<any>(environment.apiUrl + '/checkout/rescue', { headers: header });
    }

    postRescue(obj) {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.post<any>(environment.apiUrl + '/checkout/rescue', obj, { headers: header });
    }

    getCredit() {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.get<any>(environment.apiUrl + '/reseller/points', { headers: header });
    }

    postWallet(obj) {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.post<any>(environment.apiUrl + '/reseller/wallet', obj, { headers: header });
    }

    postAccount(obj) {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.post<any>(environment.apiUrl + '/reseller/account', obj, { headers: header });
    }

    // UPLOAD IMAGENS
    postImageS3(path, file, urlApi): any {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('path', path);

        const headers = new HttpHeaders()
            .set('accept-language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());

        return this._http.post(environment.apiPhpV2, formData, { headers: headers });
    }

    getPurchase() {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.get<any>(environment.apiUrl + '/checkout/purchase', { headers: header });
    }

    getinfoUnilevel() {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.get<any>(environment.apiUrl + '/reseller/info/unilevel', { headers: header });
    }

    monthlyCheckout(objcheckout) {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.post<any>(environment.apiUrl + '/checkout/subscriber', objcheckout, { headers: header });
    }

    getVouchersPrime() {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.get<any>(environment.apiUrl + '/reseller/vouchers', { headers: header });
    }

    getVouchersSmart() {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.get<any>(environment.apiUrl + '/reseller/vouchers/smart', { headers: header });
    }

    getGoogleAuthenticator() {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.get<any>(environment.apiUrl + '/reseller/googleAuthenticator', { headers: header });
    }

    getGraduate() {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.get<any>(environment.apiUrl + '/reseller/graduation', { headers: header });
    }

    getInfoPayments(method, type) {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.get<any>(environment.apiUrl + '/reseller/payments/' + method + '/' + type, { headers: header });
    }

    solicitationFinancing(objcheckout) {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());

        return this._http.post<any>(environment.apiUrl + '/checkout/financing', objcheckout, { headers: header });
    }

    getFlagFinance() {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.get<any>(environment.apiUrl + '/reseller/financing', { headers: header });
    }

    /* info de financiamento do associado */
    getInfoFinance(id = null) {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        if (id) {
            return this._http.get<any>(environment.apiUrl + '/checkout/financing/' + id, { headers: header });
        } else {
            return this._http.get<any>(environment.apiUrl + '/checkout/financing', { headers: header });
        }
    }

    /* info cauculo/parcelas de financiamento */
    getFinance(obj) {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR');
        return this._http.post<any>(environment.apiUrl + '/checkout/financing/installment', obj, { headers: header });
    }

    accessFinancingCheckout(obj) {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.post<any>(environment.apiUrl + '/checkout/financing', obj, { headers: header });
    }

    completedQuestionnaire(control, reseller) {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());

        return this._http.get<any>(environment.apiPhp + 'questionnaire/completed/youhub/' + control + '/' + reseller, { headers: header });
    }

    getLegDetails(obj) {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());

        return this._http.post<any>(environment.apiUrl + '/reseller/leg-details', obj, { headers: header });
    }

    getListResellerPerAction(obj) {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());

        return this._http.post<any>(environment.apiUrl + '/reseller/list-per-action', obj, { headers: header });
    }

    moveNetConnection(obj) {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());

        return this._http.post<any>(environment.apiUrl + '/reseller/move-net-connection', obj, { headers: header });
    }

    changeNetConnection(obj) {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());

        return this._http.post<any>(environment.apiUrl + '/reseller/change-net-connection', obj, { headers: header });
    }

    validateCounterSign(pass) {
        const body = {
            counter_sign: pass
        };

        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());

        return this._http.post<any>(environment.apiUrl + '/reseller/validate-countersign', body, { headers: header });
    }

    getbonus(period, year) {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.get<any>(environment.apiUrl + '/reseller/bonus/' + period + '/' + year, { headers: header });
    }

    listPreRegister() {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.get<any>(environment.apiUrl + '/reseller/list-pre-register', { headers: header });
    }

    getListChilds(reseller = '') {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.get<any>(environment.apiUrl + '/reseller/get-list-childs' + (reseller ? '/' + reseller : ''), { headers: header });
    }

    netReportExcel() {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.get<any>(environment.apiUrl + '/reseller/net-report-excel', { headers: header });
    }

    galaxiaRegister(obj) {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR');

        return this._http.post<any>(environment.apiUrl + '/galaxia/register', obj, { headers: header });
    }

    galaxiaLogin(obj) {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR');

        return this._http.post<any>(environment.apiUrl + '/galaxia/login', obj, { headers: header });
    }

    getTravelPoint() {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.get<any>(environment.apiUrl + '/reseller/travelpoints', { headers: header });
    }

    getListInactive() {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.get<any>(environment.apiUrl + '/reseller/listinactive', { headers: header });
    }

    getTypeManager() {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.get<any>(environment.apiUrl + '/reseller/typemanager', { headers: header });
    }

    getOverdueParcel(typemanager) {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.get<any>(environment.apiUrl + '/reseller/overdueparcel/' + typemanager, { headers: header });
    }

    getFindersFee(ano, mes, page, count) {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.get<any>(environment.apiUrl + '/reseller/findersfee/' + ano + '/' + mes + '/' + page + '/' + count, { headers: header });
    }

    // Ads Plans
    getAdsPlans() {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR');
        return this._http.get<any>(environment.apiPhpV2 + 'publicity/plans/office', { headers: header });
    }

    getNotificationsDebits() {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.get<any>(environment.apiUrl + '/reseller/notifications/debits', { headers: header });
    }


    addUserAds(data: any) {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());

        return this._http.post<any>(environment.apiPhpV2 + 'publicity/add-user-social', data, { headers: header });
    }


    getUserSocial(id: any) {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());

        return this._http.get<any>(environment.apiPhpV2 + 'publicity/user-social/' + id, { headers: header });
    }

    listAdsToUser(id: any, socialNet: String): any {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());

        return this._http.get<any>(environment.apiPhpV2 + 'publicity/office/user-ads/' + id + '/' + socialNet, { headers: header });
    }

    addSharePrint(data: any): any {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());

        return this._http.post<any>(environment.apiPhpV2 + 'publicity/office/add-print', data, { headers: header });
    }
}
