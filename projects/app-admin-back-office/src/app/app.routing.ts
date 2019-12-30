import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NotFoundComponent } from 'lib-components';

import { CleanComponent } from '@app-admin-back-office/layouts/clean/clean.component';
import { DefaultComponent } from '@app-admin-back-office/layouts/default/default.component';
import { LoginComponent } from '@app-admin-back-office/components/login/login.component';
import { DashboardComponent } from '@app-admin-back-office/pages/dashboard/dashboard.component';
import { AuthenticateGuard } from '@app-admin-back-office/services/authenticate.guard';
import { PermissionsGuard } from '@app-admin-back-office/services/permissions.guard';
import { SolicitationFinancingComponent } from '@app-admin-back-office/pages/associates/payments/financing/financing-request/solicitation-financing/solicitation-financing.component';
import { FinancingRequestComponent } from '@app-admin-back-office/pages/associates/payments/financing/financing-request/financing-request.component';
import { PaymentRequestsComponent } from '@app-admin-back-office/pages/reports/payment-requests/payment-requests.component';
import { PackSoldComponent } from '@app-admin-back-office/pages/reports/pack-sold/pack-sold.component';
import { CommissionsComponent } from '@app-admin-back-office/pages/reports/commissions/commissions.component';
import { CommissionsDetailsComponent } from '@app-admin-back-office/pages/reports/commissions/commissions-details/commissions-details.component';
import { ValidationDocumentComponent } from '@app-admin-back-office/pages/associates/validation-document/validation-document.component';
import { DischargeComponent } from '@app-admin-back-office/pages/reports/discharge/discharge.component';
import { BonificationsComponent } from '@app-admin-back-office/pages/reports/bonifications/bonifications.component';
import { PendingApprovalComponent } from '@app-admin-back-office/pages/associates/pending-approval/pending-approval.component';
import { PercentageComponent } from '@app-admin-back-office/pages/reports/percentage/percentage.component';
import { TopTenComponent } from '@app-admin-back-office/pages/reports/top-ten/top-ten.component';
import { DebitComponent } from '@app-admin-back-office/pages/associates/debit/debit.component';
import { DebitAssociateComponent } from '@app-admin-back-office/pages/associates/debit/debit-associate/debit-associate.component';
import { ManualPaymentComponent } from './pages/associates/manual-payment/manual-payment.component';
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
import { DetailGridComponent } from '@app-admin-back-office/pages/cells/grids/edit/detail-grid/detail-grid.component';
import { ConfigGridComponent } from '@app-admin-back-office/pages/cells/grids/config/config-grid.component';
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
import { DetailsInfoGridComponent } from '@app-admin-back-office/pages/admin/info-connections-by-grid/details-info-grid/details-info-grid.component';
import { FinancialClosingComponent } from '@app-admin-back-office/pages/reports/financial-closing/financial-closing.component';
import { InfoFinancingComponent } from '@app-admin-back-office/pages/admin/info-financing/info-financing.component';
import { InfoGraduationComponent } from '@app-admin-back-office/pages/admin/info-graduation/info-graduation.component';
import { InfoRescueComponent } from '@app-admin-back-office/pages/admin/info-rescue/info-rescue.component';
import { InfoQuotasComponent } from '@app-admin-back-office/pages/admin/info-quotas/info-quotas.component';
import { InfoTicketsKitsComponent } from '@app-admin-back-office/pages/admin/info-tickets-kits/info-tickets-kits.component';
import { ExtractAdmComponent } from './pages/reports/extract-adm/extract-adm.component';

