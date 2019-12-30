import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CleanComponent } from '@app-consultant-adm/layouts/clean/clean.component';
import { LoginComponent } from 'lib-login';
import { DataShopComponent } from '@app-consultant-adm/pages/data-shop/data-shop.component';
import { ConsultantGuard } from '@app-consultant-adm/services/consultant.guard';
import { DomainComponent } from '@app-consultant-adm/pages/domain/domain.component';
import { SocialMediaComponent } from '@app-consultant-adm/pages/social-media/social-media.component';
import { LogoComponent } from '@app-consultant-adm/pages/logo/logo.component';
import { DefaultComponent } from '@app-consultant-adm/layouts/default/default.component';
import { ColorsComponent } from '@app-consultant-adm/pages/colors/colors.component';
import { CatalogComponent } from '@app-consultant-adm/pages/catalog/catalog.component';
import { ResquestsShopComponent } from '@app-consultant-adm/pages/resquests-shop/resquests-shop.component';
import { RequestsDetailsComponent } from '@app-consultant-adm/pages/requests-details/requests-details.component';
import { DashboardComponent } from '@app-consultant-adm/pages/dashboard/dashboard.component';
import { NotFoundComponent, SupplierRegisterComponent, RegisterComponent, JobsRegisterComponent } from 'lib-components';
import { ManagerServiceComponent } from '@app-consultant-adm/pages/manager-service/manager-service.component';
import { ManagerProductComponent } from '@app-consultant-adm/pages/manager-product/manager-product.component';
import { EditProductComponent } from 'lib-components';
import { SupplierSalesComponent } from '@app-consultant-adm/pages/supplier-sales/supplier-sales.component';
import { SupplierSalesDetailComponent } from '@app-consultant-adm/pages/supplier-sales-detail/supplier-sales-detail.component';
import { ExtractComponent } from '@app-consultant-adm/pages/extract/extract.component';
import { JobsEditComponent } from 'lib-components';
import { BlackFridayComponent } from './pages/black-friday/black-friday.component';
import { RegisterCompanyComponent } from './pages/guide/company/register-company/register-company.component';
import { EditCompanyComponent } from './pages/guide/company/edit-company/edit-company.component';
import { EditGiftCardComponent } from './pages/guide/giftCard/edit-gift-card/edit-gift-card.component';
import { RegisterGiftCardComponent } from './pages/guide/giftCard/register-gift-card/register-gift-card.component';
import { SupplierComponent } from './pages/guide/supplier/supplier.component';
import { PublishComponent } from './pages/publish-all/publish/publish.component';
import { MailMarketingComponent } from './pages/publish-all/mail-marketing/mail-marketing.component';
import { PageViewComponent } from './pages/publish-all/page-view/page-view.component';
import { SharingComponent } from './pages/publish-all/sharing/sharing.component';
import { PostInstagramComponent } from './pages/publish-all/post-instagram/post-instagram.component';
import { PostFacebookComponent } from './pages/publish-all/post-facebook/post-facebook.component';
import { PackComponent } from './pages/guide/company/pack/pack.component';
import { PublishExtractComponent } from './pages/publish-all/publish-extract/publish-extract.component';
import { WithdrawComponent } from './pages/withdraw/withdraw.component';
import { SalesComponent } from './pages/guide/company/sales/sales.component';

