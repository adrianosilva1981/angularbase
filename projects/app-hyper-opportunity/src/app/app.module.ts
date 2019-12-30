import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { GrowlModule } from 'primeng/growl';
import { TextMaskModule } from 'angular2-text-mask';

import { LibLoginModule } from 'lib-login';
import { LibServicesModule } from 'lib-services';
import { LibNavbarModule } from 'lib-navbar';
import { LibComponentsModule } from 'lib-components';


import { environment } from '@env/app-hyper-opportunity';
import { CleanComponent } from '@app-hyper-opportunity/layouts/clean/clean.component';
import { HomeComponent } from '@app-hyper-opportunity/pages/home/home.component';
import { AppRouting } from '@app-hyper-opportunity/app.routing';
import { AppComponent } from '@app-hyper-opportunity/app.component';
import { ThumbnailComponent } from './components/thumbnail/thumbnail.component';
import { SubNavbarComponent } from './components/sub-navbar/sub-navbar.component';
import { DefaultComponent } from './layouts/default/default.component';

import { SidebarModule } from 'primeng/sidebar';
import { OnlineWorkComponent } from './pages/online-work/online-work.component';
import { OnlineWorkAlreadyComponent } from './pages/online-work-already/online-work-already.component';
import { OnlineWorkNotAlreadyComponent } from './pages/online-work-not-already/online-work-not-already.component';
import { FooterComponent } from './components/footer/footer.component';
import { DepartmentOpportunityComponent } from './pages/department-opportunity/department-opportunity.component';
import { FilterOpportunityComponent } from './components/filter-opportunity/filter-opportunity.component';
import { CheckoutComponent } from '@app-hyper-opportunity/pages/checkout/checkout.component';
import { BoxLoginRegisterComponent } from '@app-hyper-opportunity/components/box-login-register/box-login-register.component';
import { ActivateCodeComponent } from '@app-hyper-opportunity/components/activate-code/activate-code.component';

@NgModule({
  declarations: [
    AppComponent,
    CleanComponent,
    HomeComponent,
    ThumbnailComponent,
    SubNavbarComponent,
    DefaultComponent,
    OnlineWorkComponent,
    OnlineWorkAlreadyComponent,
    OnlineWorkNotAlreadyComponent,
    FooterComponent,
    CheckoutComponent,
    DepartmentOpportunityComponent,
    FilterOpportunityComponent,
    BoxLoginRegisterComponent,
    ActivateCodeComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    GrowlModule,
    LibLoginModule,
    LibServicesModule,
    LibNavbarModule,
    TextMaskModule,
    LibComponentsModule,
    SidebarModule,
    AppRouting
  ],
  providers: [
    { provide: 'environments', useValue: environment }
  ],
  entryComponents: [
    ActivateCodeComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
