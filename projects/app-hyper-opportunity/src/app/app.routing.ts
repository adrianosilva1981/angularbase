import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NotFoundComponent } from 'lib-components';
import { LoginComponent } from 'lib-login';

import { CleanComponent } from '@app-hyper-opportunity/layouts/clean/clean.component';
import { HomeComponent } from '@app-hyper-opportunity/pages/home/home.component';
import { DefaultComponent } from '@app-hyper-opportunity/layouts/default/default.component';
import { OnlineWorkComponent } from '@app-hyper-opportunity/pages/online-work/online-work.component';
import { OnlineWorkAlreadyComponent } from '@app-hyper-opportunity/pages/online-work-already/online-work-already.component';
import { OnlineWorkNotAlreadyComponent } from '@app-hyper-opportunity/pages/online-work-not-already/online-work-not-already.component';
import { DepartmentOpportunityComponent } from '@app-hyper-opportunity/pages/department-opportunity/department-opportunity.component';
import { CheckoutComponent } from '@app-hyper-opportunity/pages/checkout/checkout.component';

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
                path: 'online-work',
                component: OnlineWorkComponent
            },
            {
                path: 'checkout-plan/:id',
                component: CheckoutComponent
            },
            {
                path: 'online-work-already',
                component: OnlineWorkAlreadyComponent
            },
            {
                path: 'online-work-not-already',
                component: OnlineWorkNotAlreadyComponent
            },
            {
                path: 'department/opportunity',
                component: DepartmentOpportunityComponent,
            }
        ]
    },
    {// Layout CleanComponent
        path: '',
        component: CleanComponent,
        children: [
            {
                path: 'login',
                component: LoginComponent
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
