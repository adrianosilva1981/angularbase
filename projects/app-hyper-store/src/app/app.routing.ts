import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NotFoundComponent, BoxLoginRegisterComponent } from 'lib-components';
import { DefaultComponent } from '@app-hyper-store/layouts/default/default.component';
import { HomeComponent } from '@app-hyper-store/pages/home/home.component';
import { DetailServiceComponent } from '@app-hyper-store/pages/detail-service/detail-service.component';
import { DepartmentServiceComponent } from '@app-hyper-store/pages/department-service/department-service.component';
import { MyAccountComponent } from '@app-hyper-store/pages/my-account/my-account.component';
import { OrderNumberComponent } from '@app-hyper-store/pages/order-number/order-number.component';
import { MyRequestsComponent } from '@app-hyper-store/pages/my-requests/my-requests.component';
import { AuthGuard } from '@app-hyper-store/services/auth.guard';
import { OrderDetailsComponent } from '@app-hyper-store/pages/order-details/order-details.component';
import { FavoritesComponent } from '@app-hyper-store/pages/favorites/favorites.component';
import { ShopCartComponent } from '@app-hyper-store/pages/shop-cart/shop-cart.component';
import { DepartmentProfessionalComponent } from '@app-hyper-store/pages/department-professional/department-professional.component';
import { DetailProfessionalComponent } from '@app-hyper-store/pages/detail-professional/detail-professional.component';
import { CheckoutComponent } from '@app-hyper-store/pages/checkout/checkout.component';
import { LoginComponent } from 'lib-login';
import { DepartmentProductComponent } from '@app-hyper-store/pages/department-product/department-product.component';
import { DetailProductComponent } from '@app-hyper-store/pages/detail-product/detail-product.component';
import { PrimeComponent } from '@app-hyper-store/pages/prime/prime.component';
import { BePrimeComponent } from '@app-hyper-store/pages/be-prime/be-prime.component';
import { FinishComponent } from '@app-hyper-store/layouts/finish/finish.component';
import { BuyCityComponent } from '@app-hyper-store/pages/buy-city/buy-city.component';
import { GuideCompaniesComponent } from './pages/guide-companies/guide-companies.component';
import { DetailGuideComponent } from './pages/detail-guide/detail-guide.component';
import { SupplierLayoutComponent } from './layouts/supplier-layout/supplier-layout.component';
import { VoucherValidComponent } from './pages/supplier/voucher-valid/voucher-valid.component';
import { DashSupplierComponent } from './pages/supplier/dash-supplier/dash-supplier.component';
import { AdsPlansComponent } from './pages/ads-plans/ads-plans.component';
import { LoginPackComponent } from './pages/supplier/login/login.component';
import { CompanyComponent } from './pages/supplier/company/company.component';
import { RegisterGiftCardComponent } from './pages/supplier/giftCard/register-gift-card/register-gift-card.component';
import { EditGiftCardComponent } from './pages/supplier/giftCard/edit-gift-card/edit-gift-card.component';
import { VoucherExtractComponent } from './pages/supplier/voucher-extract/voucher-extract.component';
import { ByPointsComponent } from './pages/by-points/by-points.component';
import { WithdrawComponent } from './pages/supplier/withdraw/withdraw.component';

const AppRoutes: Routes = [
    {// Layout DefaultComponent
        path: '',
        component: DefaultComponent,
        children: [
            {
                path: '',
                component: HomeComponent
            },
            {
                path: 'home',
                component: HomeComponent
            },
            {
                path: 'login',
                component: LoginComponent
            },
            {
                path: 'department/professional',
                component: DepartmentProfessionalComponent
            },
            {
                path: 'department/guide',
                component: GuideCompaniesComponent
            },
            {
                path: 'department/service',
                component: DepartmentServiceComponent
            },
            {
                path: 'department/product',
                component: DepartmentProductComponent
            },
            // {
            //     path: 'department/guide/companies',
            //     component: GuideCompaniesComponent
            // },
            {
                path: 'department/guide/:id',
                component: DetailGuideComponent
            },
            {
                path: 'department/professional/:id',
                component: DetailProfessionalComponent
            },
            {
                path: 'department/service/:id',
                component: DetailServiceComponent
            },
            {
                path: 'department/product/:id',
                component: DetailProductComponent
            },
            {
                path: 'order-details/:order',
                component: OrderDetailsComponent
            },
            {
                path: 'shop-cart',
                component: ShopCartComponent
            },
            {
                path: 'order-number/:order/:orderhj',
                component: OrderNumberComponent
            },
            {
                path: 'favorites',
                component: FavoritesComponent
            },
            {
                path: 'prime',
                component: PrimeComponent
            },
            {
                path: 'prime/:plan',
                component: BePrimeComponent
            },
            {
                path: 'buy-city',
                component: BuyCityComponent
            },
            {
                path: 'points',
                component: ByPointsComponent
            },
            // ROTAS AUTENTICADAS**************************
            {
                path: 'my-account',
                component: MyAccountComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'my-requests',
                component: MyRequestsComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'ads/plans/:idPlan',
                component: AdsPlansComponent
            },
            {
                path: 'ads/plans',
                component: AdsPlansComponent
            }
        ]
    },
    {// Layout FinishComponent
        path: '',
        component: FinishComponent,
        children: [
            {
                path: 'checkout',
                component: CheckoutComponent
            },
            {
                path: 'supplier/login/:hash',
                component: LoginComponent
            }
        ]
    },
    {
        path: '',
        component: SupplierLayoutComponent,
        children: [
            {
                path: 'supplier/dash',
                component: DashSupplierComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'supplier/voucher/valid',
                component: VoucherValidComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'supplier/company',
                component: CompanyComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'supplier/voucher-register',
                component: RegisterGiftCardComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'supplier/voucher-register/:id',
                component: RegisterGiftCardComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'supplier/voucher-list',
                component: EditGiftCardComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'supplier/extract',
                component: VoucherExtractComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'supplier/extract/withdraw',
                component: WithdrawComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'supplier/login',
                component: LoginPackComponent
            }
        ]
    },
    {// Layout NotFoundComponent
        path: '**',
        component: NotFoundComponent
    }
];

@NgModule({
    imports: [RouterModule.forRoot(AppRoutes, {})],
    exports: [RouterModule]
})
export class AppRouting { }
