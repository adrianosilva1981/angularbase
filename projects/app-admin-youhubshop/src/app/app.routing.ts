import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NotFoundComponent } from 'lib-components';

import { CleanComponent } from '@app-admin-youhubshop/layouts/clean/clean.component';
import { DefaultComponent } from '@app-admin-youhubshop/layouts/default/default.component';
import { LoginComponent } from '@app-admin-youhubshop/components/login/login.component';
import { DashboardComponent } from '@app-admin-youhubshop/pages/dashboard/dashboard.component';
import { AuthenticateGuard } from '@app-admin-youhubshop/services/authenticate.guard';
import { PermissionsGuard } from '@app-admin-youhubshop/services/permissions.guard';
import { PaymentRequestsComponent } from '@app-admin-youhubshop/pages/reports/payment-requests/payment-requests.component';
import { PackSoldComponent } from '@app-admin-youhubshop/pages/reports/pack-sold/pack-sold.component';
import { TopTenComponent } from '@app-admin-youhubshop/pages/reports/top-ten/top-ten.component';
import { PerformanceComponent } from '@app-admin-youhubshop/pages/reports/performance/performance.component';
import { CommissionsComponent } from '@app-admin-youhubshop/pages/financial/commissions/commissions.component';
import { PaymentBySupplierComponent } from '@app-admin-youhubshop/pages/financial/payment-by-supplier/payment-by-supplier.component';
import { PaymentsComponent } from '@app-admin-youhubshop/pages/financial/payment-by-supplier/payments/payments.component';
import { HubmixDetailsComponent } from '@app-admin-youhubshop/pages/reports/performance/hubmix-details/hubmix-details.component';
import { ReportPaymentsComponent } from '@app-admin-youhubshop/pages/financial/report-payments/report-payments.component';
import { ProductsBySupplierComponent } from './pages/reports/products-by-supplier/products-by-supplier.component';
import { ProductsComponent } from '@app-admin-youhubshop/pages/reports/products-by-supplier/products/products.component';
import { ShopsComponent } from '@app-admin-youhubshop/pages/dashboard/shops/shops.component';
import { DetailsShopComponent } from '@app-admin-youhubshop/pages/dashboard/shops/details-shop/details-shop.component';
import { SuppliersComponent } from '@app-admin-youhubshop/pages/dashboard/suppliers/suppliers.component';
import { DetailsSuppliersComponent } from './pages/dashboard/suppliers/details-suppliers/details-suppliers.component';
import { GiftCardComponent } from './pages/dashboard/gift-card/gift-card.component';
import { InfoProductsComponent } from '@app-admin-youhubshop/pages/dashboard/info-products/info-products.component';
import { ServicesComponent } from '@app-admin-youhubshop/pages/dashboard/services/services.component';
import { UsersComponent } from '@app-admin-youhubshop/pages/dashboard/users/users.component';
import { UserDetailsComponent } from '@app-admin-youhubshop/pages/dashboard/users/user-details/user-details.component';

// enum para dar acesso a routas, fazer tanto front quanto backend se adicionar novo tipo de acesso
const PermissionEnum = Object.freeze({ 'NORMAL_ACCESS': 1, 'ADMIN_ACCESS': 2 });

