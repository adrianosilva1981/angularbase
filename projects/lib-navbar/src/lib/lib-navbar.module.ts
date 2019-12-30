import { NgModule } from '@angular/core';
import { NavTopComponent } from './nav-top/nav-top.component';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TruncateModule } from 'ng2-truncate';
import { SplitButtonModule } from 'primeng/splitbutton';

import { LibServicesModule } from 'lib-services';
import { LibComponentsModule } from 'lib-components';
import { AppPlaygroundComponent } from './components/app-playground/app-playground.component';
import { AppHyperStoreComponent } from './components/app-hyper-store/app-hyper-store.component';
import { AppHyperOpportunityComponent } from './components/app-hyper-opportunity/app-hyper-opportunity.component';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule,
    FormsModule,
    LibServicesModule,
    LibComponentsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    SplitButtonModule,
    TruncateModule
  ],
  declarations: [
    NavTopComponent,
    AppPlaygroundComponent,
    AppHyperStoreComponent,
    AppHyperOpportunityComponent
  ],
  exports: [
    NavTopComponent
  ],
  providers: [

  ]
})
export class LibNavbarModule {
  constructor() {

  }
}
