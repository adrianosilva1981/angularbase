import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppComponent } from '@app-consultant-adm/app.component';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { LibLoginModule } from 'lib-login';
import { LibServicesModule } from 'lib-services';
import { LibNavbarModule } from 'lib-navbar';
import { LibComponentsModule } from 'lib-components';
import { ColorPickerModule } from 'ngx-color-picker';

import { CheckboxModule } from 'primeng/components/checkbox/checkbox';
import { PaginatorModule } from 'primeng/components/paginator/paginator';
import { DropdownModule } from 'primeng/components/dropdown/dropdown';
import { InputMaskModule } from 'primeng/components/inputmask/inputmask';
import { InputTextareaModule } from 'primeng/components/inputtextarea/inputtextarea';
import { TableModule } from 'primeng/table';
import { GrowlModule } from 'primeng/growl';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/components/dialog/dialog';
import { SidebarModule } from 'primeng/sidebar';
import { TextMaskModule } from 'angular2-text-mask';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { KeyFilterModule } from 'primeng/keyfilter';
import { TruncateModule } from 'ng2-truncate';
import { FileUploadModule } from 'primeng/components/fileupload/fileupload';

import { AppRouting } from '@app-consultant-adm/app.routing';
import { CleanComponent } from '@app-consultant-adm/layouts/clean/clean.component';
import { DataShopComponent } from '@app-consultant-adm/pages/data-shop/data-shop.component';
import { ConsultantGuard } from '@app-consultant-adm/services/consultant.guard';
import { SideMenuComponent } from '@app-consultant-adm/components/side-menu/side-menu.component';
import { SubNavbarComponent } from '@app-consultant-adm/components/sub-navbar/sub-navbar.component';
import { FooterComponent } from '@app-consultant-adm/components/footer/footer.component';
import { DomainComponent } from '@app-consultant-adm/pages/domain/domain.component';
import { SocialMediaComponent } from '@app-consultant-adm/pages/social-media/social-media.component';
import { LogoComponent } from '@app-consultant-adm/pages/logo/logo.component';
import { DefaultComponent } from '@app-consultant-adm/layouts/default/default.component';
import { ColorsComponent } from '@app-consultant-adm/pages/colors/colors.component';
import { ManagerServiceComponent } from '@app-consultant-adm/pages/manager-service/manager-service.component';
import { CatalogComponent } from '@app-consultant-adm/pages/catalog/catalog.component';
import { RequestsDetailsComponent } from '@app-consultant-adm/pages/requests-details/requests-details.component';
import { ResquestsShopComponent } from '@app-consultant-adm/pages/resquests-shop/resquests-shop.component';
import { DashboardComponent } from '@app-consultant-adm/pages/dashboard/dashboard.component';
import { ThumbnailPackComponent } from '@app-consultant-adm/components/thumbnail-pack/thumbnail-pack.component';

import { environment } from '@env/app-consultant-adm';

import { LibExtractModule } from 'lib-extract';

