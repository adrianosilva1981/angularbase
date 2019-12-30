import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


import { CleanComponent } from './layouts/clean/clean.component';
import { NotFoundComponent, RegisterComponent, SupplierRegisterComponent,  } from 'lib-components';
import { HomeComponent } from './pages/home/home.component';
import { DefaultComponent } from '@app-admin/layouts/default/default.component';
import { ListComponent } from '@app-admin/pages/products/list/list.component';
import { AdmGuardGuard } from '@app-admin/services/adm-guard.guard';
import { LoginComponent } from 'lib-login';



const AppRoutes: Routes = [
    {// Layout DefaultComponent
        path: '',
        component: DefaultComponent,
        children: [
            {
                path: '',
                component: HomeComponent, canActivate: [AdmGuardGuard]
            },
            {
                path: 'home',
                component: HomeComponent, canActivate: [AdmGuardGuard]
            },
            {
                path: 'product/register',
                component: RegisterComponent, canActivate: [AdmGuardGuard]
            },
            {
                path: 'supplier/register',
                component: SupplierRegisterComponent, canActivate: [AdmGuardGuard]
            },
            {
                path: 'product/list',
                component: ListComponent, canActivate: [AdmGuardGuard]
            },

        ]
    },
    {
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
