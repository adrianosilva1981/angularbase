import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { HyperCookieService } from 'lib-services';
import { Router } from '@angular/router';
import { environment } from '@env/app-consultant-adm';
import { BroadcastEventService } from 'lib-services';
import { isNumber } from 'util';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  private ownerStore: any = {};
  private supplierProduct: any;

  public products: any;

  public filter = {
    selectedType: '',
    dateStart: null,
    dateFinish: null,
    status: '',
    detailStatus: '',
    order: '',
    name: ''
  };

  private publicity: any;

  constructor(
    private http: HttpClient,
    private _hyperCookieService: HyperCookieService,
    private _router: Router
  ) { }

  getPublish() {
    return this.publicity;
  }

  setPublish(value) {
    this.publicity = value;
  }

  // Emite os eventos do breadcrumb para abiblioteca***************************
  addBreadCrumb(obj) {
    BroadcastEventService.event('onBreadCrumb').emit(obj);
  }

  getUserObject() {
    const cookieVal = this._hyperCookieService.getCookie_AUTH();

    if (cookieVal) {
      return cookieVal;
    } else {
      this._router.navigate(['/login']);
    }
  }
  getUserData() {
    const cookieVal = this._hyperCookieService.getCookie_AUTH();

    if (cookieVal) {
      return cookieVal;
    } else {
      return undefined;
    }
  }

  blackFridayRegister(): any {
    const headers = new HttpHeaders()
      .set('accept-language', 'pt-BR')
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.getUserToken());

    return this.http.get(environment.apiPhpV2 + 'shop/blackfriday', { headers: headers });
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


  setOwnerStore(owner) {
    this.ownerStore = owner;
  }

  // Retorna o Objeto do dono da loja
  getOwnerStore() {
    return this.ownerStore.subDomain ? this.ownerStore : {};
  }

  getOwnerShowHyperPrd() {
    return this.ownerStore.showHyperPrd ? this.ownerStore.showHyperPrd : 'N';
  }

  postShowPrd(data): any {
    const headers = new HttpHeaders()
      .set('accept-language', 'pt-BR')
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.getUserToken());

    return this.http.post(environment.apiPhpV2 + 'associate/showprd', data, { headers: headers });
  }

  getConsultantHJ() {
    const headers = new HttpHeaders()
      .set('accept-language', 'pt-BR')
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.getUserToken());

    return this.http.get(environment.apiPhp + 'user/consultant', { headers: headers });
  }

  putConsultantHJ(consultant) {
    const headers = new HttpHeaders()
      .set('accept-language', 'pt-BR')
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.getUserToken());
    const obj = {
      consultant: consultant
    };
    return this.http.put(environment.apiPhp + 'user/consultant', obj, { headers: headers });
  }

  getAddressCep(cep) {
    const headers = new HttpHeaders()
      .set('accept-language', 'pt-BR')
      .set('Content-Type', 'application/json');
    return this.http.get('https://viacep.com.br/ws/' + cep + '/json/', { headers: headers });

  }

  putConsultants(data): any {
    const headers = new HttpHeaders()
      .set('accept-language', 'pt-BR')
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.getUserToken());

    return this.http.post(environment.apiPhpV2 + 'associate/update-shop', data, { headers: headers });
  }

  getGiftCardCompany(_idCompany: Number, data: { startDate: String, endDate: String } = null) {
    const headers = new HttpHeaders()
      .set('accept-language', 'pt-BR')
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.getUserToken());
    return this.http.post<any>(`${environment.apiPhpV2}guide/getGiftCardCompany/${_idCompany}`, data, { headers: headers });
  }

  getConsultants(): any {
    const headers = new HttpHeaders()
      .set('accept-language', 'pt-BR')
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.getUserToken());

    return this.http.get(environment.apiPhpV2 + 'associate/getshop', { headers: headers });
  }

  putConsultantCustom(depto = null, categ = null, prod = null): any {
    const headers = new HttpHeaders()
      .set('accept-language', 'pt-BR')
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.getUserToken());


    const _depto = depto ? '/' + depto : '';
    const _categ = categ ? '/' + categ : '';
    const _prod = prod ? '/' + prod : '';


    return this.http.get(environment.apiPhpV2 + 'labors/getCustom' + _depto + _categ + _prod, { headers: headers });
  }

  postConsultantCustom(obj): any {
    const headers = new HttpHeaders()
      .set('accept-language', 'pt-BR')
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.getUserToken());

    return this.http.post(environment.apiPhp + 'job/consultant/custom', obj, { headers: headers });
  }

  getAllServices(consultant = null) {
    const headers = new HttpHeaders()
      .set('accept-language', 'pt-BR')
      .set('Content-Type', 'application/json')
      .set('x-consultant', consultant ? consultant : this.getUserObject().id);

    return this.http.get(environment.apiPhp + 'job/consultant/catalog', { headers: headers });
  }

  getService(id): any {
    const headers = new HttpHeaders()
      .set('accept-language', 'pt-BR')
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.getUserToken());

    return this.http.get(environment.apiPhp + 'job/worker/hyperService/' + id, { headers: headers });
  }

  //Lista as ordens de serviço do usuário logado********************************************
  listPreOrders() {
    const headers = new HttpHeaders()
      .set('accept-language', 'pt-BR')
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.getUserToken());

    return this.http.get(environment.apiPhp + 'consultant/list-pre-orders', { headers: headers });
  }

  //Lista as vendas feito no seu shop********************************************
  listShopOrders() {
    const headers = new HttpHeaders()
      .set('accept-language', 'pt-BR')
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.getUserToken());

    return this.http.get(environment.apiPhp + 'consultant/list-shop-orders', { headers: headers });
  }

  //Retorna a compra que o usuario fez em cima de minha preorder como consultor
  getBuyerOrderDetails(order) {
    const headers = new HttpHeaders()
      .set('accept-language', 'pt-BR')
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.getUserToken());

    return this.http.get(environment.apiPhp + 'consultant/buyer-order-details/' + order, { headers: headers });
  }

  getExtract(): any {
    const headers = new HttpHeaders()
      .set('accept-language', 'pt-BR')
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.getUserToken());

    return this.http.get(environment.apiPhp + 'all/extract/all/all/all', { headers: headers });
  }

  // EDIT LOGO
  putLogo(idShop, logo): any {
    const headers = new HttpHeaders()
      .set('accept-language', 'pt-BR')
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.getUserToken());

    return this.http.put(environment.apiPhpV2 + 'shop/logo/' + idShop, logo, { headers: headers });
  }

  // EDIT CORES
  putColors(idShop, colors): any {
    const headers = new HttpHeaders()
      .set('accept-language', 'pt-BR')
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.getUserToken());

    return this.http.put(environment.apiPhpV2 + 'shop/nav-footer/' + idShop, colors, { headers: headers });
  }

  // EDIT SOCIAL MEDIA
  postSocial(idShop, social): any {
    const headers = new HttpHeaders()
      .set('accept-language', 'pt-BR')
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.getUserToken());

    return this.http.post(environment.apiPhpV2 + 'shop/socialmedia/' + idShop, social, { headers: headers });
  }

  //lista Fornecedor********************************************
  getSupplier(): any {
    const headers = new HttpHeaders()
      .set('accept-language', 'pt-BR')
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.getUserToken());

    return this.http.get(environment.apiPhpV2 + 'shop/supplier', { headers: headers });
  }

  //lista os departamentos, categorias e serviços que irao ser exibidos em sua loja***********
  getCustomStore(depto = null, categ = null, prod = null) {
    const _depto = depto ? '/' + depto : '';
    const _categ = categ ? '/' + categ : '';
    const _prod = prod ? '/' + prod : '';

    const headers = new HttpHeaders()
      .set('accept-language', 'pt-BR')
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.getUserToken());

    return this.http.get(environment.apiPhpV2 + 'products/getCustom' + _depto + _categ + _prod, { headers: headers });
  }

  //atualiza os departamentos, categorias e serviços que irao ser exibidos em sua loja***********
  setCustomStore(obj) {
    const headers = new HttpHeaders()
      .set('accept-language', 'pt-BR')
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.getUserToken());

    return this.http.put(environment.apiPhpV2 + 'products/setCustom', obj, { headers: headers });
  }

  //atualiza os departamentos, categorias e serviços que irao ser exibidos em sua loja***********
  setCustomStoreService(obj) {
    const headers = new HttpHeaders()
      .set('accept-language', 'pt-BR')
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.getUserToken());

    return this.http.put(environment.apiPhpV2 + 'labors/setCustom', obj, { headers: headers });
  }
  // retorna todos os produtos vendidos pelo suppliers
  getProductSupplier(): any {
    const headers = new HttpHeaders()
      .set('accept-language', 'pt-BR')
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.getUserToken());

    return this.http.get(environment.apiPhpV2 + 'products/supplier-product', { headers: headers });
  }
  // retorna todos os produtos vendidos pelo suppliers
  postProductSupplier(data): any {
    const headers = new HttpHeaders()
      .set('accept-language', 'pt-BR')
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.getUserToken());

    return this.http.post(environment.apiPhpV2 + 'products/update-nf-track', data, { headers: headers });
  }
  // salva o produto escolhido pelo fornecedor para leitura posterior
  setOneProductSupplier(sup) {
    this.supplierProduct = sup;
  }
  // retorna o produto especifico e reseta a variavel
  getOneProductSupplier() {
    const product = this.supplierProduct;
    this.supplierProduct = undefined;
    return product;
  }

  uploadDocument(path, file): any {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('path', path);
    const headers = new HttpHeaders()
      .set('accept-language', 'pt-BR')
      .set('Authorization', 'Bearer ' + this.getUserToken());
    return this.http.post(environment.apiPhpV2 + 'tools/upload', formData, { headers: headers });
  }

  getSupplierExtract(consultant = null) {
    const headers = new HttpHeaders()
      .set('accept-language', 'pt-BR')
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.getUserToken());

    return this.http.get(environment.apiPhpV2 + 'shop/supplier/extract', { headers: headers });
  }

  // Gift Card
  getCompanyCategories() {
    const httpOptions = {
      headers: new HttpHeaders()
        .set('accept-language', 'pt-BR')
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + this.getUserToken())
    };

    return this.http.get(environment.apiPhpV2 + 'guide/allcategories', httpOptions);
  }
  // Gift Card
  getTotalVoucherById(id) {
    const httpOptions = {
      headers: new HttpHeaders()
        .set('accept-language', 'pt-BR')
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + this.getUserToken())
    };

    return this.http.post(environment.apiPhpV2 + 'guide/totalvoucherbyid', id, httpOptions);
  }

  getAddresByCEP(cep) {
    return this.http.get(environment.apiSearchCEP + cep + '/json');
  }

  postCompany(data) {
    const headers = new HttpHeaders()
      .set('accept-language', 'pt-BR')
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.getUserToken());

    return this.http.post(environment.apiPhpV2 + 'guide/company', data, { headers: headers });
  }

  postGiftCard(data) {
    const headers = new HttpHeaders()
      .set('accept-language', 'pt-BR')
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.getUserToken());

    return this.http.post(environment.apiPhpV2 + 'guide/gift', data, { headers: headers });
  }

  saveProducts(data) {
    this.products = data;
  }

  getCompany(): any {
    const headers = new HttpHeaders()
      .set('accept-language', 'pt-BR')
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.getUserToken());

    return this.http.get(environment.apiPhpV2 + 'guide/company', { headers: headers });
  }

  getGiftCardByUser(): any {
    const headers = new HttpHeaders()
      .set('accept-language', 'pt-BR')
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.getUserToken());

    return this.http.get(environment.apiPhpV2 + 'guide/gift', { headers: headers });
  }
  getGiftCardByUserId(): any {
    const headers = new HttpHeaders()
      .set('accept-language', 'pt-BR')
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.getUserToken());

    return this.http.get(environment.apiPhpV2 + 'guide/giftuser', { headers: headers });
  }


  getLocalProduct(id) {
    if (this.products) {
      const prd = this.products.find(x => x.id === id);
      return prd;
    } else {
      return false;
    }
  }

  deleteGiftCard(data) {
    const headers = new HttpHeaders()
      .set('accept-language', 'pt-BR')
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.getUserToken());

    return this.http.put(environment.apiPhpV2 + 'guide/gift/remove', data, { headers: headers });
  }

  deleteCompany(data) {
    const headers = new HttpHeaders()
      .set('accept-language', 'pt-BR')
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.getUserToken());

    return this.http.put(environment.apiPhpV2 + 'guide/company/remove', data, { headers: headers });
  }

  checkedVoucher(data) {
    const headers = new HttpHeaders()
      .set('accept-language', 'pt-BR')
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.getUserToken());

    return this.http.put(environment.apiPhpV2 + 'guide/gift/used', data, { headers: headers });
  }

  listCompaniesSupplier() {
    const headers = new HttpHeaders()
      .set('accept-language', 'pt-BR')
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.getUserToken());

    return this.http.get(environment.apiPhpV2 + 'guide/supplier', { headers: headers });
  }

  // Lista todas as campanhas contradas do usuario
  listPublicityByUser(): any {
    const headers = new HttpHeaders()
      .set('accept-language', 'pt-BR')
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.getUserToken());

    return this.http.get(environment.apiPhpV2 + 'publicity', { headers: headers });
  }

  // Listar todos produtos do usuario para a Publiciadade
  listProductsByUserPublicity(): any {
    const headers = new HttpHeaders()
      .set('accept-language', 'pt-BR')
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.getUserToken());

    return this.http.get(environment.apiPhpV2 + 'publicity/products', { headers: headers });
  }

  // Salvar configuração de Pages Views
  savePageView(data): any {
    const headers = new HttpHeaders()
      .set('accept-language', 'pt-BR')
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.getUserToken());

    return this.http.post(environment.apiPhpV2 + 'publicity/page-view', data, { headers: headers });
  }

  // Listar configurações já cadastradas
  listPublicityAction(idAds: Number, action: String): any {
    const headers = new HttpHeaders()
      .set('accept-language', 'pt-BR')
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.getUserToken());

    return this.http.get(environment.apiPhpV2 + 'publicity/action/' + idAds + '/' + action, { headers: headers });
  }

  // Salvar e-mail marketing
  saveEmailMarketing(data: any): any {
    const headers = new HttpHeaders()
      .set('accept-language', 'pt-BR')
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.getUserToken());

    return this.http.post(environment.apiPhpV2 + 'publicity/mail-marketing', data, { headers: headers });
  }

  getMailMarketingByAds(idAds: Number): any {
    const headers = new HttpHeaders()
      .set('accept-language', 'pt-BR')
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.getUserToken());

    return this.http.get(environment.apiPhpV2 + 'publicity/mail-marketing/' + idAds, { headers: headers });
  }

  editPublicity(data: any): any {
    const headers = new HttpHeaders()
      .set('accept-language', 'pt-BR')
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.getUserToken());

    return this.http.put(environment.apiPhpV2 + 'publicity', data, { headers: headers });
  }

  savePostNetwork(data: any): any {
    const headers = new HttpHeaders()
      .set('accept-language', 'pt-BR')
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.getUserToken());

    return this.http.post(environment.apiPhpV2 + 'publicity/post-network', data, { headers: headers });
  }

  getPostNetworkByAds(idAds: Number, socialNet: String): any {
    const headers = new HttpHeaders()
      .set('accept-language', 'pt-BR')
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.getUserToken());

    return this.http.get(environment.apiPhpV2 + 'publicity/post-network/' + idAds + '/' + socialNet, { headers: headers });
  }

  listUsersSocial(): any {
    const headers = new HttpHeaders()
      .set('accept-language', 'pt-BR')
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.getUserToken());

    return this.http.get(environment.apiPhpV2 + 'publicity/users-social', { headers: headers });
  }

  saveShare(data: any): any {
    const headers = new HttpHeaders()
      .set('accept-language', 'pt-BR')
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.getUserToken());

    return this.http.post(environment.apiPhpV2 + 'publicity/share', data, { headers: headers });
  }

  getShareByAds(idAds: Number): any {
    const headers = new HttpHeaders()
      .set('accept-language', 'pt-BR')
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.getUserToken());

    return this.http.get(environment.apiPhpV2 + 'publicity/share/' + idAds, { headers: headers });
  }

  //Retorna os produtos ********************************************************
  getHyperProducts(id) {
    let httpOptions;
    httpOptions = {
      headers: new HttpHeaders()
        .set('accept-language', 'pt-BR')
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + this.getUserToken())
    };
    return this.http.post(environment.apiPhpV2 + 'products/productbyid', id, httpOptions);
  }
  //Retorna os vouchers ********************************************************
  getVoucherPack(): any {
    let httpOptions;
    httpOptions = {
      headers: new HttpHeaders()
        .set('accept-language', 'pt-BR')
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + this.getUserToken())
    };
    return this.http.get(environment.apiPhpV2 + 'products/getvoucherpack', httpOptions);
  }
  getCompanyUser(): any {
    let httpOptions;
    httpOptions = {
      headers: new HttpHeaders()
        .set('accept-language', 'pt-BR')
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + this.getUserToken())
    };
    return this.http.get(environment.apiPhpV2 + 'guide/companyuser', httpOptions);
  }

  listPublicityExtract(action: any, idAds: any, extra = ''): any {
    const httpOptions = {
      headers: new HttpHeaders()
        .set('accept-language', 'pt-BR')
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + this.getUserToken())
    };

    if (extra === '') {
      return this.http.get(environment.apiPhpV2 + 'publicity/extract/' + action + '/' + idAds, httpOptions);
    } else {
      return this.http.get(environment.apiPhpV2 + 'publicity/extract/' + action + '/' + idAds + '/' + extra, httpOptions);
    }
  }

  validSharePrint(data: any): any {
    const httpOptions = {
      headers: new HttpHeaders()
        .set('accept-language', 'pt-BR')
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + this.getUserToken())
    };

    return this.http.post(environment.apiPhpV2 + 'publicity/extract/valid-share', data, httpOptions);
  }

  //lista os bancos********************************************
  getBanks(): any {
    const headers = new HttpHeaders()
      .set('accept-language', 'pt-BR')
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.getUserToken());

    return this.http.get(environment.apiPhpV2 + 'tools/get-banks', { headers: headers });
  }
  getExtractItems(): any {
    const headers = new HttpHeaders()
      .set('accept-language', 'pt-BR')
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.getUserToken());

    return this.http.get(environment.apiPhpV2 + 'shop/getExtractItems', { headers: headers });
  }
  requestPayment(data): any {
    const headers = new HttpHeaders()
      .set('accept-language', 'pt-BR')
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.getUserToken());

    return this.http.post(environment.apiPhpV2 + 'shop/requestpay', data, { headers: headers });
  }
}
