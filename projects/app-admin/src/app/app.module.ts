import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TruncateModule } from 'ng2-truncate';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { GrowlModule } from 'primeng/growl';
import { SidebarModule } from 'primeng/sidebar';
import { RadioButtonModule } from 'primeng/radiobutton';
import { KeyFilterModule } from 'primeng/keyfilter';
import { ChipsModule } from 'primeng/chips';
import { PickListModule } from 'primeng/picklist';
import { TextMaskModule } from 'angular2-text-mask';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { LibComponentsModule } from 'lib-components';
import { LibServicesModule } from 'lib-services';
import { LibLoginModule } from 'lib-login';

import { AppComponent } from './app.component';
import { AppRouting } from '@app-admin/app.routing';
import { environment } from '@env/app-admin';
import { CleanComponent } from '@app-admin/layouts/clean/clean.component';
import { HomeComponent } from '@app-admin/pages/home/home.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { DefaultComponent } from '@app-admin/layouts/default/default.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { RegisterComponent } from './pages/products/register/register.component';
import { ListComponent } from './pages/products/list/list.component';

@NgModule({
  declarations: [
    AppComponent,
    CleanComponent,
    DefaultComponent,
    HomeComponent,
    NavbarComponent,
    SidenavComponent,
    RegisterComponent,
    ListComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    RouterModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    GrowlModule,
    SidebarModule,
    RadioButtonModule,
    KeyFilterModule,
    ChipsModule,
    PickListModule,
    TextMaskModule,
    CurrencyMaskModule,
    TruncateModule,
    LibComponentsModule,
    LibServicesModule,
    LibLoginModule,
    AppRouting
  ],
  providers: [
    { provide: 'environments', useValue: environment }
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
