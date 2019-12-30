import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { GrowlModule } from 'primeng/growl';
import { LibComponentsModule } from 'lib-components';
import { LibServicesModule } from 'lib-services';

import { AppComponent } from './app.component';
import { CleanComponent } from '@app-lps/layouts/clean/clean.component';
import { AppRouting } from '@app-lps/app.routing';
import { environment } from '@env/app-home';
import { ContainerComponent } from './pages/container/container.component';
import { LpHubBankComponent } from './pages/lp-hub-bank/lp-hub-bank.component';
import { LpTesteComponent } from './pages/lp-teste/lp-teste.component';

@NgModule({
  declarations: [
    AppComponent,
    CleanComponent,
    ContainerComponent,
    LpHubBankComponent,
    LpTesteComponent
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
    LibComponentsModule,
    LibServicesModule,
    AppRouting
  ],
  providers: [
    { provide: 'environments', useValue: environment }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
