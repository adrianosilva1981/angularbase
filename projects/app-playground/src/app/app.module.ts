import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { GrowlModule } from 'primeng/growl';
import { TableModule } from 'primeng/table';

import { LibLoginModule } from 'lib-login';
import { LibServicesModule } from 'lib-services';
import { LibNavbarModule } from 'lib-navbar';
import { LibComponentsModule } from 'lib-components';
import { LibChatModule } from 'lib-chat';

import { AppRouting } from './app.routing';
import { AppComponent } from './app.component';
import { CleanComponent } from './layouts/clean/clean.component';
import { NotFoundComponent } from './containers/not-found/not-found.component';
import { HomeComponent } from './containers/home/home.component';
import { AboutComponent } from './containers/about/about.component';
import { environment } from '../environments/environment';
import { TestesComponent } from './containers/testes/testes.component';

@NgModule({
  declarations: [
    AppComponent,
    CleanComponent,
    NotFoundComponent,
    HomeComponent,
    AboutComponent,
    TestesComponent
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
    TableModule,
    LibLoginModule,
    LibServicesModule,
    LibNavbarModule,
    LibComponentsModule,
    LibChatModule,
    AppRouting
  ],
  providers: [
    { provide: 'environments', useValue: environment }
  ],
  bootstrap: [
    AppComponent
  ],
  entryComponents: [
  ]
})
export class AppModule { }
