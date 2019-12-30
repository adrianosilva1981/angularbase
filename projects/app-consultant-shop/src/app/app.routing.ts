import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DefaultComponent } from '@app-consultant-shop/layouts/default/default.component';
import { HomeComponent } from '@app-consultant-shop/pages/home/home.component';
import { MyAccountComponent } from '@app-consultant-shop/pages/my-account/my-account.component';
import { MyRequestsComponent } from '@app-consultant-shop/pages/my-requests/my-requests.component';
import { DetailServiceComponent } from '@app-consultant-shop/pages/detail-service/detail-service.component';
import { FavoritesComponent } from '@app-consultant-shop/pages/favorites/favorites.component';
import { ShopCartComponent } from '@app-consultant-shop/pages/shop-cart/shop-cart.component';
import { CheckoutComponent } from '@app-consultant-shop/pages/checkout/checkout.component';
import { DepartmentServiceComponent } from '@app-consultant-shop/pages/department-service/department-service.component';
import { OrderDetailsComponent } from '@app-consultant-shop/pages/order-details/order-details.component';
import { SearchSubdomainComponent } from '@app-consultant-shop/pages/search-subdomain/search-subdomain.component';
import { CleanComponent } from '@app-consultant-shop/layouts/clean/clean.component';
import { AuthGuard } from '@app-consultant-shop/services/auth.guard';
import { OrderNumberComponent } from '@app-consultant-shop/pages/order-number/order-number.component';

import { LoginComponent } from 'lib-login';
import { NotFoundComponent } from 'lib-components';
import { DepartmentProductComponent } from '@app-consultant-shop/pages/department-product/department-product.component';
import { DetailProductComponent } from '@app-consultant-shop/pages/detail-product/detail-product.component';
import { CleanCheckoutComponent } from '@app-consultant-shop/layouts/clean-checkout/clean-checkout.component';
import { PrimeComponent } from './pages/prime/prime.component';
import { BePrimeComponent } from './pages/be-prime/be-prime.component';

const AppRoutes: Routes = [
    {// Layout DefaultComponent
        path: '',
        component: CleanComponent,
        children: [
            {
                path: '',
                component: SearchSubdomainComponent
            },
            {
                path: 'home',
                component: SearchSubdomainComponent
            },
            {
                path: 'login',
                component: LoginComponent
            }
        ]
    },
    {
        path: 'store/:consultant/pay',
        component: CleanCheckoutComponent,
        children: [
            {
                path: 'checkout',
                component: CheckoutComponent
            }
        ]
    },
    {// Layout DefaultComponent
        path: 'store/:consultant',
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
                path: 'shop-cart',
                component: ShopCartComponent
            },
            {
                path: 'department/service',
                component: DepartmentServiceComponent
            },
            {
                path: 'department/product',
                component: DepartmentProductComponent
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
                path: 'order-number/:order/:orderhj',
                component: OrderNumberComponent
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