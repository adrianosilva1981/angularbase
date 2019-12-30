import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TextMaskModule } from 'angular2-text-mask';
import { GrowlModule } from 'primeng/growl';
import { SidebarModule } from 'primeng/sidebar';
import { NguCarouselModule } from '@ngu/carousel';
import 'hammerjs';
import { TruncateModule } from 'ng2-truncate';
import { NguiMapModule } from '@ngui/map';

import { LibLoginModule } from 'lib-login';
import { LibServicesModule } from 'lib-services';
import { LibComponentsModule } from 'lib-components';
import { AppComponent } from '@app-consultant-shop/app.component';
import { environment } from '@env/app-consultant-shop';
import { AppRouting } from '@app-consultant-shop/app.routing';
import { DefaultComponent } from '@app-consultant-shop/layouts/default/default.component';
import { CleanComponent } from '@app-consultant-shop/layouts/clean/clean.component';
import { HomeComponent } from '@app-consultant-shop/pages/home/home.component';
import { NavbarComponent } from '@app-consultant-shop/components/navbar/navbar.component';
import { SubNavbarComponent } from '@app-consultant-shop/components/sub-navbar/sub-navbar.component';
import { FooterComponent } from '@app-consultant-shop/components/footer/footer.component';
import { MyAccountComponent } from '@app-consultant-shop/pages/my-account/my-account.component';
import { MyRequestsComponent } from '@app-consultant-shop/pages/my-requests/my-requests.component';
import { OrderListComponent } from '@app-consultant-shop/components/order-list/order-list.component';
import { SliderBannerComponent } from '@app-consultant-shop/components/slider-banner/slider-banner.component';
import { ThumbnailServiceComponent } from '@app-consultant-shop/components/thumbnail-service/thumbnail-service.component';
import { ThumbnailProducctComponent } from '@app-consultant-shop/components/thumbnail-product/thumbnail-product.component';
import { BtnAddShopCartComponent } from '@app-consultant-shop/components/btn-add-shop-cart/btn-add-shop-cart.component';
import { DetailServiceComponent } from '@app-consultant-shop/pages/detail-service/detail-service.component';
import { SliderItemsComponent } from '@app-consultant-shop/components/slider-items/slider-items.component';
import { FavoritesComponent } from '@app-consultant-shop/pages/favorites/favorites.component';
import { ShopCartComponent } from '@app-consultant-shop/pages/shop-cart/shop-cart.component';
import { ItemsInShopCartComponent } from '@app-consultant-shop/components/items-in-shop-cart/items-in-shop-cart.component';
import { CheckoutComponent } from '@app-consultant-shop/pages/checkout/checkout.component';
import { DepartmentServiceComponent } from '@app-consultant-shop/pages/department-service/department-service.component';
import { FilterServiceComponent } from '@app-consultant-shop/components/filter-service/filter-service.component';
import { OrderDetailsComponent } from '@app-consultant-shop/pages/order-details/order-details.component';
import { OrderInfoComponent } from '@app-consultant-shop/components/order-info/order-info.component';
import { SearchSubdomainComponent } from '@app-consultant-shop/pages/search-subdomain/search-subdomain.component';
import { AuthGuard } from '@app-consultant-shop/services/auth.guard';
import { BoxLoginRegisterComponent } from '@app-consultant-shop/components/box-login-register/box-login-register.component';
import { OrderNumberComponent } from '@app-consultant-shop/pages/order-number/order-number.component';
import { DepartmentProductComponent } from '@app-consultant-shop/pages/department-product/department-product.component';
import { FilterProdctComponent } from '@app-consultant-shop/components/filter-product/filter-product.component';
import { DetailProductComponent } from './pages/detail-product/detail-product.component';
import { AddressDeliveryComponent } from '@app-consultant-shop/components/address-delivery/address-delivery.component';
import { AddressFormComponent } from '@app-consultant-shop/components/address-form/address-form.component';
import { ListShippingComponent } from './components/list-shipping/list-shipping.component';
import { ShippingModalComponent } from './components/shipping-modal/shipping-modal.component';
import { AddressFormModalComponent } from './components/address-form-modal/address-form-modal.component';
import { CleanCheckoutComponent } from './layouts/clean-checkout/clean-checkout.component';
import { PrimeComponent } from './pages/prime/prime.component';
import { BePrimeComponent } from './pages/be-prime/be-prime.component';

@NgModule({
  declarations: [
    AppComponent,
    DefaultComponent,
    CleanComponent,
    HomeComponent,
    NavbarComponent,
    SubNavbarComponent,
    FooterComponent,
    SliderBannerComponent,
    MyAccountComponent,
    MyRequestsComponent,
    OrderDetailsComponent,
    OrderListComponent,
    OrderInfoComponent,
    OrderNumberComponent,
    ItemsInShopCartComponent,
    ShopCartComponent,
    FavoritesComponent,
    ThumbnailServiceComponent,
    ThumbnailProducctComponent,
    DepartmentServiceComponent,
    FilterServiceComponent,
    FilterProdctComponent,
    BtnAddShopCartComponent,
    DetailServiceComponent,
    SliderItemsComponent,
    CheckoutComponent,
    BoxLoginRegisterComponent,
    SearchSubdomainComponent,
    DepartmentProductComponent,
    DetailProductComponent,
    AddressDeliveryComponent,
    AddressFormComponent,
    ListShippingComponent,
    ShippingModalComponent,
    AddressFormModalComponent,
    CleanCheckoutComponent,
    PrimeComponent,
    BePrimeComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    TextMaskModule,
    GrowlModule,
    NguCarouselModule,
    TruncateModule,
    SidebarModule,
    NguiMapModule.forRoot({ apiUrl: 'https://maps.google.com/maps/api/js?key=AIzaSyBIaHt1bk3Ih-twT-2jbuTdQlUephoK8-0' }),
    LibLoginModule,
    LibServicesModule,
    LibComponentsModule,
    AppRouting
  ],
  providers: [
    { provide: 'environments', useValue: environment },
    AuthGuard
  ],
  bootstrap: [
    AppComponent
  ],
  entryComponents: [
    AddressFormModalComponent,
    ShippingModalComponent
  ],
})
export class AppModule { }
