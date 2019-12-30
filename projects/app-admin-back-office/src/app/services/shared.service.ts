import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { HyperCookieService } from 'lib-services';
import { MenuItem } from 'primeng/components/common/menuitem';
import { Router } from '@angular/router';
import { environment } from '@env/app-admin-back-office';

@Injectable({
    providedIn: 'root'
})
export class SharedService {

    public items: MenuItem[] = [];

    constructor(
        private http: HttpClient,
        private _hyperCookieService: HyperCookieService,
        private _router: Router,
        private _http: HttpClient,
    ) { }

    getUserObject() {
        const cookieVal = this._hyperCookieService.getCookie_GENERIC(environment.nameCookie);

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

    getUserPermissions() {
        const cookieVal = this._hyperCookieService.getCookie_GENERIC(environment.nameCookie);

        if (cookieVal && Object(cookieVal.data)) {
            return cookieVal.permissions;
        } else {
            return [];
        }

    }

    login(objlogin) {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR');
        return this._http.post<any>(environment.apiPhp + 'adminserv/login', objlogin, { headers: header });
    }

    logout() {
        this._hyperCookieService.deleteCookie_GENERIC(environment.nameCookie);
        this._router.navigate(['login']);
    }

    getAssociatesPendingApproval() {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.get<any>(environment.apiPhp + 'reseller/getunactivateduser', { headers: header });
    }

    getQualification() {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.get<any>(environment.apiPhp + 'reseller/qualification', { headers: header });
    }

    getAssociatesPrepaidCard() {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.get<any>(environment.apiPhp + 'reseller/getAssociatesPrepaidCard', { headers: header });
    }

    getAssociateByUsername(username: string) {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.get<any>(environment.apiPhp + 'reseller/getByUsername/' + username, { headers: header });
    }

    getSummary(data: { option: number, startDate: string, endDate: string }) {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.post<any>(environment.apiPhp + 'infoAdm/getSummary', data, { headers: header });
    }

    getSummaryConnections(data: { startDate: string, endDate: string }) {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.post<any>(environment.apiPhp + 'infoAdm/getSummaryConnections', data, { headers: header });
    }

    getSummaryDetailsConnections(data: { method: string, startDate: string, endDate: string }) {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.post<any>(environment.apiPhp + 'infoAdm/getSummaryDetailsConnections', data, { headers: header });
    }

    getSummaryPreRegistration(data: { startDate: string, endDate: string }) {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.post<any>(environment.apiPhp + 'infoAdm/getSummaryPreRegistration', data, { headers: header });
    }


    getSummaryMonthly(data: { startDate: string, endDate: string }) {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.post<any>(environment.apiPhp + 'infoAdm/getSummaryMonthly', data, { headers: header });
    }

    getSummaryDetailsMonthly(data: { option: string, startDate: string, endDate: string }) {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.post<any>(environment.apiPhp + 'infoAdm/getSummaryDetailsMonthly', data, { headers: header });
    }

    getSummaryConsumption(data: { startDate: string, endDate: string }) {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.post<any>(environment.apiPhp + 'infoAdm/getSummaryConsumption', data, { headers: header });
    }

    getSummaryDetailsConsumption(data: { startDate: string, endDate: string }) {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.post<any>(environment.apiPhp + 'infoAdm/getSummaryDetailsConsumption', data, { headers: header });
    }

    getSummaryFinancing(data: { startDate: string, endDate: string }) {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.post<any>(environment.apiPhp + 'infoAdm/getSummaryFinancing', data, { headers: header });
    }

    getSummaryGraduation(data: { startDate: string, endDate: string }) {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.post<any>(environment.apiPhp + 'infoAdm/getSummaryGraduation', data, { headers: header });
    }

    getSummaryRescue(data: { startDate: string, endDate: string }) {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.post<any>(environment.apiPhp + 'infoAdm/getSummaryRescue', data, { headers: header });
    }

    getSummaryQuotas(data: { startDate: string, endDate: string }) {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.post<any>(environment.apiPhp + 'infoAdm/getSummaryQuotas', data, { headers: header });
    }

    getSummaryTicketsKits(data: { startDate: string, endDate: string }) {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.post<any>(environment.apiPhp + 'infoAdm/getSummaryTicketsKits', data, { headers: header });
    }

    getSummaryGrids(data: { startDate: string, endDate: string }) {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.post<any>(environment.apiPhp + 'infoAdm/getSummaryGrids', data, { headers: header });
    }

    getSummaryDetailsGrids(data: { idGrid: number, startDate: string, endDate: string }) {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.post<any>(environment.apiPhp + 'infoAdm/getSummaryDetailsGrids', data, { headers: header });
    }

    getFinancing() {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.get<any>(environment.apiPhp + 'reseller/getFinancing', { headers: header });
    }

    getExtractInfoAdm() {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.get<any>(environment.apiPhp + 'reseller/getExtractInfoAdm', { headers: header });
    }

    getInfoFinancingAssociate(username: string) {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.get<any>(environment.apiPhp + 'reseller/getInfoFinancingAssociate/' + username, { headers: header });
    }

    setFinancingAssociate(data: any) {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.post<any>(environment.apiPhp + 'reseller/setFinancingAssociate', data, { headers: header });
    }


    getInfoFinancingPlots(username: string) {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.get<any>(environment.apiPhp + 'reseller/getInfoFinancingPlots/' + username, { headers: header });
    }

    setPaymentFinancingPlots(data: any) {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.post<any>(environment.apiPhp + 'reseller/setPaymentFinancingPlots', data, { headers: header });
    }

    setFinancing(data) {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.post<any>(environment.apiPhp + 'reseller/setFinancing', data, { headers: header });
    }

    setFinancingFlags(data) {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());

        return this._http.post<any>(environment.apiPhp + 'reseller/setFinancingFlags', data, { headers: header });
    }

