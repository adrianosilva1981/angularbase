
import { NgModule } from '@angular/core';
import { MglTimelineModule } from 'angular-mgl-timeline';
import 'hammerjs';
import { NguCarouselModule } from '@ngu/carousel';
import { LibServicesModule } from 'lib-services';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/components/dropdown/dropdown';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DataScrollerModule } from 'primeng/datascroller';
import { KeyFilterModule } from 'primeng/keyfilter';
import { AddCreditComponent } from './pages/add-credit/add-credit.component';
import { LibComponentsModule } from 'lib-components';
import { WithdrawComponent } from './pages/withdraw/withdraw.component';
import { TabViewModule } from 'primeng/tabview';
import { TableModule } from 'primeng/table';
import { ExtractComponent } from './pages/extract/extract.component';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    DropdownModule,
    LibServicesModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MglTimelineModule,
    NguCarouselModule,
    DataScrollerModule,
    KeyFilterModule,
    LibComponentsModule,
    TabViewModule,
    TableModule
  ],
  declarations: [
    ExtractComponent,
    AddCreditComponent,
    WithdrawComponent,
  ],
  exports: [
    ExtractComponent,
    AddCreditComponent,
    WithdrawComponent
  ]
})
export class LibExtractModule { }
