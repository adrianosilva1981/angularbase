import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MglTimelineModule } from 'angular-mgl-timeline';
import { NguCarouselModule } from '@ngu/carousel';
import { LibServicesModule } from 'lib-services';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/components/dropdown/dropdown';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DataScrollerModule } from 'primeng/datascroller';
import { KeyFilterModule } from 'primeng/keyfilter';
import { LibComponentsModule } from 'lib-components';
import { TabViewModule } from 'primeng/tabview';
import { TableModule } from 'primeng/table';
import 'hammerjs';

import { AnswerQuestionnaireYouhubComponent } from './answer-questionnaire-youhub/answer-questionnaire-youhub.component';
import { RadioButtonModule, InputTextareaModule, CheckboxModule  } from 'primeng/primeng';

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
    TableModule,
    RadioButtonModule,
    InputTextareaModule,
    CheckboxModule
  ],
  declarations: [
    AnswerQuestionnaireYouhubComponent
  ],
  exports: [
    AnswerQuestionnaireYouhubComponent
  ],
  entryComponents: [
    AnswerQuestionnaireYouhubComponent
  ]
})
export class LibQuestionnaireModule { }
