import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { HyperCookieService, HyperToastsService, BroadcastEventService } from 'lib-services';
import { environment } from '@env/app-hyper-store';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  public locale = 'pt-BR';
  public shopCartCookie: any = [];
  public favoriteCookie: any = [];
  public filterGuide = {
    category: undefined,
    search: []
  };
  private ownerStore: any = {};
  public lastProduct: any = {};
  public products: any;

  constructor(
    private _httpClient: HttpClient,
    private _hyperCookieService: HyperCookieService,
    private _hyperToastsService: HyperToastsService
  ) { }

  // Emite os eventos do breadcrumb para abiblioteca***************************
  addBreadCrumb(obj) {
    BroadcastEventService.event('onBreadCrumb').emit(obj);
  }

  //Retorna os dados do usuário logado no cookie********************************
  getUserData() {
    const cookieVal = this._hyperCookieService.getCookie_AUTH();
    if (cookieVal) {
      return cookieVal;
    }
    return false;
  }

  //Retorna o token do usuário no cookie****************************************
  getUserToken() {
    const cookieVal = this.getUserData();
    if (cookieVal && Object(cookieVal.JWT)) {
      return cookieVal.JWT;
    }
  }

  //Retorna os serviços disponiveis da hyper jobs********************************
  getHyperServices(filter = {}) {
    let httpOptions;
    if (this.getUserToken()) {
      httpOptions = {
        headers: new HttpHeaders()
          .set('accept-language', this.locale)
          .set('Content-Type', 'application/json')
          .set('Authorization', 'Bearer ' + this.getUserToken())
      };
    } else {
      httpOptions = {
        headers: new HttpHeaders()
          .set('accept-language', this.locale)
          .set('Content-Type', 'application/json')
      };
    }

    return this._httpClient.put(environment.apiPhpV2 + 'labors', filter, httpOptions);
  }

  //Retorna os produtos ********************************************************
  getHyperProducts(filter = {}) {
    let httpOptions;
    if (this.getUserToken()) {
      httpOptions = {
        headers: new HttpHeaders()
          .set('accept-language', this.locale)
          .set('Content-Type', 'application/json')
          .set('Authorization', 'Bearer ' + this.getUserToken())
      };
    } else {
      httpOptions = {
        headers: new HttpHeaders()
          .set('accept-language', this.locale)
          .set('Content-Type', 'application/json')
      };
    }

    return this._httpClient.put(environment.apiPhpV2 + 'products', filter, httpOptions);
  }

  //Retorna os profissionais disponiveis********************************
  getProfessional(filter = {}) {
    let httpOptions;
    if (this.getUserToken()) {
      httpOptions = {
        headers: new HttpHeaders()
          .set('accept-language', this.locale)
          .set('Content-Type', 'application/json')
          .set('Authorization', 'Bearer ' + this.getUserToken())
      };
    } else {
      httpOptions = {
        headers: new HttpHeaders()
          .set('accept-language', this.locale)
          .set('Content-Type', 'application/json')
      };
    }

    return this._httpClient.put(environment.apiPhpV2 + 'professionals', filter, { headers: httpOptions });
  }

  //Adiciona Itens no cookie carrinho*******************************************
  addItemOnShopCart(itemCart: any, limitQuantity = 10) {

    limitQuantity = Number(limitQuantity);
    const shopcart = this._hyperCookieService.getCookie_SHOPCART();

    this.shopCartCookie = shopcart ? shopcart : [];

    const exists = this.shopCartCookie.find((x: any) => x.id === itemCart.id && x.type === itemCart.type);

    if (!exists) {
      this.shopCartCookie.push(itemCart);
    } else {
      if (exists.quantity + 1 <= limitQuantity) {
        exists.quantity = exists.quantity + 1;
      } else {
        this._hyperToastsService.addToast('warn', 'Atenção', 'O carrinho pode conter no máximo ' + limitQuantity + ' quantidades para este item');
      }
    }

    BroadcastEventService.event('updateShoppingCart').emit(this.shopCartCookie);
  }

  //Adiciona Itens no cookie favorito*******************************************
  addItemOnWishList(itemADD, itemType) {
    const favorite = this._hyperCookieService.getCookie_FAVORITES();

    if (favorite) {
      this.favoriteCookie = favorite;
    }

    const date = new Date();
    const dateString = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
    const itemID = itemType === 'product' ? itemADD._id : itemADD.id;

    const exists = this.favoriteCookie.findIndex(x => x.itemID === itemID && x.itemType === itemType);

    if (exists !== -1) {
      this.favoriteCookie.splice(exists, 1);
    }

    const objCookie = {
      itemType: itemType,
      itemID: itemID,
      dateAdd: dateString,
    };

    this.favoriteCookie.unshift(objCookie);

    BroadcastEventService.event('updateShoppingFavorite').emit(this.favoriteCookie);
  }

  //Retorna os dados da orderm de todas as ordens de um usuário*******************
  getAllHyperOrder() {
    const httpOptions = {
      headers: new HttpHeaders()
        .set('accept-language', this.locale)
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + this.getUserToken())
    };

    return this._httpClient.get(environment.apiPhp + 'shop/orders', httpOptions);
  }


  //Retorna os dados da orderm**************************************************
  getHyperOrder(order) {
    const httpOptions = {
      headers: new HttpHeaders()
        .set('accept-language', this.locale)
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + this.getUserToken())
    };
    return this._httpClient.put(environment.apiPhpV2 + 'checkout/orders/' + order, order, httpOptions);
  }

  //Registra o usuário na HyperJobs**********************************************
  registerInHJ(data) {
    const headers = new HttpHeaders()
      .set('accept-language', this.locale)
      .set('Content-Type', 'application/json');

    return this._httpClient.post(environment.apiPhp + 'shop/customer', data, { headers: headers });
  }


  //recaptcha********************************************************************
  reCaptcha(data) {

    const headers = new HttpHeaders()
      .set('accept-language', this.locale)
      .set('Content-Type', 'application/json');

    return this._httpClient.put(environment.apiPhp + 'shared/recaptcha', data, { headers: headers });
  }

  //Retorna todas ordens de pagamento********************************************
  sendMessageProfessional(obj) {
    const headers = new HttpHeaders()
      .set('accept-language', this.locale)
      .set('Content-Type', 'application/json');

    return this._httpClient.post(environment.apiPhp + 'me/sendMail', obj, { headers: headers });
  }

  //Retorna os filtros de produtos***********************************************
  getFilterProduct(obj) {
    const httpOptions = {
      headers: new HttpHeaders()
        .set('accept-language', this.locale)
        .set('Content-Type', 'application/json')
    };

    return this._httpClient.put(environment.apiPhpV2 + 'products/filters', obj, httpOptions);
  }

  //Retorna os filtros de serviços***********************************************
  getFilterServices(obj) {
    const httpOptions = {
      headers: new HttpHeaders()
        .set('accept-language', this.locale)
        .set('Content-Type', 'application/json')
    };

    return this._httpClient.put(environment.apiPhpV2 + 'labors/filters', obj, httpOptions);
  }

  //Retorna a lista dos endereços de entrega**************************************
  getDeliveryAddress(addr = null) {
    const httpOptions = {
      headers: new HttpHeaders()
        .set('accept-language', this.locale)
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + this.getUserToken())
    };

    return this._httpClient.get(environment.apiPhpV2 + 'user/address' + (addr ? '/' + addr : ''), httpOptions);
  }

  //Adiciona um endereço de entrega***********************************************
  addDeliveryAddress(body) {
    const httpOptions = {
      headers: new HttpHeaders()
        .set('accept-language', this.locale)
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + this.getUserToken())
    };

    return this._httpClient.post(environment.apiPhpV2 + 'user/address', body, httpOptions);
  }

  //Exclui um endereço de entrega*************************************************
  deleteDeliveryAddress(idAdress) {
    const httpOptions = {
      headers: new HttpHeaders()
        .set('accept-language', this.locale)
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + this.getUserToken())
    };

    return this._httpClient.delete(environment.apiPhpV2 + 'user/address/' + idAdress, httpOptions);
  }

  //Atualiza o endereço***********************************************************
  updateDeliveryAddress(body, idAddress) {
    const httpOptions = {
      headers: new HttpHeaders()
        .set('accept-language', this.locale)
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + this.getUserToken())
    };

    return this._httpClient.put(environment.apiPhpV2 + 'user/address/' + idAddress, body, httpOptions);
  }

  //Seta um endereço de entrega como principal************************************
  setDeliveryAddressAsMain(idAddress) {
    const httpOptions = {
      headers: new HttpHeaders()
        .set('accept-language', this.locale)
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + this.getUserToken())
    };

    return this._httpClient.put(environment.apiPhpV2 + 'user/address/main/' + idAddress, null, httpOptions);
  }

  //Retorna os fretes*************************************************************
  getShippingPrice(body) {
    const httpOptions = {
      headers: new HttpHeaders()
        .set('accept-language', this.locale)
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + this.getUserToken())
    };

    return this._httpClient.post(environment.apiPhpV2 + 'products/shipping', body, httpOptions);
  }

  getAddresByCEP(cep) {
    return this._httpClient.get(environment.apiSearchCEP + cep + '/json');
  }

  //Retorna os meus pedidos**************************************
  getOrders(addr = null) {
    const httpOptions = {
      headers: new HttpHeaders()
        .set('accept-language', this.locale)
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + this.getUserToken())
    };

    return this._httpClient.put(environment.apiPhpV2 + 'checkout/orders', null, httpOptions);
  }

  //Retorna a lista de fretes por fornecedor***********************************************
  getShippingBySupplier(body) {
    const httpOptions = {
      headers: new HttpHeaders()
        .set('accept-language', this.locale)
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + this.getUserToken())
    };

    return this._httpClient.post(environment.apiPhpV2 + 'products/shipping', body, httpOptions);
  }

  getStatesFromCoutryIso() {
    const httpOptions = {
      headers: new HttpHeaders()
        .set('accept-language', this.locale)
        .set('Content-Type', 'application/json')
    };

    let iso = '';
    if (this.locale === 'pt-BR') {
      iso = 'BRA';
    }

    return this._httpClient.get(environment.apiPhp + 'all/newStatesFromCountryIso/' + iso, httpOptions);
  }

  getCitiesFromStateName(id) {
    const httpOptions = {
      headers: new HttpHeaders()
        .set('accept-language', this.locale)
        .set('Content-Type', 'application/json')
    };

    return this._httpClient.get(environment.apiPhp + 'all/newCitiesFromState/' + id, httpOptions);
  }

  listShops(state, city) {
    const httpOptions = {
      headers: new HttpHeaders()
        .set('accept-language', this.locale)
        .set('Content-Type', 'application/json')
    };

    return this._httpClient.get(environment.apiPhpV2 + 'shop/listShop/' + state + '/' + city, httpOptions);
  }

  //Registra um novo Lead **********************************************
  registerLead(data) {
    const headers = new HttpHeaders()
      .set('accept-language', this.locale)
      .set('Content-Type', 'application/json');

    return this._httpClient.post(environment.apiPhpV2 + 'lead', data, { headers: headers });
  }

  // Lista gategorias do Guia SmartComercial **********************************************
  categoriesGuide() {
    const headers = new HttpHeaders()
      .set('accept-language', this.locale)
      .set('Content-Type', 'application/json');

    return this._httpClient.get(environment.apiPhpV2 + 'guide/categories', { headers: headers });
  }

  // Lista as companias com gift por categorias selecionada **********************************************
  listGift(category: any) {
    const headers = new HttpHeaders()
      .set('accept-language', this.locale)
      .set('Content-Type', 'application/json');

    return this._httpClient.post(environment.apiPhpV2 + 'guide/list-gift', category, { headers: headers });
  }
  // Lista o gift por id **********************************************
  listGiftId(id: any) {
    const headers = new HttpHeaders()
      .set('accept-language', this.locale)
      .set('Content-Type', 'application/json');

    return this._httpClient.post(environment.apiPhpV2 + 'guide/list-gift-ids', id, { headers: headers });
  }
  // Lista os gifts vinculados ao id company **********************************************
  listGiftCompany(id: any) {
    const headers = new HttpHeaders()
      .set('accept-language', this.locale)
      .set('Content-Type', 'application/json');

    return this._httpClient.post(environment.apiPhpV2 + 'guide/list-gifts-company', id, { headers: headers });
  }
  // Lista os gifts da busca **********************************************
  listGiftSearch(search: any) {
    const headers = new HttpHeaders()
      .set('accept-language', this.locale)
      .set('Content-Type', 'application/json');

    return this._httpClient.post(environment.apiPhpV2 + 'guide/search-gifts', search, { headers: headers });
  }

  getCodeGiftCard(id) {
    const headers = new HttpHeaders()
      .set('accept-language', this.locale)
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.getUserToken());

    return this._httpClient.get(environment.apiPhpV2 + 'guide/code/' + id, { headers: headers });
  }

  getExtractGiftCards() {
    const headers = new HttpHeaders()
      .set('accept-language', this.locale)
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.getUserToken());
    return this._httpClient.get<any>(environment.apiPhpV2 + 'guide/getExtractGiftCards', { headers: headers });
  }

  checkedVoucher(data) {
    const headers = new HttpHeaders()
      .set('accept-language', 'pt-BR')
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.getUserToken());

    return this._httpClient.put(environment.apiPhpV2 + 'guide/gift/used', data, { headers: headers });
  }

  validVoucher(data) {
    const headers = new HttpHeaders()
      .set('accept-language', 'pt-BR')
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.getUserToken());

    return this._httpClient.get(environment.apiPhpV2 + 'guide/voucher/valid/' + data, { headers: headers });
  }

  usedVoucher(data) {
    const headers = new HttpHeaders()
      .set('accept-language', 'pt-BR')
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.getUserToken());

    return this._httpClient.put(environment.apiPhpV2 + 'guide/voucher/used', data, { headers: headers });
  }

  validvoucherpack(data): any {
    const headers = new HttpHeaders()
      .set('accept-language', 'pt-BR')
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.getUserToken());

    return this._httpClient.post(environment.apiPhpV2 + 'guide/validvoucherpack', data, { headers: headers });
  }

  listAdsPlans(): any {
    const headers = new HttpHeaders()
      .set('accept-language', 'pt-BR')
      .set('Content-Type', 'application/json');

    return this._httpClient.get(environment.apiPhpV2 + 'publicity/plans', { headers: headers });
  }

  listProductsAds(qtd: Number): any {
    const headers = new HttpHeaders()
      .set('accept-language', 'pt-BR')
      .set('Content-Type', 'application/json');

    return this._httpClient.get(environment.apiPhpV2 + 'products/listProductsAds/' + (qtd || 4), { headers: headers });
  }

  //lista os bancos********************************************
  getBanks(): any {
    const headers = new HttpHeaders()
      .set('accept-language', 'pt-BR')
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.getUserToken());

    return this._httpClient.get(environment.apiPhpV2 + 'tools/get-banks', { headers: headers });
  }
  // Gift Card
  getCompanyCategories() {
    const httpOptions = {
      headers: new HttpHeaders()
        .set('accept-language', 'pt-BR')
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + this.getUserToken())
    };

    return this._httpClient.get(environment.apiPhpV2 + 'guide/allcategories', httpOptions);
  }

  getCompanyUser(): any {
    let httpOptions;
    httpOptions = {
      headers: new HttpHeaders()
        .set('accept-language', 'pt-BR')
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + this.getUserToken())
    };
    return this._httpClient.get(environment.apiPhpV2 + 'guide/companyuser', httpOptions);
  }

  getGiftCardByUserId(): any {
    const headers = new HttpHeaders()
      .set('accept-language', 'pt-BR')
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.getUserToken());

    return this._httpClient.get(environment.apiPhpV2 + 'guide/giftuser', { headers: headers });
  }

  postCompany(data) {
    const headers = new HttpHeaders()
      .set('accept-language', 'pt-BR')
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.getUserToken());

    return this._httpClient.post(environment.apiPhpV2 + 'guide/company', data, { headers: headers });
  }

  supplierId(id): any {
    const headers = new HttpHeaders()
      .set('accept-language', 'pt-BR')
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.getUserToken());

    return this._httpClient.post(environment.apiPhpV2 + 'guide/supplierid', id, { headers: headers });
  }

  saveProducts(data) {
    this.products = data;
  }

  getLocalProduct(id) {
    if (this.products) {
      const prd = this.products.find(x => x.id === id);
      return prd;
    } else {
      return false;
    }
  }

  //lista Fornecedor********************************************
  getSupplier(): any {
    const headers = new HttpHeaders()
      .set('accept-language', 'pt-BR')
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.getUserToken());

    return this._httpClient.get(environment.apiPhpV2 + 'shop/supplier', { headers: headers });
  }
  postGiftCard(data) {
    const headers = new HttpHeaders()
      .set('accept-language', 'pt-BR')
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.getUserToken());

    return this._httpClient.post(environment.apiPhpV2 + 'guide/gift', data, { headers: headers });
  }

  // Gift Card
  getTotalVoucherById(id) {
    const httpOptions = {
      headers: new HttpHeaders()
        .set('accept-language', 'pt-BR')
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + this.getUserToken())
    };

    return this._httpClient.post(environment.apiPhpV2 + 'guide/totalvoucherbyid', id, httpOptions);
  }

  deleteGiftCard(data) {
    const headers = new HttpHeaders()
      .set('accept-language', 'pt-BR')
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.getUserToken());

    return this._httpClient.put(environment.apiPhpV2 + 'guide/gift/remove', data, { headers: headers });
  }

  getExtractItems(): any {
    const headers = new HttpHeaders()
      .set('accept-language', 'pt-BR')
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.getUserToken());

    return this._httpClient.get(environment.apiPhpV2 + 'shop/getExtractItems', { headers: headers });
  }
  requestPayment(data): any {
    const headers = new HttpHeaders()
      .set('accept-language', 'pt-BR')
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.getUserToken());

    return this._httpClient.post(environment.apiPhpV2 + 'shop/requestpay', data, { headers: headers });
  }

}