    getAssociateByCities(data) {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.post<any>(environment.apiPhp + 'reseller/getAssociateByCities', data, { headers: header });
    }

    getCitiesByState(data) {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.get<any>(environment.apiPhp + 'reseller/getCitiesByState/' + data, { headers: header });
    }

    getListAssociates(query: string = null) {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.get<any>(environment.apiPhp + 'reseller/getList' + (query ? '/' + query : ''), { headers: header });
    }

    getPaymentRequestAssociates(query: string = null) {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.get<any>(environment.apiPhp + 'reseller/getPaymentRequestAssociates' + (query ? '/' + query : ''), { headers: header });
    }

    getConnectionRequestAssociates(query: string = null) {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.get<any>(environment.apiPhp + 'reseller/getConnectionRequestAssociates' + (query ? '/' + query : ''), { headers: header });
    }

    getMonthlyAssociates(query: string = null) {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.get<any>(environment.apiPhp + 'reseller/getMonthlyAssociates' + (query ? '/' + query : ''), { headers: header });
    }

    getInfoMembershipPaymentRequest(username: string) {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.get<any>(environment.apiPhp + 'reseller/getInfoMembershipPaymentRequest/' + username, { headers: header });
    }

    getInfoMonthlyAssociate(username: string) {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.get<any>(environment.apiPhp + 'reseller/getInfoMonthlyAssociate/' + username, { headers: header });
    }

    getInfoConnectionRequestAssociate(username: string) {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.get<any>(environment.apiPhp + 'reseller/getInfoConnectionRequestAssociate/' + username, { headers: header });
    }

    setMembershipPaymentRequest(data: any) {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.post<any>(environment.apiPhp + 'reseller/setMembershipPaymentRequest', data, { headers: header });
    }

    setFinancingRequest(data: any) {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.post<any>(environment.apiPhp + 'reseller/setFinancingRequest', data, { headers: header });
    }

    setConnectionRequestAssociate(data: any) {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.post<any>(environment.apiPhp + 'reseller/setConnectionRequestAssociate', data, { headers: header });
    }

    setMonthlyRequest(data: any) {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.post<any>(environment.apiPhp + 'reseller/setMonthlyRequest', data, { headers: header });
    }

    getFirstPlotsFinancing(query: string = null) {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.get<any>(environment.apiPhp + 'reseller/getFirstPlotsFinancing' + (query ? '/' + query : ''), { headers: header });
    }

    getAssociatesFinancing(query: string = null) {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.get<any>(environment.apiPhp + 'reseller/getAssociatesFinancing' + (query ? '/' + query : ''), { headers: header });
    }

    getListBalance(query: string = null) {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.get<any>(environment.apiPhp + 'reseller/balance' + (query ? '/' + query : ''), { headers: header });
    }

    getListBalanceDetail(_id) {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.get<any>(environment.apiPhp + 'reseller/points/' + _id, { headers: header });
    }

    getListAssociatesRequestDischarge(data = null) {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.post<any>(environment.apiPhp + 'adminserv/getrescuerequest', data, { headers: header });
    }

