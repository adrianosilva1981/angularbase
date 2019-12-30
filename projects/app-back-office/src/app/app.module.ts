import { MonthlyGuard } from './services/monthly.guard';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { CurrencyMaskModule } from 'ng2-currency-mask';
import { TextMaskModule } from 'angular2-text-mask';
import { ImageCropperModule } from 'ng2-img-cropper';
import { MatDialogModule, MatCheckboxModule, MatFormFieldModule, MatPaginatorModule, MatStepperModule, MatSelectModule } from '@angular/material';
import { ProgressBarModule, OrderListModule, OverlayPanelModule, CheckboxModule, CaptchaModule, DataScrollerModule, InputTextModule, SidebarModule, RadioButtonModule, GrowlModule, PanelModule, EditorModule, CardModule, OrganizationChartModule, PickListModule, DropdownModule, TabViewModule, TooltipModule, CarouselModule, MultiSelectModule } from 'primeng/primeng';
import { QRCodeModule } from 'angularx-qrcode';

import { InputMaskModule } from 'primeng/inputmask';
import { TableModule } from 'primeng/table';
import { MglTimelineModule } from 'angular-mgl-timeline';
import { LibComponentsModule } from 'lib-components';
import { LibServicesModule } from 'lib-services';
import { TruncateModule } from 'ng2-truncate';
import { LibQuestionnaireModule } from 'lib-questionnaire';

import { environment } from '@env/app-back-office';
import { AppComponent } from '@app-back-office/app.component';
import { AppRouting } from '@app-back-office/app.routing';
import { CleanComponent } from '@app-back-office/layouts/clean/clean.component';
import { ActiveGuard } from '@app-back-office/services/active.guard';
import { AuthGuard } from '@app-back-office/services/auth.guard';
import { EditLeadDialogComponent } from '@app-back-office/components/modals/edit-lead/edit-lead.component';
import { LoginComponent } from '@app-back-office/components/login/login.component';
import { PreRegisterComponent } from '@app-back-office/components/pre-register/pre-register.component';
import { ForgotPasswordComponent } from '@app-back-office/components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from '@app-back-office/components/reset-password/reset-password.component';
import { FooterComponent } from '@app-back-office/components/footer/footer.component';
import { NavbarComponent } from '@app-back-office/components/navbar/navbar.component';
import { NavtopComponent } from '@app-back-office/components/navtop/navtop.component';
import { LoadingComponent } from '@app-back-office/components/loading/loading.component';
import { CreditCardComponent } from '@app-back-office/components/credit-card/credit-card.component';
import { ResellerInfoComponent } from '@app-back-office/components/modals/reseller-info/reseller-info.component';
import { MoveChangeResellerComponent } from '@app-back-office/components/modals/move-change-reseller/move-change-reseller.component';

import { LoginLayoutComponent } from '@app-back-office/layouts/login/login.component';
import { HomeLayoutComponent } from '@app-back-office/layouts/home/home.component';
import { TreeContaienrComponent } from '@app-back-office/pages/tree/tree.component';
import { ExtractContaienrComponent } from '@app-back-office/pages/extract/extract.component';
import { RegisterResellerComponent } from '@app-back-office/pages/register-reseller/register-reseller.component';
import { AccessPlansComponent } from '@app-back-office/pages/access-plans/access-plans.component';
import { AccessCheckoutComponent } from '@app-back-office/pages/access-checkout/access-checkout.component';
import { UpgradeCheckoutComponent } from '@app-back-office/pages/upgrade-checkout/upgrade-checkout.component';
import { DivulgationComponent } from '@app-back-office/pages/divulgation/divulgation.component';
import { ChoosePathContainerComponent } from '@app-back-office/pages/choose-path/choose-path.component';
import { HomePageComponent } from '@app-back-office/pages/home-page/home-page.component';
import { CheckoutSuccessComponent } from '@app-back-office/pages/access-checkout/checkout-success/checkout-success.component';
import { ManageLeadsContainerComponent } from '@app-back-office/pages/manage-leads/manage-leads.component';
import { AddLeadsContainerComponent } from '@app-back-office/pages/add-leads/add-leads.component';
import { MyacountComponent } from '@app-back-office/pages/myacount/myacount.component';
import { LoginContainerComponent } from '@app-back-office/pages/login/login.component';
import { NewCountersignComponent } from '@app-back-office/components/new-countersign/new-countersign.component';
import { TeanPreRegisterComponent } from '@app-back-office/components/tean-pre-register/tean-pre-register.component';
import { TeanTableComponent } from '@app-back-office/components/tean-table/tean-table.component';
import { CardTeanTableComponent } from '@app-back-office/components/card-tean-table/card-tean-table.component';
import { Interceptor } from '@app-back-office/services/interceptor';
import { BitcoinComponent } from '@app-back-office/pages/bitcoin/bitcoin.component';
import { InfoPackComponent } from '@app-back-office/components/modals/info-pack/info-pack.component';
import { InfoRescueComponent } from '@app-back-office/components/modals/info-rescue/info-rescue.component';
import { ResaleProductsComponent } from '@app-back-office/pages/resale-products/resale-products.component';
import { PrepaidCardComponent } from '@app-back-office/pages/prepaid-card/prepaid-card.component';
import { RescueComponent } from '@app-back-office/pages/rescue/rescue.component';
import { ProductsCheckoutComponent } from '@app-back-office/pages/resale-products/products-checkout/products-checkout.component';
import { ProductsMypurchaseComponent } from '@app-back-office/pages/resale-products/products-mypurchase/products-mypurchase.component';
import { DocumentsComponent } from '@app-back-office/pages/documents/documents.component';
import { MonthlyCheckoutComponent } from '@app-back-office/pages/monthly-checkout/monthly-checkout.component';
import { InfoGraduationComponent } from '@app-back-office/components/modals/info-graduation/info-graduation.component';
import { VouchersComponent } from '@app-back-office/pages/vouchers/vouchers.component';
import { GoogleAuthenticatorComponent } from '@app-back-office/pages/google-authenticator/google-authenticator.component';
import { RequestFinancingComponent } from '@app-back-office/components/request-financing/request-financing.component';
import { FinancingCheckoutComponent } from '@app-back-office/pages/financing-checkout/financing-checkout.component';
import { EbooksComponent } from '@app-back-office/pages/ebooks/ebooks.component';
import { QuizWellcomeComponent } from '@app-back-office/components/modals/quiz-wellcome/quiz-wellcome.component';
import { InfoPointsComponent } from '@app-back-office/pages/info-points/info-points.component';
import { BonusComponent } from '@app-back-office/pages/bonus/bonus.component';
import { TeamTreeComponent } from '@app-back-office/components/team-tree/team-tree.component';
import { GalaxiaRegisterComponent } from '@app-back-office/components/galaxia-register/galaxia-register.component';
import { GalaxiaLoginComponent } from '@app-back-office/components/galaxia-login/galaxia-login.component';
import { GalaxiaComponent } from '@app-back-office/pages/galaxia/galaxia.component';
import { MarketingComponent } from '@app-back-office/pages/marketing/marketing.component';
import { APNComponent } from '@app-back-office/pages/apn/apn.component';
import { TravelComponent } from '@app-back-office/pages/travel/travel.component';
import { TeamInactiveComponent } from '@app-back-office/components/team-inactive/team-inactive.component';
import { TeamManagerComponent } from './components/team-manager/team-manager.component';
import { FindersfeeComponent } from './pages/findersfee/findersfee.component';
import { InfoDebitsComponent } from '@app-back-office/components/modals/info-debits/info-debits.component';
import { PublicityComponent } from './pages/resale-products/publicity/publicity.component';
import { RegisterPublisherComponent } from './pages/register-publisher/register-publisher.component';
import { SpreadComponent } from './pages/spread/spread.component';


