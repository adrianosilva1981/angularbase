import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRouting } from '@app-admin-youhubshop/app.routing';
import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import { LoginComponent } from '@app-admin-youhubshop/components/login/login.component';
import { CleanComponent } from '@app-admin-youhubshop/layouts/clean/clean.component';
import { DefaultComponent } from '@app-admin-youhubshop/layouts/default/default.component';
import { DashboardComponent } from '@app-admin-youhubshop/pages/dashboard/dashboard.component';
import { PaymentRequestsComponent } from '@app-admin-youhubshop/pages/reports/payment-requests/payment-requests.component';
import { NavbarComponent } from '@app-admin-youhubshop/components/navbar/navbar.component';
import { PackSoldComponent } from '@app-admin-youhubshop/pages/reports/pack-sold/pack-sold.component';
import { DetailsAddressComponent } from '@app-admin-youhubshop/components/Modals/details-address/details-address.component';
import { MatTabsModule, MatDialogModule } from '@angular/material';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LibComponentsModule } from 'lib-components';
import { LibServicesModule } from 'lib-services';
import { GrowlModule } from 'primeng/growl';
import { TableModule } from 'primeng/table';
import { SidebarModule } from 'primeng/sidebar';
import { CheckboxModule, DropdownModule, FileUploadModule, PanelMenuModule, ChartModule, DialogModule, InputTextModule, CalendarModule, MultiSelectModule, BreadcrumbModule } from 'primeng/primeng';
import { AuthenticateGuard } from '@app-admin-youhubshop/services/authenticate.guard';
import { TopTenComponent } from '@app-admin-youhubshop/pages/reports/top-ten/top-ten.component';
import { PerformanceComponent } from '@app-admin-youhubshop/pages/reports/performance/performance.component';
import { CommissionsComponent } from '@app-admin-youhubshop/pages/financial/commissions/commissions.component';
import { PaymentsComponent } from '@app-admin-youhubshop/pages/financial/payment-by-supplier/payments/payments.component';
import { PaymentBySupplierComponent } from '@app-admin-youhubshop/pages/financial/payment-by-supplier/payment-by-supplier.component';
import { HubmixDetailsComponent } from '@app-admin-youhubshop/pages/reports/performance/hubmix-details/hubmix-details.component';
import { ReportPaymentsComponent } from '@app-admin-youhubshop/pages/financial/report-payments/report-payments.component';
import { ImagesComponent } from '@app-admin-youhubshop/components/Modals/images/images.component';
import { ProductsBySupplierComponent } from '@app-admin-youhubshop/pages/reports/products-by-supplier/products-by-supplier.component';
import { ProductsComponent } from '@app-admin-youhubshop/pages/reports/products-by-supplier/products/products.component';
import { ShopsComponent } from '@app-admin-youhubshop/pages/dashboard/shops/shops.component';
import { DetailsShopComponent } from '@app-admin-youhubshop/pages/dashboard/shops/details-shop/details-shop.component';
import { SuppliersComponent } from '@app-admin-youhubshop/pages/dashboard/suppliers/suppliers.component';
import { DetailsSuppliersComponent } from '@app-admin-youhubshop/pages/dashboard/suppliers/details-suppliers/details-suppliers.component';
import { GiftCardComponent } from '@app-admin-youhubshop/pages/dashboard/gift-card/gift-card.component';
import { InfoProductsComponent } from '@app-admin-youhubshop/pages/dashboard/info-products/info-products.component';
import { ServicesComponent } from '@app-admin-youhubshop/pages/dashboard/services/services.component';
import { UsersComponent } from '@app-admin-youhubshop/pages/dashboard/users/users.component';
import { UserDetailsComponent } from '@app-admin-youhubshop/pages/dashboard/users/user-details/user-details.component';

@NgModule({
  declarations: [
    AppComponent,
    AppComponent,
    CleanComponent,
    DefaultComponent,
    LoginComponent,
    DashboardComponent,
    PaymentRequestsComponent,
    NavbarComponent,
    PackSoldComponent,
    DetailsAddressComponent,
    TopTenComponent,
    PaymentsComponent,
    PaymentBySupplierComponent,
    PerformanceComponent,
    ProductsComponent,
    CommissionsComponent,
    HubmixDetailsComponent,
    ReportPaymentsComponent,
    ImagesComponent,
    ProductsBySupplierComponent,
    ShopsComponent,
    DetailsShopComponent,
    SuppliersComponent,
    DetailsSuppliersComponent,
    GiftCardComponent,
    InfoProductsComponent,
    ServicesComponent,
    UsersComponent,
    UserDetailsComponent
  ],
  imports: [
    RouterModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    BrowserAnimationsModule,
    HttpClientModule,
    LibComponentsModule,
    LibServicesModule,
    GrowlModule,
    AppRouting,
    TableModule,
    MatTabsModule,
    SidebarModule,
    MatDialogModule,
    CheckboxModule,
    DropdownModule,
    FileUploadModule,
    PanelMenuModule,
    ChartModule,
    DialogModule,
    InputTextModule,
    CalendarModule,
    MultiSelectModule,
    BreadcrumbModule
  ],
  providers: [
    { provide: 'environments', useValue: environment },
    AuthenticateGuard,
    NavbarComponent
  ],
  bootstrap: [AppComponent],
  entryComponents: [ImagesComponent]
})
export class AppModule { }
