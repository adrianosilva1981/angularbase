import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { HyperCookieService, HyperToastsService, BroadcastEventService } from 'lib-services';
import { environment } from '@env/app-consultant-shop';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  public locale = 'pt-BR';
  public shopCartCookie: any = [];
  public favoriteCookie: any = [];

  private ownerStore: any = {};

  constructor(
    private _httpClient: HttpClient,
    private _hyperCookieService: HyperCookieService,
    private _hyperToastsService: HyperToastsService
  ) { }

  addBreadCrumb(obj) {
    BroadcastEventService.event('onBreadCrumb').emit(obj);
  }

  getConsultantID() {
    return this.ownerStore.id ? this.ownerStore.id.toString() : '';
  }

  // Seta o objeto do dono da loja
  setOwnerStore(owner) {
    this.ownerStore = owner;
  }

  // Retorna o Objeto do dono da loja
  getOwnerStore() {
    return this.ownerStore.subDomain ? this.ownerStore : {};
  }

  // Retorna o subdominio do dono da loja
  getSubdomainOwnerStore(complete = true) {
    if (this.ownerStore.subDomain) {
      return (complete ? '/store/' : '') + this.ownerStore.subDomain;
    } else {
      return '';
    }
  }

  //Retorna os dados do usuário logado no cookie********************************
  getUserData() {
    const cookieVal = this._hyperCookieService.getCookie_AUTH();
    if (cookieVal) {
      return cookieVal;
    }
  }

  //Retorna o token do usuário no cookie****************************************
  getUserToken() {
    const cookieVal = this.getUserData();
    if (cookieVal) {
      if (cookieVal.JWT) {
        return cookieVal.JWT;
      }
    }
  }

  //Adiciona Itens no cookie carrinho*******************************************
  addItemOnShopCart(itemCart: any, limitQuantity = 10) {
    limitQuantity = Number(limitQuantity);
    const shopcart = this._hyperCookieService.getCookie_SHOPCART(this.getSubdomainOwnerStore(false));

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
    const favorite = this._hyperCookieService.getCookie_FAVORITES(this.getSubdomainOwnerStore(false));

    if (favorite) {
      this.favoriteCookie = favorite;
    }

    const date = new Date();
    const dateString = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
    const itemID = itemADD.id;
    const valueWhenAdded = itemADD.value;

    const exists = this.favoriteCookie.findIndex(x => x.itemID === itemID && x.itemType === itemType);

    if (exists !== -1) {
      this.favoriteCookie.splice(exists, 1);
    }

    const objCookie = {
      itemType: itemType,
      itemID: itemID,
      dateAdd: dateString,
      valueWhenAdded: valueWhenAdded
    };

    this.favoriteCookie.unshift(objCookie);

    BroadcastEventService.event('updateShoppingFavorite').emit(this.favoriteCookie);
  }

  //Retorna o Consultor dono da Loja*********************************************
  getConsultantData(subdomain: string) {
    const headers = new HttpHeaders()
      .set('accept-language', this.locale)
      .set('Content-Type', 'application/json');

    return this._httpClient.get(environment.apiPhpV2 + 'associate/getshop/' + subdomain, { headers: headers });
  }

  //Retorna a lista de desejos**************************************************
  getWishList() {
    const headers = new HttpHeaders()
      .set('accept-language', this.locale)
      .set('Content-Type', 'application/json')
      .set('x-access-token', this.getUserToken());

    return this._httpClient.get(environment.apiPhpV2 + 'customers/wish-list', { headers: headers });
  }

  //Retorna os dados da orderm de todas as ordens de um usuário*******************
  getAllHyperOrder() {
    const httpOptions = {
      headers: new HttpHeaders()
        .set('accept-language', this.locale)
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + this.getUserToken())
        .set('x-consultant', this.getConsultantID())
    };

    return this._httpClient.get(environment.apiPhp + 'shop/orders', httpOptions);
  }

  //Retorna os serviços disponiveis da hyper jobs separados por categoria********
  getHyperServicesByCategory() {
    const httpOptions = {
      headers: new HttpHeaders()
        .set('accept-language', this.locale)
        .set('Content-Type', 'application/json')
        .set('x-consultant', this.getConsultantID())
    };

    return this._httpClient.get(environment.apiPhp + 'job/worker/hyperServices/resume', httpOptions);
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
          .set('x-consultant', this.getConsultantID())
      };
    } else {
      httpOptions = {
        headers: new HttpHeaders()
          .set('accept-language', this.locale)
          .set('Content-Type', 'application/json')
          .set('x-consultant', this.getConsultantID())
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
          .set('x-consultant', this.getConsultantID())
          .set('X-DataCustom', this.getOwnerStore().showHyperPrd)
      };
    } else {
      httpOptions = {
        headers: new HttpHeaders()
          .set('accept-language', this.locale)
          .set('Content-Type', 'application/json')
          .set('x-consultant', this.getConsultantID())
          .set('X-DataCustom', this.getOwnerStore().showHyperPrd)
      };
    }

    return this._httpClient.put(environment.apiPhpV2 + 'products', filter, httpOptions);
  }

  //Retorna o saldo do usuário logado*******************************************
  getUserBalance() {
    const httpOptions = {
      headers: new HttpHeaders()
        .set('accept-language', this.locale)
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + this.getUserToken())
        .set('x-consultant', this.getConsultantID())
    };

    return this._httpClient.get(environment.apiPhp + 'user/balance', httpOptions);
  }

  //Retorna a lista de categorias dos serviços da hyper**************************
  getAllCategoryHyperServices(params = '') {
    params = params === '/' ? '' : params;
    const httpOptions = {
      headers: new HttpHeaders()
        .set('accept-language', this.locale)
        .set('Content-Type', 'application/json')
        .set('x-consultant', this.getConsultantID())
    };

    return this._httpClient.get(environment.apiPhp + 'shared/hyperservice/filters' + params, httpOptions);
  }

  //Retorna os dados da orderm**************************************************
  getHyperOrder(order) {
    const httpOptions = {
      headers: new HttpHeaders()
        .set('accept-language', this.locale)
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + this.getUserToken())
        .set('x-consultant', this.getConsultantID())
    };
    return this._httpClient.put(environment.apiPhpV2 + 'checkout/orders/' + order, order, httpOptions);
  }

  //Registra o usuário na HyperJobs**********************************************
  registerInHJ(data) {
    const headers = new HttpHeaders()
      .set('accept-language', this.locale)
      .set('Content-Type', 'application/json')
      .set('x-consultant', this.getConsultantID());

    return this._httpClient.post(environment.apiPhp + 'shop/customer', data, { headers: headers });
  }

  addrGoogleMaps(adress) {
    const addr = adress.replace(/ /g, '+');
    return this._httpClient.get('https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyBIaHt1bk3Ih-twT-2jbuTdQlUephoK8-0&address=' + addr);
  }

  //Retorna os filtros de produtos***********************************************
  getFilterProduct(obj) {
    const httpOptions = {
      headers: new HttpHeaders()
        .set('accept-language', this.locale)
        .set('Content-Type', 'application/json')
        .set('x-consultant', this.getConsultantID())
        .set('X-DataCustom', this.getOwnerStore().showHyperPrd)
    };

    return this._httpClient.put(environment.apiPhpV2 + 'products/filters', obj, httpOptions);
  }

  //Retorna os filtros de serviços***********************************************
  getFilterServices(obj) {
    const httpOptions = {
      headers: new HttpHeaders()
        .set('accept-language', this.locale)
        .set('Content-Type', 'application/json')
        .set('x-consultant', this.getConsultantID())
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
        .set('x-consultant', this.getConsultantID())
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
        .set('x-consultant', this.getConsultantID())
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
        .set('x-consultant', this.getConsultantID())
    };

    return this._httpClient.post(environment.apiPhpV2 + 'products/shipping', body, httpOptions);
  }

  //Retorna os meus pedidos**************************************
  getOrders(addr = null) {
    const httpOptions = {
      headers: new HttpHeaders()
        .set('accept-language', this.locale)
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer ' + this.getUserToken())
        .set('x-consultant', this.getConsultantID())
    };

    return this._httpClient.put(environment.apiPhpV2 + 'checkout/orders', null, httpOptions);
  }

  getAddresByCEP(cep) {
    return this._httpClient.get(environment.apiSearchCEP + cep + '/json');
  }
}