const AppRoutes: Routes = [
    {// Layout DefaultComponent
        path: '',
        component: DefaultComponent,
        children: [
            {
                path: '',
                component: DashboardComponent,
                canActivate: [AuthenticateGuard],
            },
            {
                path: 'dash',
                component: DashboardComponent,
                canActivate: [AuthenticateGuard]
            },
            {
                path: 'associates/payments/financing-request',
                component: FinancingRequestComponent,
                canActivate: [AuthenticateGuard, PermissionsGuard],
                data: { permissions: ['admin', 'support', 'financial'] }
            },
            {
                path: 'associates/payments/financing-request/solicitation-financing/:username',
                component: SolicitationFinancingComponent,
                canActivate: [AuthenticateGuard, PermissionsGuard],
                data: { permissions: ['admin', 'support', 'financial'] }
            },
            {
                path: 'payment-requests',
                component: PaymentRequestsComponent,
                canActivate: [AuthenticateGuard]
            },
            {
                path: 'reports/pack-sold',
                component: PackSoldComponent,
                canActivate: [AuthenticateGuard]
            },
            {
                path: 'reports/pack-sold/pack-sold-details',
                component: PackSoldDetailsComponent,
                canActivate: [AuthenticateGuard]
            },
            {
                path: 'reports/qualification',
                component: QualificationComponent,
                canActivate: [AuthenticateGuard, PermissionsGuard],
                data: { permissions: ['admin', 'financial'] }
            },
            {
                path: 'commissions',
                component: CommissionsComponent,
                canActivate: [AuthenticateGuard, PermissionsGuard],
                data: { permissions: ['admin', 'financial'] }
            },
            {
                path: 'commissions/:id',
                component: CommissionsDetailsComponent,
                canActivate: [AuthenticateGuard, PermissionsGuard],
                data: { permissions: ['admin', 'financial'] }
            },
            {
                path: 'associates/payments/financing/connections',
                component: AssociateFinancingComponent,
                canActivate: [AuthenticateGuard, PermissionsGuard],
                data: { permissions: ['admin', 'support', 'financial'] }
            },
            {
                path: 'associates/payments/financing/connections/:username',
                component: ConnectionByFinancingComponent,
                canActivate: [AuthenticateGuard, PermissionsGuard],
                data: { permissions: ['admin', 'support', 'financial'] }
            },
            {
                path: 'associates/payments/financing/plots',
                component: FinancingPlotsComponent,
                canActivate: [AuthenticateGuard, PermissionsGuard],
                data: { permissions: ['admin', 'support', 'financial'] }
            },
            {
                path: 'associates/payments/financing/plots/:username',
                component: PaymentFinancingPlotComponent,
                canActivate: [AuthenticateGuard, PermissionsGuard],
                data: { permissions: ['admin', 'support', 'financial'] }
            },
            {
                path: 'associates/payments/payment-request',
                component: PaymentRequestComponent,
                canActivate: [AuthenticateGuard, PermissionsGuard],
                data: { permissions: ['admin', 'support', 'financial'] }
            },
            {
                path: 'associates/payments/payment-request/:username',
                component: MembershipPaymentRequestComponent,
                canActivate: [AuthenticateGuard, PermissionsGuard],
                data: { permissions: ['admin', 'support', 'financial'] }
            },
            {
                path: 'associates/payments/connections',
                component: FindConnectionRequestComponent,
                canActivate: [AuthenticateGuard, PermissionsGuard],
                data: { permissions: ['admin', 'support', 'financial'] }
            },
            {
                path: 'associates/payments/connections/:username',
                component: ConnectionRequestAuthorizationComponent,
                canActivate: [AuthenticateGuard, PermissionsGuard],
                data: { permissions: ['admin', 'support', 'financial'] }
            },
            {
                path: 'associates/payments/monthly',
                component: MonthlyComponent,
                canActivate: [AuthenticateGuard, PermissionsGuard],
                data: { permissions: ['admin', 'support', 'financial'] }
            },
            {
                path: 'associates/payments/monthly/:username',
                component: MonthlyPaymentComponent,
                canActivate: [AuthenticateGuard, PermissionsGuard],
                data: { permissions: ['admin', 'support', 'financial'] }
            },
            {
                path: 'associates/associate-edit',
                component: AssociatesComponent,
                canActivate: [AuthenticateGuard, PermissionsGuard],
                data: { permissions: ['admin', 'support', 'financial'] }
            },
            {
                path: 'associates/associate-edit/:id',
                component: AssociateEditComponent,
                canActivate: [AuthenticateGuard, PermissionsGuard],
                data: { permissions: ['admin', 'support', 'financial'] }
            },
            {
                path: 'associates/state',
                component: AssociateStateComponent,
                canActivate: [AuthenticateGuard, PermissionsGuard],
                data: { permissions: ['admin', 'support', 'financial'] }
            },
            {
                path: 'associates/delete/:id',
                component: DeleteResellerComponent,
                canActivate: [AuthenticateGuard, PermissionsGuard],
                data: { permissions: ['admin', 'support'] }
            },
            {
                path: 'associates/validation',
                component: ValidationDocumentComponent,
                canActivate: [AuthenticateGuard, PermissionsGuard],
                data: { permissions: ['admin', 'financial', 'support'] }
            },
            {
                path: 'associates/pending-approval',
                component: PendingApprovalComponent,
                canActivate: [AuthenticateGuard, PermissionsGuard],
                data: { permissions: ['admin'] }
            },
            {
                path: 'admin',
                component: AdminComponent,
                canActivate: [AuthenticateGuard, PermissionsGuard],
                data: { permissions: ['admin'] }
            },
            {
                path: 'admin/connections',
                component: InfoConnectionsComponent,
                canActivate: [AuthenticateGuard, PermissionsGuard],
                data: { permissions: ['admin'] }
            },
            {
                path: 'admin/connections/details-connections',
                component: DetailsInfoConnectionsComponent,
                canActivate: [AuthenticateGuard, PermissionsGuard],
                data: { permissions: ['admin'], title: 'Todos os Conectados' }
            },
            {
                path: 'admin/pre-registration',
                component: InfoPreRegistrationComponent,
                canActivate: [AuthenticateGuard, PermissionsGuard],
                data: { permissions: ['admin'], title: 'Pré-cadastros' }
            },
            {
                path: 'admin/monthly',
                component: InfoMonthlyPaymentComponent,
                canActivate: [AuthenticateGuard, PermissionsGuard],
                data: { permissions: ['admin'] }
            },
            {
                path: 'admin/monthly/details-monthly',
                component: DetailsInfoMonthlyComponent,
                canActivate: [AuthenticateGuard, PermissionsGuard],
                data: { permissions: ['admin'], title: 'Todos os Mensalistas' }
            },
            {
                path: 'admin/monthly/details-enable',
                component: DetailsInfoMonthlyComponent,
                canActivate: [AuthenticateGuard, PermissionsGuard],
                data: { permissions: ['admin'], title: 'Mensalistas Habilitados' }
            },
            {
                path: 'admin/monthly/details-activated',
                component: DetailsInfoMonthlyComponent,
                canActivate: [AuthenticateGuard, PermissionsGuard],
                data: { permissions: ['admin'], title: 'Mensalistas Ativos' }
            },
            {
                path: 'admin/monthly/details-not-paid',
                component: DetailsInfoMonthlyComponent,
                canActivate: [AuthenticateGuard, PermissionsGuard],
                data: { permissions: ['admin'], title: 'Mensalistas Não Pagos' }
            },
            {
                path: 'admin/consumption',
                component: InfoConsumptionComponent,
                canActivate: [AuthenticateGuard, PermissionsGuard],
                data: { permissions: ['admin'] }
            },
            {
                path: 'admin/consumption/details-consumption',
                component: DetailsInfoConsumptionComponent,
                canActivate: [AuthenticateGuard, PermissionsGuard],
                data: { permissions: ['admin'], title: 'Consumo no Intervalo' }
            },
            {
                path: 'admin/consumption/details-service',
                component: DetailsInfoConsumptionComponent,
                canActivate: [AuthenticateGuard, PermissionsGuard],
                data: { permissions: ['admin'], title: 'Consumos de Serviços' }
            },
            {
                path: 'admin/consumption/details-product',
                component: DetailsInfoConsumptionComponent,
                canActivate: [AuthenticateGuard, PermissionsGuard],
                data: { permissions: ['admin'], title: 'Consumos de Produtos' }
            },
            {
                path: 'admin/consumption/details-reversal-product',
                component: DetailsInfoConsumptionComponent,
                canActivate: [AuthenticateGuard, PermissionsGuard],
                data: { permissions: ['admin'], title: 'Estornos de Produtos' }
            },
            {
                path: 'admin/consumption/details-reversal-service',
                component: DetailsInfoConsumptionComponent,
                canActivate: [AuthenticateGuard, PermissionsGuard],
                data: { permissions: ['admin'], title: 'Estornos de Serviços' }
            },
            {
                path: 'admin/connections-by-grid',
                component: InfoConnectionsByGridComponent,
                canActivate: [AuthenticateGuard, PermissionsGuard],
                data: { permissions: ['admin'] }
            },
            {
                path: 'admin/graduation',
                component: InfoGraduationComponent,
                canActivate: [AuthenticateGuard, PermissionsGuard],
                data: { permissions: ['admin'] }
            },
            {
                path: 'admin/rescue',
                component: InfoRescueComponent,
                canActivate: [AuthenticateGuard, PermissionsGuard],
                data: { permissions: ['admin'] }
            },
            {
                path: 'admin/financing',
                component: InfoFinancingComponent,
                canActivate: [AuthenticateGuard, PermissionsGuard],
                data: { permissions: ['admin'] }
            },
            {
                path: 'admin/quotas',
                component: InfoQuotasComponent,
                canActivate: [AuthenticateGuard, PermissionsGuard],
                data: { permissions: ['admin'] }
            },
            {
                path: 'admin/tickets-kits',
                component: InfoTicketsKitsComponent,
                canActivate: [AuthenticateGuard, PermissionsGuard],
                data: { permissions: ['admin'] }
            },
            {
                path: 'admin/connections-by-grid/connections/:id_executive_cell',
                component: DetailsInfoGridComponent,
                canActivate: [AuthenticateGuard, PermissionsGuard],
                data: { permissions: ['admin'], title: 'Conexões na Grade ' }
            },
            {
                path: 'admin/connections-by-grid/pre-registrations/:id_executive_cell',
                component: DetailsInfoGridComponent,
                canActivate: [AuthenticateGuard, PermissionsGuard],
                data: { permissions: ['admin'], title: 'Pré-Registros na Grade ' }
            },
            {
                path: 'associates/credit',
                component: CreditComponent,
                canActivate: [AuthenticateGuard, PermissionsGuard],
                data: { permissions: ['admin', 'financial'] }
            },
            {
                path: 'associates/credit/:associate',
                component: CreditAssociateComponent,
                canActivate: [AuthenticateGuard, PermissionsGuard],
                data: { permissions: ['admin', 'financial'] }
            },
            {
                path: 'associates/manual-payment',
                component: ManualPaymentComponent,
                canActivate: [AuthenticateGuard, PermissionsGuard],
                data: { permissions: ['admin', 'financial'] }
            },
            {
                path: 'associates/manual-payment-edit/:id/:id_sm',
                component: ManualPaymentEditComponent,
                canActivate: [AuthenticateGuard, PermissionsGuard],
                data: { permissions: ['admin', 'financial'] }
            },
            {
                path: 'associates/balance',
                component: BalanceComponent,
                canActivate: [AuthenticateGuard, PermissionsGuard],
                data: { permissions: ['admin', 'financial', 'support'] }
            },
            {
                path: 'associates/debit',
                component: DebitComponent,
                canActivate: [AuthenticateGuard, PermissionsGuard],
                data: { permissions: ['admin', 'financial'] }
            },
            {
                path: 'associates/financing',
                component: FinancingComponent,
                canActivate: [AuthenticateGuard, PermissionsGuard],
                data: { permissions: ['admin', 'financial'] }
            },
            {
                path: 'associates/pack/request',
                component: RequestComponent,
                canActivate: [AuthenticateGuard, PermissionsGuard],
                data: { permissions: ['admin', 'financial'] }
            },
            {
                path: 'associates/pack/approval',
                component: ApprovalComponent,
                canActivate: [AuthenticateGuard, PermissionsGuard],
                data: { permissions: ['admin', 'financial'] }
            },
            {
                path: 'associates/pack/request/:associate',
                component: RequestAssociateComponent,
                canActivate: [AuthenticateGuard, PermissionsGuard],
                data: { permissions: ['admin', 'financial'] }
            },
            {
                path: 'associates/debit/:associate',
                component: DebitAssociateComponent,
                canActivate: [AuthenticateGuard, PermissionsGuard],
                data: { permissions: ['admin', 'financial'] }
            },
            {
                path: 'associates/balance/:associate',
                component: BalanceDetailsComponent,
                canActivate: [AuthenticateGuard, PermissionsGuard],
                data: { permissions: ['admin', 'financial', 'support'] }
            },
            {
                path: 'associates/request-discharge',
                component: RequestDischargeComponent,
                canActivate: [AuthenticateGuard, PermissionsGuard],
                data: { permissions: ['admin', 'financial'] }
            },
            {
                path: 'reports/discharge',
                component: DischargeComponent,
                canActivate: [AuthenticateGuard]
            },
            {
                path: 'reports/extract',
                component: ExtractAdmComponent,
                canActivate: [AuthenticateGuard]
            },
            {
                path: 'reports/prepaid-card',
                component: PrepaidCardComponent,
                canActivate: [AuthenticateGuard]
            },
            {
                path: 'reports/financial-closing',
                component: FinancialClosingComponent,
                canActivate: [AuthenticateGuard]
            },
            {
                path: 'reports/bonifications',
                component: BonificationsComponent,
                canActivate: [AuthenticateGuard]
            },
            {
                path: 'reports/bonifications/:associate',
                component: BonificationDetailsComponent,
                canActivate: [AuthenticateGuard]
            },
            {
                path: 'reports/percentage',
                component: PercentageComponent,
                canActivate: [AuthenticateGuard]
            },
            {
                path: 'reports/top-ten',
                component: TopTenComponent,
                canActivate: [AuthenticateGuard]
            },
            {
                path: 'reports/top-ten-received',
                component: TopTenReceivedComponent,
                canActivate: [AuthenticateGuard]
            },
            {
                path: 'reports/info-indicated',
                component: InfoIndicatedComponent,
                canActivate: [AuthenticateGuard]
            },
            {
                path: 'cells/add',
                component: AddCellsComponent,
                canActivate: [AuthenticateGuard, PermissionsGuard],
                data: { permissions: ['admin'] }
            },
            {
                path: 'cells/edit',
                component: EditCellsComponent,
                canActivate: [AuthenticateGuard, PermissionsGuard],
                data: { permissions: ['admin'] }
            },
            {
                path: 'cells/edit/:id',
                component: DetailCellComponent,
                canActivate: [AuthenticateGuard, PermissionsGuard],
                data: { permissions: ['admin'] }
            },
            {
                path: 'cells/grids/add',
                component: AddGridComponent,
                canActivate: [AuthenticateGuard, PermissionsGuard],
                data: { permissions: ['admin'] }
            },
            {
                path: 'cells/grids/edit',
                component: EditGridComponent,
                canActivate: [AuthenticateGuard, PermissionsGuard],
                data: { permissions: ['admin'] }
            },
            {
                path: 'cells/grids/config',
                component: ConfigGridComponent,
                canActivate: [AuthenticateGuard, PermissionsGuard],
                data: { permissions: ['admin', 'support'] }
            },
            {
                path: 'cells/grids/edit/:id',
                component: DetailGridComponent,
                canActivate: [AuthenticateGuard, PermissionsGuard],
                data: { permissions: ['admin'] }
            },
            {
                path: 'layout/image-backoffice',
                component: ImageBackofficeComponent,
                canActivate: [AuthenticateGuard, PermissionsGuard],
                data: { permissions: ['admin'] }
            },
            {
                path: 'layout/upload-image',
                component: UploadImageComponent,
                canActivate: [AuthenticateGuard, PermissionsGuard],
                data: { permissions: ['admin'] }
            },
            {
                path: 'profile/change-password',
                component: ChangePasswordComponent,
                canActivate: [AuthenticateGuard]
            },
        ]
    },
    {// Layout CleanComponent
        path: '',
        component: CleanComponent,
        children: [
            { path: 'login', component: LoginComponent },
        ]
    },
    {// Layout NotFoundComponent
        path: '**',
        component: NotFoundComponent
    }
];

@NgModule({
    imports: [RouterModule.forRoot(AppRoutes, {})],
    exports: [RouterModule],
    providers: [PermissionsGuard]
})
export class AppRouting { }
