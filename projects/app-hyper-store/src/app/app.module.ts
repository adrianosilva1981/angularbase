import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { GrowlModule } from 'primeng/growl';
import { SidebarModule } from 'primeng/sidebar';
import { SplitButtonModule } from 'primeng/splitbutton';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RatingModule } from 'primeng/rating';
import { CaptchaModule } from 'primeng/captcha';
import { NguCarouselModule } from '@ngu/carousel';
import 'hammerjs';
import { TruncateModule } from 'ng2-truncate';
import { TextMaskModule } from 'angular2-text-mask';

import { LibLoginModule } from 'lib-login';
import { LibServicesModule } from 'lib-services';
import { LibNavbarModule } from 'lib-navbar';
import { LibComponentsModule } from 'lib-components';



import { environment } from '@env/app-hyper-store';
import { DefaultComponent } from '@app-hyper-store/layouts/default/default.component';
import { HomeComponent } from '@app-hyper-store/pages/home/home.component';
import { AppRouting } from '@app-hyper-store/app.routing';
import { AppComponent } from '@app-hyper-store/app.component';
import { SliderItemsComponent } from '@app-hyper-store/components/slider-items/slider-items.component';
import { SliderBannerComponent } from '@app-hyper-store/components/slider-banner/slider-banner.component';
import { BtnAddShopCartComponent } from '@app-hyper-store/components/btn-add-shop-cart/btn-add-shop-cart.component';
import { FilterServiceComponent } from '@app-hyper-store/components/filter-service/filter-service.component';
import { DetailServiceComponent } from '@app-hyper-store/pages/detail-service/detail-service.component';
import { DepartmentServiceComponent } from '@app-hyper-store/pages/department-service/department-service.component';
import { DepartmentProfessionalComponent } from '@app-hyper-store/pages/department-professional/department-professional.component';
import { SubNavbarComponent } from '@app-hyper-store/components/sub-navbar/sub-navbar.component';
import { FooterComponent } from '@app-hyper-store/components/footer/footer.component';
import { MyAccountComponent } from '@app-hyper-store/pages/my-account/my-account.component';
import { AuthGuard } from '@app-hyper-store/services/auth.guard';
import { OrderDetailsComponent } from '@app-hyper-store/pages/order-details/order-details.component';
import { OrderNumberComponent } from '@app-hyper-store/pages/order-number/order-number.component';
import { MyRequestsComponent } from '@app-hyper-store/pages/my-requests/my-requests.component';
import { OrderListComponent } from '@app-hyper-store/components/order-list/order-list.component';
import { OrderInfoComponent } from '@app-hyper-store/components/order-info/order-info.component';
import { FavoritesComponent } from '@app-hyper-store/pages/favorites/favorites.component';
import { ItemsInShopCartComponent } from '@app-hyper-store/components/items-in-shop-cart/items-in-shop-cart.component';
import { ShopCartComponent } from '@app-hyper-store/pages/shop-cart/shop-cart.component';
import { FilterProfessionalComponent } from '@app-hyper-store/components/filter-professional/filter-professional.component';
import { ThumbnailUserComponent } from '@app-hyper-store/components/thumbnail-user/thumbnail-user.component';
import { DetailProfessionalComponent } from '@app-hyper-store/pages/detail-professional/detail-professional.component';
import { ContactProfessionalComponent } from '@app-hyper-store/components/contact-professional/contact-professional.component';
import { CheckoutComponent } from '@app-hyper-store/pages/checkout/checkout.component';
import { BoxLoginRegisterComponent } from '@app-hyper-store/components/box-login-register/box-login-register.component';
import { ThumbnailServiceComponent } from '@app-hyper-store/components/thumbnail-service/thumbnail-service.component';
import { ThumbnailProducctComponent } from '@app-hyper-store/components/thumbnail-product/thumbnail-product.component';
import { DetailProductComponent } from '@app-hyper-store/pages/detail-product/detail-product.component';
import { DepartmentProductComponent } from '@app-hyper-store/pages/department-product/department-product.component';
import { FilterProdctComponent } from '@app-hyper-store/components/filter-product/filter-product.component';
import { AddressFormComponent } from '@app-hyper-store/components/address-form/address-form.component';
import { AddressDeliveryComponent } from '@app-hyper-store/components/address-delivery/address-delivery.component';
import { TableModule } from 'primeng/table';
import { PrimeComponent } from '@app-hyper-store/pages/prime/prime.component';
import { InputMaskModule } from 'primeng/inputmask';
import { BePrimeComponent } from '@app-hyper-store/pages/be-prime/be-prime.component';
import { FinishComponent } from '@app-hyper-store/layouts/finish/finish.component';
import { AddressFormModalComponent } from '@app-hyper-store/components/address-form-modal/address-form-modal.component';
import { ListShippingComponent } from '@app-hyper-store/components/list-shipping/list-shipping.component';
import { ShippingModalComponent } from '@app-hyper-store/components/shipping-modal/shipping-modal.component';
import { BuyCityComponent } from './pages/buy-city/buy-city.component';
import { ContactProviderComponent } from '@app-hyper-store/components/contact-provider/contact-provider.component';
import { DepartmentGuideComponent } from './pages/department-guide/department-guide.component';
import { ThumbnailGuideComponent } from './components/thumbnail-guide/thumbnail-guide.component';
import { GuideCompaniesComponent } from './pages/guide-companies/guide-companies.component';
import { DetailGuideComponent } from './pages/detail-guide/detail-guide.component';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { FilterGuideComponent } from './components/filter-guide/filter-guide.component';
import { SupplierLayoutComponent } from './layouts/supplier-layout/supplier-layout.component';
import { VoucherValidComponent } from './pages/supplier/voucher-valid/voucher-valid.component';
import { DashSupplierComponent } from './pages/supplier/dash-supplier/dash-supplier.component';
import { NgQrScannerModule } from 'angular2-qrscanner';
import { ProgressSpinnerModule, ConfirmDialogModule, EditorModule, PickListModule, DropdownModule, MessagesModule } from 'primeng/primeng';
import { QRCodeModule } from 'angularx-qrcode';
import { RegisterComponent } from './pages/supplier/register/register.component';
import { LoginPackComponent } from './pages/supplier/login/login.component';
import { CompanyComponent } from './pages/supplier/company/company.component';
import { EditGiftCardComponent } from './pages/supplier/giftCard/edit-gift-card/edit-gift-card.component';
import { RegisterGiftCardComponent } from './pages/supplier/giftCard/register-gift-card/register-gift-card.component';
import { ThumbnailGiftCardComponent } from './pages/supplier/giftCard/thumbnail-gift-card/thumbnail-gift-card.component';
import { AdsPlansComponent } from './pages/ads-plans/ads-plans.component';
import { VoucherExtractComponent } from './pages/supplier/voucher-extract/voucher-extract.component';
import { ByPointsComponent } from './pages/by-points/by-points.component';
import { FilterPointsComponent } from './components/filter-points/filter-points.component';
import { WithdrawComponent } from './pages/supplier/withdraw/withdraw.component';

