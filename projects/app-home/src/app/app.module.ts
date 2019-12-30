import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { GrowlModule } from 'primeng/growl';
import { SidebarModule } from 'primeng/sidebar';
import { InViewportModule } from 'ng-in-viewport';
import { LibComponentsModule } from 'lib-components';
import { LibServicesModule } from 'lib-services';


import { AppComponent } from './app.component';
import { AppRouting } from '@app-home/app.routing';
import { environment } from '@env/app-home';
import { CleanComponent } from '@app-home/layouts/clean/clean.component';
import { HomeComponent } from '@app-home/pages/home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    CleanComponent,
    HomeComponent
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
    SidebarModule,
    InViewportModule,
    LibComponentsModule,
    LibServicesModule,
    AppRouting
  ],
  providers: [
    { provide: 'environments', useValue: environment },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