const AppRoutes: Routes = [
    {// Layout DefaultComponent
        path: '',
        component: DefaultComponent,
        children: [
            {
                path: '',
                component: DashboardComponent,
                canActivate: [AuthenticateGuard, PermissionsGuard],
                data: { permission: PermissionEnum.NORMAL_ACCESS }
            },
            {
                path: 'dash',
                component: DashboardComponent,
                canActivate: [AuthenticateGuard, PermissionsGuard],
                data: { permission: PermissionEnum.NORMAL_ACCESS }
            },
            {
                path: 'dash/shops',
                component: ShopsComponent,
                canActivate: [AuthenticateGuard, PermissionsGuard],
                data: { permission: PermissionEnum.NORMAL_ACCESS }
            },
            {
                path: 'dash/shops/details/:idShop',
                component: DetailsShopComponent,
                canActivate: [AuthenticateGuard, PermissionsGuard],
                data: { permission: PermissionEnum.NORMAL_ACCESS }
            },
            {
                path: 'dash/suppliers',
                component: SuppliersComponent,
                canActivate: [AuthenticateGuard, PermissionsGuard],
                data: { permission: PermissionEnum.NORMAL_ACCESS }
            },
            {
                path: 'dash/suppliers/details/:idSupplier',
                component: DetailsSuppliersComponent,
                canActivate: [AuthenticateGuard, PermissionsGuard],
                data: { permission: PermissionEnum.NORMAL_ACCESS }
            },
            {
                path: 'dash/gift-card',
                component: GiftCardComponent,
                canActivate: [AuthenticateGuard, PermissionsGuard],
                data: { permission: PermissionEnum.NORMAL_ACCESS }
            },
            {
                path: 'dash/products',
                component: InfoProductsComponent,
                canActivate: [AuthenticateGuard, PermissionsGuard],
                data: { permission: PermissionEnum.NORMAL_ACCESS }
            },
            {
                path: 'dash/services',
                component: ServicesComponent,
                canActivate: [AuthenticateGuard, PermissionsGuard],
                data: { permission: PermissionEnum.NORMAL_ACCESS }
            },
            {
                path: 'dash/users',
                component: UsersComponent,
                canActivate: [AuthenticateGuard, PermissionsGuard],
                data: { permission: PermissionEnum.NORMAL_ACCESS }
            },
            {
                path: 'dash/users/details/:idUser',
                component: UserDetailsComponent,
                canActivate: [AuthenticateGuard, PermissionsGuard],
                data: { permission: PermissionEnum.NORMAL_ACCESS }
            },
            {
                path: 'payment-requests',
                component: PaymentRequestsComponent,
                canActivate: [AuthenticateGuard, PermissionsGuard],
                data: { permission: PermissionEnum.ADMIN_ACCESS }
            },
            {
                path: 'reports/pack-sold',
                component: PackSoldComponent,
                canActivate: [AuthenticateGuard, PermissionsGuard],
                data: { permission: PermissionEnum.NORMAL_ACCESS }

            },
            {
                path: 'financial/payments',
                component: PaymentBySupplierComponent,
                canActivate: [AuthenticateGuard, PermissionsGuard],
                data: { permission: PermissionEnum.ADMIN_ACCESS }
            },
            {
                path: 'financial/payments-supplier',
                component: PaymentsComponent,
                canActivate: [AuthenticateGuard, PermissionsGuard],
                data: { permission: PermissionEnum.ADMIN_ACCESS }
            },
            {
                path: 'financial/commissions',
                component: CommissionsComponent,
                canActivate: [AuthenticateGuard, PermissionsGuard],
                data: { permission: PermissionEnum.ADMIN_ACCESS }
            },
            {
                path: 'reports/performance',
                component: PerformanceComponent,
                canActivate: [AuthenticateGuard, PermissionsGuard],
                data: { permission: PermissionEnum.ADMIN_ACCESS }
            },
            {
                path: 'reports/performance/hubmix-details',
                component: HubmixDetailsComponent,
                canActivate: [AuthenticateGuard, PermissionsGuard],
                data: { permission: PermissionEnum.ADMIN_ACCESS }
            },
            {
                path: 'reports/users',
                component: TopTenComponent,
                canActivate: [AuthenticateGuard, PermissionsGuard],
                data: { permission: PermissionEnum.ADMIN_ACCESS }

            },
            {
                path: 'reports/productsBySupplier',
                component: ProductsBySupplierComponent,
                canActivate: [AuthenticateGuard, PermissionsGuard],
                data: { permission: PermissionEnum.ADMIN_ACCESS }
            },
            {
                path: 'reports/products',
                component: ProductsComponent,
                canActivate: [AuthenticateGuard, PermissionsGuard],
                data: { permission: PermissionEnum.ADMIN_ACCESS }
            },
            {
                path: 'reports/productsBySupplier/:id_supplier',
                component: ProductsComponent,
                canActivate: [AuthenticateGuard, PermissionsGuard],
                data: { permission: PermissionEnum.ADMIN_ACCESS }
            },
            {
                path: 'financial/report-payments',
                component: ReportPaymentsComponent,
                canActivate: [AuthenticateGuard, PermissionsGuard],
                data: { permission: PermissionEnum.ADMIN_ACCESS }
            }
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