@NgModule({
  declarations: [
    AppComponent,
    DefaultComponent,
    FinishComponent,
    HomeComponent,
    ThumbnailUserComponent,
    SubNavbarComponent,
    FooterComponent,
    SliderItemsComponent,
    SliderBannerComponent,
    BtnAddShopCartComponent,
    FilterServiceComponent,
    FilterProfessionalComponent,
    DetailProductComponent,
    DepartmentProductComponent,
    DetailServiceComponent,
    DetailProfessionalComponent,
    AddressFormComponent,
    AddressDeliveryComponent,
    ContactProfessionalComponent,
    AddressFormModalComponent,
    ShippingModalComponent,
    DepartmentServiceComponent,
    DepartmentProfessionalComponent,
    FilterProdctComponent,
    ThumbnailServiceComponent,
    ThumbnailProducctComponent,
    MyAccountComponent,
    MyRequestsComponent,
    OrderDetailsComponent,
    OrderNumberComponent,
    OrderListComponent,
    OrderInfoComponent,
    FavoritesComponent,
    ItemsInShopCartComponent,
    ShopCartComponent,
    CheckoutComponent,
    BoxLoginRegisterComponent,
    BePrimeComponent,
    PrimeComponent,
    ListShippingComponent,
    BuyCityComponent,
    ContactProviderComponent,
    DepartmentGuideComponent,
    ThumbnailGuideComponent,
    GuideCompaniesComponent,
    DetailGuideComponent,
    FilterGuideComponent,
    SupplierLayoutComponent,
    VoucherValidComponent,
    DashSupplierComponent,
    RegisterComponent,
    LoginPackComponent,
    CompanyComponent,
    EditGiftCardComponent,
    RegisterGiftCardComponent,
    ThumbnailGiftCardComponent,
    DashSupplierComponent,
    AdsPlansComponent,
    VoucherExtractComponent,
    ByPointsComponent,
    WithdrawComponent,
    FilterPointsComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    CommonModule,
    RouterModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    GrowlModule,
    SidebarModule,
    SplitButtonModule,
    RadioButtonModule,
    RatingModule,
    CaptchaModule,
    NguCarouselModule,
    TruncateModule,
    TextMaskModule,
    CurrencyMaskModule,
    LibLoginModule,
    LibServicesModule,
    LibNavbarModule,
    LibComponentsModule,
    TableModule,
    InputMaskModule,
    DropdownModule,
    AppRouting,
    NgQrScannerModule,
    ProgressSpinnerModule,
    ConfirmDialogModule,
    QRCodeModule,
    EditorModule,
    PickListModule,
    MessagesModule
  ],
  providers: [
    { provide: 'environments', useValue: environment },
    AuthGuard
  ],
  entryComponents: [
    ContactProfessionalComponent,
    AddressFormModalComponent,
    ShippingModalComponent,
    ContactProviderComponent,
    RegisterComponent,
    ThumbnailGiftCardComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
