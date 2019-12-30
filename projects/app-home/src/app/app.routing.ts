import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CleanComponent } from './layouts/clean/clean.component';
import { NotFoundComponent } from 'lib-components';
import { HomeComponent } from '@app-home/pages/home/home.component';

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