import { ManagerProductComponent } from './pages/manager-product/manager-product.component';
import { SupplierSalesComponent } from './pages/supplier-sales/supplier-sales.component';
import { SupplierSalesDetailComponent } from './pages/supplier-sales-detail/supplier-sales-detail.component';
import { ExtractComponent } from '@app-consultant-adm/pages/extract/extract.component';
import { CalendarModule } from 'primeng/calendar';
import { SelectButtonModule } from 'primeng/selectbutton';
import { BlackFridayComponent } from './pages/black-friday/black-friday.component';
import { BoxLoginRegisterComponent } from './components/box-login-register/box-login-register.component';
import { EditorModule } from 'primeng/editor';
import { PickListModule, ConfirmationService, ChipsModule, CardModule, MessagesModule, TabViewModule, ProgressSpinnerModule } from 'primeng/primeng';
import { RegisterCompanyComponent } from './pages/guide/company/register-company/register-company.component';
import { EditCompanyComponent } from './pages/guide/company/edit-company/edit-company.component';
import { ThumbnailCompanyComponent } from './pages/guide/company/thumbnail-company/thumbnail-company.component';
import { RegisterGiftCardComponent } from './pages/guide/giftCard/register-gift-card/register-gift-card.component';
import { EditGiftCardComponent } from './pages/guide/giftCard/edit-gift-card/edit-gift-card.component';
import { ThumbnailGiftCardComponent } from './pages/guide/giftCard/thumbnail-gift-card/thumbnail-gift-card.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { SupplierComponent } from './pages/guide/supplier/supplier.component';
import { PublishComponent } from './pages/publish-all/publish/publish.component';
import { MailMarketingComponent } from './pages/publish-all/mail-marketing/mail-marketing.component';
import { PageViewComponent } from './pages/publish-all/page-view/page-view.component';
import { BoxInfoComponent } from './components/box-info/box-info.component';
import { SharingComponent } from './pages/publish-all/sharing/sharing.component';
import { PostFacebookComponent } from './pages/publish-all/post-facebook/post-facebook.component';
import { PostInstagramComponent } from './pages/publish-all/post-instagram/post-instagram.component';
import { EditPublicityComponent } from './components/edit-publicity/edit-publicity.component';
import { MessageModule } from 'primeng/message';
import { PackComponent } from './pages/guide/company/pack/pack.component';
import { PublishExtractComponent } from './pages/publish-all/publish-extract/publish-extract.component';
import { AdsExtractShareComponent } from './components/ads-extract-share/ads-extract-share.component';
import { ShareDisapprovedComponent } from './components/ads-extract-share/share-disapproved/share-disapproved.component';
import { AdsExtractCpmComponent } from './components/ads-extract-cpm/ads-extract-cpm.component';
import { AdsExtractPostSocialNetComponent } from './components/ads-extract-post-social-net/ads-extract-post-social-net.component';
import { WithdrawComponent } from './pages/withdraw/withdraw.component';
import { SalesComponent } from './pages/guide/company/sales/sales.component';
import { ThumbnailGiftCardSalesComponent } from './pages/guide/company/sales/thumbnail-gift-card-sales/thumbnail-gift-card-sales.component';

@NgModule({
  declarations: [
    AppComponent,
    CleanComponent,
    DataShopComponent,
    SideMenuComponent,
    SubNavbarComponent,
    FooterComponent,
    DomainComponent,
    SocialMediaComponent,
    LogoComponent,
    DefaultComponent,
    ColorsComponent,
    ManagerServiceComponent,
    CatalogComponent,
    RequestsDetailsComponent,
    ResquestsShopComponent,
    DashboardComponent,
    ThumbnailPackComponent,
    ManagerProductComponent,
    SupplierSalesComponent,
    ExtractComponent,
    SupplierSalesDetailComponent,
    BoxLoginRegisterComponent,
    BlackFridayComponent,
    RegisterCompanyComponent,
    EditCompanyComponent,
    ThumbnailCompanyComponent,
    RegisterGiftCardComponent,
    EditGiftCardComponent,
    ThumbnailGiftCardComponent,
    SupplierComponent,
    PackComponent,
    SupplierComponent,
    PublishComponent,
    MailMarketingComponent,
    PageViewComponent,
    BoxInfoComponent,
    SharingComponent,
    PostFacebookComponent,
    PostInstagramComponent,
    EditPublicityComponent,
    PublishExtractComponent,
    AdsExtractShareComponent,
    ShareDisapprovedComponent,
    AdsExtractCpmComponent,
    AdsExtractPostSocialNetComponent,
    WithdrawComponent,
    SalesComponent,
    ThumbnailGiftCardSalesComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    LibLoginModule,
    LibServicesModule,
    LibNavbarModule,
    LibComponentsModule,
    DropdownModule,
    InputMaskModule,
    InputTextareaModule,
    ColorPickerModule,
    CheckboxModule,
    PaginatorModule,
    GrowlModule,
    TooltipModule,
    TableModule,
    DialogModule,
    SidebarModule,
    KeyFilterModule,
    TruncateModule,
    TextMaskModule,
    CurrencyMaskModule,
    LibExtractModule,
    FileUploadModule,
    CalendarModule,
    SelectButtonModule,
    AppRouting,
    EditorModule,
    PickListModule,
    ConfirmDialogModule,
    ChipsModule,
    CardModule,
    MessagesModule,
    MessageModule,
    TabViewModule,
    ProgressSpinnerModule
  ],
  entryComponents: [
    EditPublicityComponent,
    ShareDisapprovedComponent
  ],
  providers: [
    { provide: 'environments', useValue: environment },
    ConsultantGuard,
    ConfirmationService
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
