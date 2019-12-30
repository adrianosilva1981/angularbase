import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { MatDialogModule, MatTabsModule } from '@angular/material';
import { TextMaskModule } from 'angular2-text-mask';

import { CurrencyMaskModule } from 'ng2-currency-mask';

import { LibComponentsModule } from 'lib-components';
import { LibServicesModule } from 'lib-services';

import { TableModule } from 'primeng/table';
import { PanelMenuModule } from 'primeng/panelmenu';
import { SidebarModule } from 'primeng/sidebar';
import { GrowlModule } from 'primeng/growl';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { ChartModule } from 'primeng/chart';
import { CalendarModule } from 'primeng/calendar';
import { FileUploadModule } from 'primeng/components/fileupload/fileupload';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule, PickListModule, BreadcrumbModule } from 'primeng/primeng';
import { InputSwitchModule } from 'primeng/inputswitch';

import { environment } from '@env/app-admin-back-office';

import { FinancingRequestComponent } from '@app-admin-back-office/pages/associates/payments/financing/financing-request/financing-request.component';
import { PaymentRequestsComponent } from '@app-admin-back-office/pages/reports/payment-requests/payment-requests.component';
import { AppComponent } from '@app-admin-back-office/app.component';
import { CleanComponent } from '@app-admin-back-office/layouts/clean/clean.component';
import { DefaultComponent } from '@app-admin-back-office/layouts/default/default.component';
import { LoginComponent } from '@app-admin-back-office/components/login/login.component';
import { DashboardComponent } from '@app-admin-back-office/pages/dashboard/dashboard.component';
import { NavbarComponent } from '@app-admin-back-office/components/navbar/navbar.component';
import { AuthenticateGuard } from '@app-admin-back-office/services/authenticate.guard';
import { AppRouting } from '@app-admin-back-office/app.routing';
import { PackSoldComponent } from '@app-admin-back-office/pages/reports/pack-sold/pack-sold.component';
import { DetailsAddressComponent } from '@app-admin-back-office/components/Modals/details-address/details-address.component';
import { CommissionsComponent } from '@app-admin-back-office/pages/reports/commissions/commissions.component';
import { CommissionsDetailsComponent } from '@app-admin-back-office/pages/reports/commissions/commissions-details/commissions-details.component';
import { ValidationDocumentComponent } from '@app-admin-back-office/pages/associates/validation-document/validation-document.component';
import { DialogImageComponent } from '@app-admin-back-office/components/dialog-image/dialog-image.component';
import { DischargeComponent } from '@app-admin-back-office/pages/reports/discharge/discharge.component';
import { BonificationsComponent } from '@app-admin-back-office/pages/reports/bonifications/bonifications.component';
import { PendingApprovalComponent } from '@app-admin-back-office/pages/associates/pending-approval/pending-approval.component';
import { PercentageComponent } from '@app-admin-back-office/pages/reports/percentage/percentage.component';
import { TopTenComponent } from '@app-admin-back-office/pages/reports/top-ten/top-ten.component';
import { DebitComponent } from '@app-admin-back-office/pages/associates/debit/debit.component';
import { DebitAssociateComponent } from '@app-admin-back-office/pages/associates/debit/debit-associate/debit-associate.component';
import { ManualPaymentComponent } from '@app-admin-back-office/pages/associates/manual-payment/manual-payment.component';
import { ManualPaymentEditComponent } from '@app-admin-back-office/pages/associates/manual-payment-edit/manual-payment-edit.component';
import { BonificationDetailsComponent } from '@app-admin-back-office/pages/reports/bonifications/bonification-details/bonification-details.component';
import { RequestDischargeComponent } from '@app-admin-back-office/pages/associates/request-discharge/request-discharge.component';
import { CreditComponent } from '@app-admin-back-office/pages/associates/credit/credit.component';
import { CreditAssociateComponent } from '@app-admin-back-office/pages/associates/credit/credit-associate/credit-associate.component';
import { PackSoldDetailsComponent } from '@app-admin-back-office/pages/reports/pack-sold/pack-sold-details/pack-sold-details.component';
import { RequestComponent } from '@app-admin-back-office/pages/associates/pack/request/request.component';
import { RequestAssociateComponent } from '@app-admin-back-office/pages/associates/pack/request/request-associate/request-associate.component';
import { ApprovalComponent } from '@app-admin-back-office/pages/associates/pack/approval/approval.component';
import { TopTenReceivedComponent } from '@app-admin-back-office/pages/reports/top-ten-received/top-ten-received.component';
import { InfoIndicatedComponent } from '@app-admin-back-office/pages/reports/info-indicated/info-indicated.component';
import { BalanceComponent } from '@app-admin-back-office/pages/associates/balance/balance.component';
import { BalanceDetailsComponent } from '@app-admin-back-office/pages/associates/balance/balance-details/balance-details.component';
import { AddGridComponent } from '@app-admin-back-office/pages/cells/grids/add/add-grid.component';
import { EditGridComponent } from '@app-admin-back-office/pages/cells/grids/edit/edit-grid.component';
import { ConfigGridComponent } from '@app-admin-back-office/pages/cells/grids/config/config-grid.component';
import { DetailGridComponent } from '@app-admin-back-office/pages/cells/grids/edit/detail-grid/detail-grid.component';
import { ListResellerComponent } from '@app-admin-back-office/components/Modals/list-reseller/list-reseller.component';
import { ListGridsComponent } from '@app-admin-back-office/components/Modals/list-grids/list-grids.component';
import { AddCellsComponent } from '@app-admin-back-office/pages/cells/add-cells/add-cells.component';
import { EditCellsComponent } from '@app-admin-back-office/pages/cells/edit-cells/edit-cells.component';
import { DetailCellComponent } from '@app-admin-back-office/pages/cells/edit-cells/detail-cell/detail-cell.component';
import { FinancingComponent } from '@app-admin-back-office/pages/associates/financing/financing.component';
import { ChangePasswordComponent } from '@app-admin-back-office/pages/profile/change-password/change-password.component';
import { AssociateStateComponent } from '@app-admin-back-office/pages/associates/associate-state/associate-state.component';
import { PrepaidCardComponent } from '@app-admin-back-office/pages/reports/prepaid-card/prepaid-card.component';
import { UploadImageComponent } from '@app-admin-back-office/pages/layout/upload-image/upload-image.component';
import { ImageBackofficeComponent } from '@app-admin-back-office/pages/layout/image-backoffice/image-backoffice.component';
import { AssociatesComponent } from '@app-admin-back-office/pages/associates/associates/associates.component';
import { AssociateEditComponent } from '@app-admin-back-office/pages/associates/associates/associate-edit/associate-edit.component';
import { DeleteResellerComponent } from '@app-admin-back-office/pages/associates/associates/delete-reseller/delete-reseller.component';
import { QualificationComponent } from '@app-admin-back-office/pages/reports/qualification/qualification.component';
import { FinancingPlotsComponent } from '@app-admin-back-office/pages/associates/payments/financing/financing-plots/financing-plots.component';
import { PaymentFinancingPlotComponent } from '@app-admin-back-office/pages/associates/payments/financing/financing-plots/payment-financing-plot/payment-financing-plot.component';
import { ConnectionByFinancingComponent } from '@app-admin-back-office/pages/associates/payments/financing/associate-financing/connection-by-financing/connection-by-financing.component';
import { AssociateFinancingComponent } from '@app-admin-back-office/pages/associates/payments/financing/associate-financing/associate-financing.component';
import { PaymentRequestComponent } from '@app-admin-back-office/pages/associates/payments/payment-request/payment-request.component';
import { MembershipPaymentRequestComponent } from '@app-admin-back-office/pages/associates/payments/payment-request/membership-payment-request/membership-payment-request.component';
import { FindConnectionRequestComponent } from '@app-admin-back-office/pages/associates/payments/find-connection-request/find-connection-request.component';
import { ConnectionRequestAuthorizationComponent } from '@app-admin-back-office/pages/associates/payments/find-connection-request/connection-request-authorization/connection-request-authorization.component';
import { MonthlyComponent } from '@app-admin-back-office/pages/associates/payments/monthly/monthly.component';
import { MonthlyPaymentComponent } from '@app-admin-back-office/pages/associates/payments/monthly/monthly-payment/monthly-payment.component';
import { AdminComponent } from '@app-admin-back-office/pages/admin/admin.component';
import { InfoConnectionsComponent } from '@app-admin-back-office/pages/admin/info-connections/info-connections.component';
import { InfoMonthlyPaymentComponent } from '@app-admin-back-office/pages/admin/info-monthly-payment/info-monthly-payment.component';
import { DetailsInfoConnectionsComponent } from '@app-admin-back-office/pages/admin/info-connections/details-info-connections/details-info-connections.component';
import { InfoConnectionsByGridComponent } from '@app-admin-back-office/pages/admin/info-connections-by-grid/info-connections-by-grid.component';
import { DetailsInfoMonthlyComponent } from '@app-admin-back-office/pages/admin/info-monthly-payment/details-info-monthly/details-info-monthly.component';
import { InfoConsumptionComponent } from '@app-admin-back-office/pages/admin/info-consumption/info-consumption.component';
import { DetailsInfoConsumptionComponent } from '@app-admin-back-office/pages/admin/info-consumption/details-info-consumption/details-info-consumption.component';
import { InfoPreRegistrationComponent } from '@app-admin-back-office/pages/admin/info-pre-registration/info-pre-registration.component';
import { SolicitationFinancingComponent } from '@app-admin-back-office/pages/associates/payments/financing/financing-request/solicitation-financing/solicitation-financing.component';
import { FinancialClosingComponent } from '@app-admin-back-office/pages/reports/financial-closing/financial-closing.component';
import { DetailsInfoGridComponent } from '@app-admin-back-office/pages/admin/info-connections-by-grid/details-info-grid/details-info-grid.component';
import { InfoFinancingComponent } from '@app-admin-back-office/pages/admin/info-financing/info-financing.component';
import { InfoGraduationComponent } from '@app-admin-back-office/pages/admin/info-graduation/info-graduation.component';
import { InfoRescueComponent } from '@app-admin-back-office/pages/admin/info-rescue/info-rescue.component';
import { InfoQuotasComponent } from '@app-admin-back-office/pages/admin/info-quotas/info-quotas.component';
import { InfoTicketsKitsComponent } from '@app-admin-back-office/pages/admin/info-tickets-kits/info-tickets-kits.component';
import { ExtractAdmComponent } from './pages/reports/extract-adm/extract-adm.component';