@NgModule({
  declarations: [
    AppComponent,
    CleanComponent,
    EditLeadDialogComponent,
    LoginComponent,
    PreRegisterComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    FooterComponent,
    NavbarComponent,
    NavtopComponent,
    LoadingComponent,
    CreditCardComponent,
    ResellerInfoComponent,
    MoveChangeResellerComponent,
    LoginContainerComponent,
    TreeContaienrComponent,
    ExtractContaienrComponent,
    HomeLayoutComponent,
    LoginLayoutComponent,
    RegisterResellerComponent,
    AccessPlansComponent,
    AccessCheckoutComponent,
    UpgradeCheckoutComponent,
    DivulgationComponent,
    ChoosePathContainerComponent,
    HomePageComponent,
    CheckoutSuccessComponent,
    ManageLeadsContainerComponent,
    AddLeadsContainerComponent,
    MyacountComponent,
    NewCountersignComponent,
    TeanPreRegisterComponent,
    TeanTableComponent,
    CardTeanTableComponent,
    BitcoinComponent,
    InfoPackComponent,
    InfoRescueComponent,
    InfoDebitsComponent,
    ResaleProductsComponent,
    PrepaidCardComponent,
    RescueComponent,
    ProductsCheckoutComponent,
    ProductsMypurchaseComponent,
    DocumentsComponent,
    MonthlyCheckoutComponent,
    InfoGraduationComponent,
    VouchersComponent,
    GoogleAuthenticatorComponent,
    RequestFinancingComponent,
    FinancingCheckoutComponent,
    EbooksComponent,
    QuizWellcomeComponent,
    InfoPointsComponent,
    BonusComponent,
    TeamTreeComponent,
    GalaxiaRegisterComponent,
    GalaxiaLoginComponent,
    GalaxiaComponent,
    MarketingComponent,
    APNComponent,
    TravelComponent,
    TeamInactiveComponent,
    TeamManagerComponent,
    FindersfeeComponent,
    PublicityComponent,
    RegisterPublisherComponent,
    SpreadComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    RouterModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    GrowlModule,
    LibComponentsModule,
    LibServicesModule,
    MatDialogModule,
    MatCheckboxModule,
    TextMaskModule,
    ImageCropperModule,
    InputTextModule,
    SidebarModule,
    RadioButtonModule,
    PickListModule,
    TableModule,
    CardModule,
    EditorModule,
    PanelModule,
    DropdownModule,
    OrganizationChartModule,
    InputMaskModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatStepperModule,
    MatSelectModule,
    TabViewModule,
    TooltipModule,
    DataScrollerModule,
    MglTimelineModule,
    CaptchaModule,
    CheckboxModule,
    CurrencyMaskModule,
    ProgressBarModule,
    OrderListModule,
    OverlayPanelModule,
    TruncateModule,
    AppRouting,
    QRCodeModule,
    LibQuestionnaireModule,
    CarouselModule,
    MultiSelectModule
  ],
  entryComponents: [
    EditLeadDialogComponent,
    ResellerInfoComponent,
    MoveChangeResellerComponent,
    InfoPackComponent,
    InfoRescueComponent,
    InfoDebitsComponent,
    InfoGraduationComponent,
    RequestFinancingComponent,
    QuizWellcomeComponent
  ],
  providers: [
    { provide: 'environments', useValue: environment },
    ActiveGuard,
    MonthlyGuard,
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: Interceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
