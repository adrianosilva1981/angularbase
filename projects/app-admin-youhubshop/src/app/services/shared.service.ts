import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { HyperCookieService } from 'lib-services';
import { Router } from '@angular/router';
import { environment } from '@env/app-admin-youhubshop';
import { MenuItem } from 'primeng/components/common/menuitem';

@Injectable({
    providedIn: 'root'
})
export class SharedService {


    public items: MenuItem[] = [];

    constructor(
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

    getUserPermission() {
        const cookieVal = this._hyperCookieService.getCookie_GENERIC(environment.nameCookie);
        return cookieVal.permission || 0;
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

    getListAssociates() {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        // console.log(environment.apiPhp + 'reseller/getList');
        return this._http.get<any>(environment.apiPhp + 'reseller/getList', { headers: header });
    }

    getInfoDashBoard(option: Number) {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.get<any>(environment.apiPhp + 'dashboard/getInfoDashBoard/' + option, { headers: header });
    }

    getInfoShops(data: { startDate: string; endDate: string; }) {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.post<any>(environment.apiPhp + 'dashboard/getInfoShops', data, { headers: header });
    }


    getInfoDetailsShops(data: { idShop: any; startDate: string; endDate: string; }) {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.post<any>(environment.apiPhp + 'dashboard/getInfoDetailsShops', data, { headers: header });
    }

    getInfoSuppliers(data: { startDate: string; endDate: string; }) {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.post<any>(environment.apiPhp + 'dashboard/getInfoSuppliers', data, { headers: header });
    }

    getInfoDetailsSuppliers(data: { idSupplier: any; startDate: string; endDate: string; }) {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.post<any>(environment.apiPhp + 'dashboard/getInfoDetailsSuppliers', data, { headers: header });
    }

    getInfoDetailsGiftCard(data: { startDate: string; endDate: string; }) {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.post<any>(environment.apiPhp + 'dashboard/getInfoDetailsGiftCard', data, { headers: header });
    }

    getInfoDetailsProducts(data: { startDate: string; endDate: string; }) {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.post<any>(environment.apiPhp + 'dashboard/getInfoDetailsProducts', data, { headers: header });
    }

    getInfoDetailsServices(data: { startDate: string; endDate: string; }) {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.post<any>(environment.apiPhp + 'dashboard/getInfoDetailsServices', data, { headers: header });
    }

    getInfoUsers() {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.get<any>(environment.apiPhp + 'dashboard/getInfoUsers', { headers: header });
    }

    getInfoDetailsUser(idUser: Number) {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.get<any>(environment.apiPhp + 'dashboard/getInfoDetailsUser/' + idUser, { headers: header });
    }

    getReportPayments() {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        // console.log(environment.apiPhp + 'reseller/getList');
        return this._http.get<any>(environment.apiPhp + 'shop/getReportPayments', { headers: header });
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
        // console.log(environment.apiPhp + 'reseller/getList');
        return this._http.get<any>(environment.apiPhp + 'reseller/getAdmin', { headers: header });
    }

    getStatementMembership(_resellerid) {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.get<any>(environment.apiPhp + 'reseller/getstatementmembership/' + _resellerid, { headers: header });
    }

    getOneAssociate(_userid) {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        // console.log(environment.apiPhp + 'reseller/getList');
        return this._http.get<any>(environment.apiPhp + 'reseller/getById/' + _userid, { headers: header });
    }

    updatePayment(payment) {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.post<any>(environment.apiPhp + 'reseller/activateUser', payment, { headers: header });
    }

    validateAssociate(date) {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.post<any>(environment.apiPhp + 'reseller/validateuser', date, { headers: header });
    }

    getHubmixDetails(date) {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.post<any>(environment.apiPhp + 'shop/getHubmixDetails', date, { headers: header });
    }

    updateUser(_user) {
        const headers = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Authorization', 'Bearer ' + this.getUserToken());

        return this._http.put(environment.apiPhp + 'users', _user, { headers: headers });
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

    getCommissions(data) {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.post<any>(environment.apiPhp + 'shop/getCommissions', data, { headers: header });
    }

    postImageS3(path, file): any {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('path', path);
        const headers = new HttpHeaders()
            .set('accept-language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.post(environment.apiPhp + 'tools/upload', formData, { headers: headers });
    }

    uploadImage(path, file): any {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('path', path);
        const headers = new HttpHeaders()
            .set('accept-language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.post(environment.apiPhp + 'tools/uploadImage', formData, { headers: headers });
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

    listEnumStatus() {
        return [
            {
                label: '',
                value: null
            }, {
                label: 'Ativo',
                value: 'A'
            }, {
                label: 'Cancelado',
                value: 'C'
            }, {
                label: 'Excluido',
                value: 'E'
            }, {
                label: 'Aguardando Aprovação',
                value: 'AA'
            }, {
                label: 'Carrinho Abandonado/Expirado',
                value: 'AB'
            }, {
                label: 'Aguardando Pagamento',
                value: 'AP'
            }, {
                label: 'Pagamento Confirmado',
                value: 'PC'
            }, {
                label: 'Pagamento Negado',
                value: 'PN'
            }, {
                label: 'Pagamento Aguardando Captura',
                value: 'PAC'
            }, {
                label: 'Pagamento Recorrente',
                value: 'PR'
            }, {
                label: 'Pagamento Recorrente Agendado',
                value: 'PRA'
            }, {
                label: 'Ativo não listado',
                value: 'ANL'
            }
        ];
    }

    listEnumPayment() {
        return [
            {
                label: '',
                value: null,
            }, {
                label: 'Ticket',
                value: 'ticket',
            }, {
                label: 'Credit Card',
                value: 'credit_card',
            }, {
                label: 'Bitcoin',
                value: 'bitcoin',
            }, {
                label: 'Crypto Coins',
                value: 'crypto_coins',
            }, {
                label: 'Transfer Bank',
                value: 'transfer_bank',
            }, {
                label: 'Prepaid Card',
                value: 'prepaid_card',
            }, {
                label: 'Platform Credit',
                value: 'platform_credit',
            }];
    }

    getOrdersSold(data) {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.post<any>(environment.apiPhp + 'shop/getOrders', data, { headers: header });
    }

    getOrdersSoldDetails(data) {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.post<any>(environment.apiPhp + 'shop/getOrdersDetails', data, { headers: header });
    }

    getPerformance(data) {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.post<any>(environment.apiPhp + 'shop/getPerformance', data, { headers: header });
    }

    getPayments(idSupplier, request_date) {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.get<any>(environment.apiPhp + 'shop/getPayments/' + idSupplier + '/' + request_date, { headers: header });
    }

    getPaymentsBySupplier(data = null) {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.post<any>(environment.apiPhp + 'shop/getPaymentsBySupplier', data, { headers: header });
    }

    getSuppliers() {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.get<any>(environment.apiPhp + 'products/getSuppliers', { headers: header });
    }

    // getAccountsSupplier(idSupplier: number) {
    //     const header = new HttpHeaders()
    //         .set('Content-Type', 'application/json')
    //         .set('Accept-Language', 'pt-BR')
    //         .set('Authorization', 'Bearer ' + this.getUserToken());
    //     return this._http.get<any>(environment.apiPhp + 'shop/getAccountsSupplier/' + idSupplier, { headers: header });
    // }

    getProducts() {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.get<any>(environment.apiPhp + 'products/getProducts', { headers: header });
    }

    getReportProducts(id_supplier: number = null) {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.get<any>(environment.apiPhp + 'products/reportProducts' + (id_supplier ? '/' + id_supplier : ''), { headers: header });
    }

    setProductNacionalOrSpotlight(data) {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.put<any>(environment.apiPhp + 'products/setProductNacionalOrSpotlight', data, { headers: header });
    }

    setPayments(data) {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.post<any>(environment.apiPhp + 'shop/setPayment', data, { headers: header });
    }

    getDebits(id_user_supplier) {
        const header = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Accept-Language', 'pt-BR')
            .set('Authorization', 'Bearer ' + this.getUserToken());
        return this._http.get<any>(environment.apiPhp + 'shop/supplier/debits/' + id_user_supplier, { headers: header });
    }

}