@NgModule({
  declarations: [
    AppComponent,
    CleanComponent,
    DefaultComponent,
    LoginComponent,
    DashboardComponent,
    FinancingRequestComponent,
    SolicitationFinancingComponent,
    PaymentRequestsComponent,
    NavbarComponent,
    PackSoldComponent,
    DetailsAddressComponent,
    CommissionsComponent,
    CommissionsDetailsComponent,
    AssociatesComponent,
    AssociateEditComponent,
    ValidationDocumentComponent,
    DialogImageComponent,
    DischargeComponent,
    BonificationsComponent,
    PendingApprovalComponent,
    PercentageComponent,
    TopTenComponent,
    DebitComponent,
    DebitAssociateComponent,
    ManualPaymentComponent,
    ManualPaymentEditComponent,
    BonificationDetailsComponent,
    RequestDischargeComponent,
    CreditComponent,
    CreditAssociateComponent,
    PackSoldDetailsComponent,
    RequestComponent,
    RequestAssociateComponent,
    ApprovalComponent,
    TopTenReceivedComponent,
    InfoIndicatedComponent,
    BalanceComponent,
    BalanceDetailsComponent,
    AddGridComponent,
    EditGridComponent,
    ConfigGridComponent,
    ListResellerComponent,
    ListGridsComponent,
    DetailGridComponent,
    EditCellsComponent,
    AddCellsComponent,
    DetailCellComponent,
    FinancingComponent,
    ChangePasswordComponent,
    DeleteResellerComponent,
    AssociateStateComponent,
    PrepaidCardComponent,
    ImageBackofficeComponent,
    UploadImageComponent,
    QualificationComponent,
    FinancingPlotsComponent,
    PaymentFinancingPlotComponent,
    ConnectionByFinancingComponent,
    AssociateFinancingComponent,
    PaymentRequestComponent,
    MembershipPaymentRequestComponent,
    FindConnectionRequestComponent,
    ConnectionRequestAuthorizationComponent,
    MonthlyComponent,
    MonthlyPaymentComponent,
    AdminComponent,
    InfoConnectionsComponent,
    InfoMonthlyPaymentComponent,
    DetailsInfoConnectionsComponent,
    InfoConnectionsByGridComponent,
    DetailsInfoMonthlyComponent,
    InfoConsumptionComponent,
    DetailsInfoConsumptionComponent,
    DetailsInfoGridComponent,
    InfoPreRegistrationComponent,
    FinancialClosingComponent,
    InfoFinancingComponent,
    InfoGraduationComponent,
    InfoRescueComponent,
    InfoQuotasComponent,
    InfoTicketsKitsComponent,
    ExtractAdmComponent
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
    CurrencyMaskModule,
    TextMaskModule,
    InputMaskModule,
    InputSwitchModule,
    PickListModule,
    BreadcrumbModule
  ],
  providers: [
    { provide: 'environments', useValue: environment },
    AuthenticateGuard,
    NavbarComponent
  ], entryComponents: [
    DialogImageComponent,
    DetailsAddressComponent,
    ListResellerComponent,
    ListGridsComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
