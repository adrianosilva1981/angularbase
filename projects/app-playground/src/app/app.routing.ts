import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent, ResetPasswordComponent, ConfirmEmailComponent, ForgotPasswordComponent } from 'lib-login';

import { CleanComponent } from './layouts/clean/clean.component';
import { NotFoundComponent } from './containers/not-found/not-found.component';
import { HomeComponent } from './containers/home/home.component';
import { AboutComponent } from './containers/about/about.component';
import { TestesComponent } from '@app-playground/containers/testes/testes.component';


const AppRoutes: Routes = [
    {// Layout CleanComponent
        path: '',
        component: CleanComponent,
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
                path: 'about',
                component: AboutComponent
            },
            {
                path: 'login',
                component: LoginComponent
            },
            {
                path: 'testes',
                component: TestesComponent
            },
            {
                path: 'forgot-password',
                component: ForgotPasswordComponent
            },
            {
                path: 'reset-password/:id/:hash', // login
                component: ResetPasswordComponent
            },
            {
                path: 'receiveconfirmation/:user/:hash', //seed/messages
                component: ConfirmEmailComponent
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