    getManuallyActivatedAssociates() {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.get<any>(environment.apiPhp + 'reseller/getmanuallyactivateduser', { headers: header });
    }

    getListAssociatesByDate(data) {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.put<any>(environment.apiPhp + 'adminserv/report-amountregistrationbydate', data, { headers: header });
    }

    getListDischargeAssociatesByDate(data) {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.put<any>(environment.apiPhp + 'adminserv/report-rescuerequestbydate', data, { headers: header });
    }

    getListBonificationsAssociatesByDate(data) {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.put<any>(environment.apiPhp + 'adminserv/report-bonusrequestbydate', data, { headers: header });
    }

    getTopTen() {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.put<any>(environment.apiPhp + 'adminserv/report-receivableamount', null, { headers: header });
    }

    getTopTenReceived() {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.put<any>(environment.apiPhp + 'adminserv/report-receivedvalues', null, { headers: header });
    }

    getAssociatesIndicated(data: { startDate: string, endDate: string } = null) {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.put<any>(environment.apiPhp + 'adminserv/report-amountindicated', data, { headers: header });
    }

    getBillingCommissions() {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.put<any>(environment.apiPhp + 'adminserv/report-billingcommissions', null, { headers: header });
    }

    getListAdmins() {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.get<any>(environment.apiPhp + 'reseller/getAdmin', { headers: header });
    }

    getStatementMembership(_resellerid, _smid = null) {
        const sm = _smid == null ? '' : '/' + _smid;
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.get<any>(environment.apiPhp + 'reseller/getstatementmembership/' + _resellerid + sm, { headers: header });
    }

    getOneAssociate(_resellerid: number) {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.get<any>(environment.apiPhp + 'reseller/getById/' + _resellerid, { headers: header });
    }

    getBonificationAssociate(_resellerid: number) {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.get<any>(environment.apiPhp + 'adminserv/getbonusrequest/' + _resellerid, { headers: header });
    }

    processOrderRescue(order) {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.post<any>(environment.apiPhp + 'reseller/processorderrescue', order, { headers: header });
    }

    refusedOrderRescue(order) {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.post<any>(environment.apiPhp + 'reseller/refusedOrderRescue', order, { headers: header });
    }

    deleteReseller(data: { id: number; reason: string; }): any {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.post<any>(environment.apiPhp + 'reseller/delete', data, { headers: header });
    }

    updatePayment(payment) {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.post<any>(environment.apiPhp + 'reseller/activateUser', payment, { headers: header });
    }

    updatePaymentMethod(payment) {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.post<any>(environment.apiPhp + 'reseller/updatepaymentmethod', payment, { headers: header });
    }

    updatePaymentByAdmin(payment) {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.post<any>(environment.apiPhp + 'reseller/activateuserbyadmin', payment, { headers: header });
    }

    validateAssociate(data) {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.post<any>(environment.apiPhp + 'reseller/validateuser', data, { headers: header });
    }

    insertDebit(data) {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.post<any>(environment.apiPhp + 'reseller/insertdebit', data, { headers: header });
    }

    buyPack(data) {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.post<any>(environment.apiPhp + 'reseller/buyPack', data, { headers: header });
    }

    associateOrderAproval(data) {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.post<any>(environment.apiPhp + 'reseller/resellerOrderAproval', data, { headers: header });
    }

    getListAssociateWithOrderProcessing() {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.get<any>(environment.apiPhp + 'reseller/getListAssociateWithOrderProcessing', { headers: header });
    }

    getPackagesDetails(data) {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.post<any>(environment.apiPhp + 'adminserv/report-PaymentRequest/details', data, { headers: header });
    }

    insertCredit(data) {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.post<any>(environment.apiPhp + 'reseller/insertcredit', data, { headers: header });
    }

    updateUser(_user) {
        const headers = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Authorization', 'Bearer ' + this.getUserToken());

        return this._http.put(environment.apiPhp + 'reseller/updatereseller', _user, { headers: headers });
    }

    findUser(_userid) {
        const headers = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Authorization', 'Bearer ' + this.getUserToken());

        return this._http.get(environment.apiPhp + 'users/id/' + _userid, { headers: headers });
    }

    findUsers() {
        const headers = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Authorization', 'Bearer ' + this.getUserToken());

        return this._http.get(environment.apiPhp + 'users/', { headers: headers });
    }

    findPaymentRequests() {
        const headers = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Authorization', 'Bearer ' + this.getUserToken());

        return this._http.get(environment.apiPhp + '', { headers: headers });
    }

