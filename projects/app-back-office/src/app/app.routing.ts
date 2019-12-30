import { MonthlyGuard } from './services/monthly.guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DivulgationComponent } from '@app-back-office/pages/divulgation/divulgation.component';
import { AddLeadsContainerComponent } from '@app-back-office/pages/add-leads/add-leads.component';
import { ManageLeadsContainerComponent } from '@app-back-office/pages/manage-leads/manage-leads.component';
import { NotFoundComponent } from 'lib-components';
import { TreeContaienrComponent } from '@app-back-office/pages/tree/tree.component';
import { ExtractContaienrComponent } from '@app-back-office/pages/extract/extract.component';
import { LoginContainerComponent } from '@app-back-office/pages/login/login.component';
import { AuthGuard } from '@app-back-office/services/auth.guard';
import { ActiveGuard } from '@app-back-office/services/active.guard';
import { RegisterResellerComponent } from '@app-back-office/pages/register-reseller/register-reseller.component';
import { AccessPlansComponent } from '@app-back-office/pages/access-plans/access-plans.component';
import { AccessCheckoutComponent } from '@app-back-office/pages/access-checkout/access-checkout.component';
import { UpgradeCheckoutComponent } from '@app-back-office/pages/upgrade-checkout/upgrade-checkout.component';
import { HomePageComponent } from '@app-back-office/pages/home-page/home-page.component';
import { ChoosePathContainerComponent } from '@app-back-office/pages/choose-path/choose-path.component';
import { CheckoutSuccessComponent } from '@app-back-office/pages/access-checkout/checkout-success/checkout-success.component';
import { MyacountComponent } from '@app-back-office/pages/myacount/myacount.component';
import { HomeLayoutComponent } from '@app-back-office/layouts/home/home.component';
import { LoginLayoutComponent } from '@app-back-office/layouts/login/login.component';
import { BitcoinComponent } from '@app-back-office/pages/bitcoin/bitcoin.component';
import { PrepaidCardComponent } from '@app-back-office/pages/prepaid-card/prepaid-card.component';
import { RescueComponent } from '@app-back-office/pages/rescue/rescue.component';
import { ResaleProductsComponent } from '@app-back-office/pages/resale-products/resale-products.component';
import { ProductsCheckoutComponent } from '@app-back-office/pages/resale-products/products-checkout/products-checkout.component';
import { ProductsMypurchaseComponent } from '@app-back-office/pages/resale-products/products-mypurchase/products-mypurchase.component';
import { DocumentsComponent } from '@app-back-office/pages/documents/documents.component';
import { MonthlyCheckoutComponent } from '@app-back-office/pages/monthly-checkout/monthly-checkout.component';
import { FinancingCheckoutComponent } from '@app-back-office/pages/financing-checkout/financing-checkout.component';
import { VouchersComponent } from '@app-back-office/pages/vouchers/vouchers.component';
import { GoogleAuthenticatorComponent } from '@app-back-office/pages/google-authenticator/google-authenticator.component';
import { EbooksComponent } from '@app-back-office/pages/ebooks/ebooks.component';
import { InfoPointsComponent } from '@app-back-office/pages/info-points/info-points.component';
import { BonusComponent } from '@app-back-office/pages/bonus/bonus.component';
import { GalaxiaComponent } from '@app-back-office/pages/galaxia/galaxia.component';
import { MarketingComponent } from '@app-back-office/pages/marketing/marketing.component';
import { APNComponent } from '@app-back-office/pages/apn/apn.component';
import { TravelComponent } from '@app-back-office/pages/travel/travel.component';
import { FindersfeeComponent } from '@app-back-office/pages/findersfee/findersfee.component';
import { PublicityComponent } from './pages/resale-products/publicity/publicity.component';
import { RegisterPublisherComponent } from './pages/register-publisher/register-publisher.component';
import { SpreadComponent } from './pages/spread/spread.component';