const AppRoutes: Routes = [
    {// Layout DefaultComponent
        path: '',
        component: DefaultComponent,
        children: [
            { path: '', component: DashboardComponent, canActivate: [ConsultantGuard] },
            { path: 'home', redirectTo: '', pathMatch: 'full' },
            { path: 'settings/data-shop', component: DataShopComponent, canActivate: [ConsultantGuard] },
            { path: 'settings/domain', component: DomainComponent, canActivate: [ConsultantGuard] },
            { path: 'settings/social', component: SocialMediaComponent, canActivate: [ConsultantGuard] },
            { path: 'skin/logo', component: LogoComponent, canActivate: [ConsultantGuard] },
            { path: 'skin/colors', component: ColorsComponent, canActivate: [ConsultantGuard] },
            { path: 'manager-service', component: ManagerServiceComponent, canActivate: [ConsultantGuard] },
            { path: 'manager-product', component: ManagerProductComponent, canActivate: [ConsultantGuard] },
            { path: 'register-service', component: JobsRegisterComponent, canActivate: [ConsultantGuard] },
            { path: 'register-service/:id', component: JobsRegisterComponent, canActivate: [ConsultantGuard] },
            { path: 'register-product', component: RegisterComponent, canActivate: [ConsultantGuard] },
            { path: 'register-product/:id', component: RegisterComponent, canActivate: [ConsultantGuard] },
            { path: 'edit-products', component: EditProductComponent, canActivate: [ConsultantGuard] },
            { path: 'edit-services', component: JobsEditComponent, canActivate: [ConsultantGuard] },
            { path: 'supplier-sales', component: SupplierSalesComponent, canActivate: [ConsultantGuard] },
            { path: 'extract', component: ExtractComponent, canActivate: [ConsultantGuard] },
            { path: 'supplier-sales-info', component: SupplierSalesDetailComponent, canActivate: [ConsultantGuard] },
            { path: 'register-supplier', component: SupplierRegisterComponent, canActivate: [ConsultantGuard] },
            { path: 'services/catalog', component: CatalogComponent, canActivate: [ConsultantGuard] },
            { path: 'requests-shop', component: ResquestsShopComponent, canActivate: [ConsultantGuard] },
            { path: 'requests-details/:id_order', component: RequestsDetailsComponent, canActivate: [ConsultantGuard] },
            { path: 'guide/register-company', component: RegisterCompanyComponent, canActivate: [ConsultantGuard] },
            { path: 'guide/buy-pack', component: PackComponent, canActivate: [ConsultantGuard] },
            { path: 'guide/register-company/:id', component: RegisterCompanyComponent, canActivate: [ConsultantGuard] },
            { path: 'guide/company/sales/:id', component: SalesComponent, canActivate: [ConsultantGuard] },
            { path: 'guide/edit-company', component: EditCompanyComponent, canActivate: [ConsultantGuard] },
            { path: 'guide/register-gift-card', component: RegisterGiftCardComponent, canActivate: [ConsultantGuard] },
            { path: 'guide/register-gift-card/:id', component: RegisterGiftCardComponent, canActivate: [ConsultantGuard] },
            { path: 'guide/edit-gift-card', component: EditGiftCardComponent, canActivate: [ConsultantGuard] },
            { path: 'guide/supplier', component: SupplierComponent, canActivate: [ConsultantGuard] },
            { path: 'publish', component: PublishComponent, canActivate: [ConsultantGuard] },
            { path: 'publish/config/page-view', component: PageViewComponent, canActivate: [ConsultantGuard] },
            { path: 'publish/config/email-marketing', component: MailMarketingComponent, canActivate: [ConsultantGuard] },
            { path: 'publish/config/sharing', component: SharingComponent, canActivate: [ConsultantGuard] },
            { path: 'publish/config/post-facebook', component: PostFacebookComponent, canActivate: [ConsultantGuard] },
            { path: 'publish/config/post-instagram', component: PostInstagramComponent, canActivate: [ConsultantGuard] },
            { path: 'publish/ads-extract', component: PublishExtractComponent, canActivate: [ConsultantGuard] },
            { path: 'extract/withdraw', component: WithdrawComponent, canActivate: [ConsultantGuard] }
        ]
    },
    {// Layout CleanComponent
        path: '',
        component: CleanComponent,
        children: [
            { path: 'login', component: LoginComponent },
            { path: 'black', component: BlackFridayComponent }
        ]
    },
    {// Layout NotFoundComponent
        path: '**',
        component: NotFoundComponent
    }
];

@NgModule({
    imports: [RouterModule.forRoot(AppRoutes, { })],
    exports: [RouterModule]
})
export class AppRouting { }
