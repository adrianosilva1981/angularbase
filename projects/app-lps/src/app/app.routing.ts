import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NotFoundComponent } from 'lib-components';
import { CleanComponent } from '@app-lps/layouts/clean/clean.component';
import { ContainerComponent } from '@app-lps/pages/container/container.component';

const AppRoutes: Routes = [
    {// Layout CleanComponent
        path: '',
        component: CleanComponent,
        children: [
            {
                path: '',
                component: ContainerComponent
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