    getOrders(business) {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.get<any>(environment.apiPhp + 'reports/order/' + business, { headers: header });
    }

    getUnvailidateAssociates() {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.get<any>(environment.apiPhp + 'reseller/getunvalidateduser', { headers: header });
    }

    getReportPaymentRequest(business) {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.put<any>(environment.apiPhp + 'adminserv/report-paymentrequest', business, { headers: header });
    }

    getCommissions(id = null) {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.get<any>(environment.apiPhp + 'reports/commissions' + (id ? '/' + id : ''), { headers: header });
    }

    postImageS3(path, file) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('path', path);
        const headers = new HttpHeaders()
            .set('accept-language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.post<any>(environment.apiPhp + 'tools/upload', formData, { headers: headers });
    }

    uploadReceipt(path, file): any {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('path', path);
        const headers = new HttpHeaders()
            .set('accept-language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.post(environment.apiPhp + 'reseller/upload-receipt', formData, { headers: headers });
    }

    uploadBanner(data) {
        const headers = new HttpHeaders()
            .set('accept-language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.post<any>(environment.apiPhp + 'set/uploadImage', data, { headers: headers });
    }

    getImages() {
        const headers = new HttpHeaders()
            .set('accept-language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.get<any>(environment.apiPhp + 'set/getImages', { headers: headers });
    }

    getTypesImages() {
        const headers = new HttpHeaders()
            .set('accept-language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.get<any>(environment.apiPhp + 'set/getTypesImage', { headers: headers });
    }

    setImages(data: any) {
        const headers = new HttpHeaders()
            .set('accept-language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.put<any>(environment.apiPhp + 'set/setImages', data, { headers: headers });
    }


    getCells(page, size) {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.get<any>(environment.apiPhp + 'manager/cell/group/' + page + '/' + size, { headers: header });
    }

    getCellsList() {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.get<any>(environment.apiPhp + 'manager/cells/list', { headers: header });
    }

    getGrids(page, size) {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.get<any>(environment.apiPhp + 'manager/cells/' + page + '/' + size, { headers: header });
    }

    detailGrid(id) {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.get<any>(environment.apiPhp + 'manager/cell/' + id, { headers: header });
    }

    detailCell(id) {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.get<any>(environment.apiPhp + 'manager/cell/group/' + id, { headers: header });
    }

    editGrid(id, obj) {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.put<any>(environment.apiPhp + 'manager/cell/' + id, obj, { headers: header });
    }

    editCell(id, obj) {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.put<any>(environment.apiPhp + 'manager/cell/group/' + id, obj, { headers: header });
    }
    approvedPrepaidCard(data) {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.put<any>(environment.apiPhp + 'reseller/approvedPrepaidCard', data, { headers: header });
    }

    postGrids(obj) {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.post<any>(environment.apiPhp + 'manager/cell', obj, { headers: header });
    }

    postCells(obj) {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.post<any>(environment.apiPhp + 'manager/cell/group', obj, { headers: header });
    }

    connectCell(obj) {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.put<any>(environment.apiPhp + 'manager/cell/connect', obj, { headers: header });
    }

    deleteCell(id, obj) {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.put<any>(environment.apiPhp + 'manager/cell/group/delete/' + id, obj, { headers: header });
    }

    deleteGrid(id, obj) {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.put<any>(environment.apiPhp + 'manager/cell/delete/' + id, obj, { headers: header });
    }

    requestChangePassword(data: any): any {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.post<any>(environment.apiPhp + 'adminserv/changePassword', data, { headers: header });
    }

    listEnumStatus() {
        return [
            {
                label: 'Status',
                value: ''
            },
            {
                label: 'Ativo',
                value: 'A'
            },
            {
                label: 'Excluído',
                value: 'E'
            },
            {
                label: 'Aguardando Aprovação',
                value: 'AA'
            },
            {
                label: 'Aguardando Pagamento',
                value: 'AP'
            },
        ];
    }

    listEnumPayment() {
        return [
            {
                label: '',
                value: null,
            }, {
                label: 'Credit Card',
                value: 'credit_card',
            }, {
                label: 'Crypto Coins',
                value: 'crypto_coins',
            }, {
                label: 'Transfer Bank',
                value: 'transfer_bank',
            }, {
                label: 'Platform Credit',
                value: 'platform_credit',
            }, {
                label: 'Manual',
                value: 'manual',
            }];
    }

}