const mmnRoutes: Routes = [
  {
    path: 'notfound',
    component: NotFoundComponent
  },
  {
    path: 'office',
    component: HomeLayoutComponent,
    canActivateChild: [AuthGuard],
    children: [
      // { path: 'divulgation', canActivate: [ActiveGuard], component: DivulgationComponent },
      // { path: 'contacts/add', canActivate: [ActiveGuard], component: AddLeadsContainerComponent },
      // { path: 'contacts', canActivate: [ActiveGuard], component: ManageLeadsContainerComponent },
      { path: 'galaxia', canActivate: [MonthlyGuard], component: GalaxiaComponent },
      { path: 'home', component: ChoosePathContainerComponent },
      { path: 'extract', canActivate: [ActiveGuard], component: ExtractContaienrComponent },
      { path: 'tree', canActivate: [ActiveGuard], component: TreeContaienrComponent },
      { path: 'access', component: AccessPlansComponent },
      { path: 'checkout', component: AccessCheckoutComponent },
      { path: 'upgrade', component: UpgradeCheckoutComponent },
      { path: 'checkout/success', component: CheckoutSuccessComponent },
      { path: 'register', component: RegisterResellerComponent },
      { path: 'myAcount', canActivate: [ActiveGuard], component: MyacountComponent },
      { path: 'success', canActivate: [ActiveGuard], component: CheckoutSuccessComponent },
      { path: 'bitcoins', canActivate: [ActiveGuard], component: BitcoinComponent },
      { path: 'prepaidcard', canActivate: [ActiveGuard], component: PrepaidCardComponent },
      { path: 'rescue', canActivate: [ActiveGuard], component: RescueComponent },
      { path: 'product', component: ResaleProductsComponent },
      { path: 'product-checkout', component: ProductsCheckoutComponent },
      { path: 'product-mypurchase', component: ProductsMypurchaseComponent },
      { path: 'publicity', component: PublicityComponent },
      { path: 'register-publisher', component: RegisterPublisherComponent },
      { path: 'documents', canActivate: [ActiveGuard], component: DocumentsComponent },
      { path: 'marketing', canActivate: [ActiveGuard], component: MarketingComponent },
      { path: 'APN', canActivate: [ActiveGuard], component: APNComponent },
      { path: 'monthly', component: MonthlyCheckoutComponent },
      { path: 'financing', component: FinancingCheckoutComponent },
      { path: 'vouchers/:type', canActivate: [ActiveGuard], component: VouchersComponent },
      { path: 'ebooks', canActivate: [ActiveGuard], component: EbooksComponent },
      { path: 'googleAuthenticator', canActivate: [ActiveGuard], component: GoogleAuthenticatorComponent },
      { path: 'infopoints', canActivate: [ActiveGuard], component: InfoPointsComponent },
      { path: 'bonus', canActivate: [ActiveGuard], component: BonusComponent },
      { path: 'travel', canActivate: [ActiveGuard], component: TravelComponent },
      { path: 'findersfee', canActivate: [ActiveGuard, MonthlyGuard], component: FindersfeeComponent },
      { path: 'spread', canActivate: [ActiveGuard], component: SpreadComponent },

      { path: '', pathMatch: 'full', redirectTo: 'home' },
    ]
  },
  {
    path: 'office',
    component: LoginLayoutComponent,
    children: [
      { path: 'login', component: LoginContainerComponent },
      { path: 'preregister', component: LoginContainerComponent },
      { path: 'forgotpassword', component: LoginContainerComponent },
      { path: 'resetpassword/:token', component: LoginContainerComponent },
      { path: 'newcountersign/:token', component: LoginContainerComponent },
      { path: '', pathMatch: 'full', redirectTo: 'login' },
    ]
  },
  {
    path: '',
    component: HomePageComponent
  },
  {
    path: '**',
    component: NotFoundComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(mmnRoutes, {})
  ],
  exports: [
    RouterModule
  ]
})
export class AppRouting { }
