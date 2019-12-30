import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from 'lib-login';
import { ExtractComponent, AddCreditComponent, WithdrawComponent } from 'lib-extract';

import { DefaultComponent } from '@app-account/layouts/default/default.component';
import { CleanComponent } from '@app-account/layouts/clean/clean.component';
import { HomeComponent } from '@app-account/pages/home/home.component';
import { PersonalDataComponent } from '@app-account/pages/personal-data/personal-data.component';
import { ChangePersonalDataComponent } from '@app-account/pages/change-personal-data/change-personal-data.component';
import { MyAddressesComponent } from '@app-account/pages/my-addresses/my-addresses.component';
import { AddNewAddressesComponent } from '@app-account/pages/add-new-addresses/add-new-addresses.component';
import { MyCreditCardsComponent } from '@app-account/pages/my-credit-cards/my-credit-cards.component';
import { AddNewCreditCardComponent } from '@app-account/pages/add-new-credit-card/add-new-credit-card.component';
import { MyPhotoComponent } from '@app-account/pages/my-photo/my-photo.component';
import { AccountGuard } from '@app-account/guards/account.guard';
import { NotFoundComponent } from 'lib-components';

const AppRoutes: Routes = [
    {// Layout CleanComponent
        path: '',
        component: DefaultComponent,
        children: [
            { path: '', component: HomeComponent, canActivate: [AccountGuard] },
            { path: 'home', redirectTo: '', pathMatch: 'full' },
            { path: 'personal-data', component: PersonalDataComponent, canActivate: [AccountGuard] },
            { path: 'change-personal-data', component: ChangePersonalDataComponent, canActivate: [AccountGuard] },
            { path: 'my-addresses', component: MyAddressesComponent, canActivate: [AccountGuard] },
            { path: 'add-new-address', component: AddNewAddressesComponent, canActivate: [AccountGuard] },
            { path: 'my-credit-cards', component: MyCreditCardsComponent, canActivate: [AccountGuard] },
            { path: 'add-new-credit-card', component: AddNewCreditCardComponent, canActivate: [AccountGuard] },
            { path: 'my-photo', component: MyPhotoComponent, canActivate: [AccountGuard] },
            { path: 'extract', component: ExtractComponent, canActivate: [AccountGuard] },
            { path: 'add-credit', component: AddCreditComponent, canActivate: [AccountGuard] },
            { path: 'withdraw', component: WithdrawComponent, canActivate: [AccountGuard] }
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
    exports: [RouterModule]
})
export class AppRouting { }
