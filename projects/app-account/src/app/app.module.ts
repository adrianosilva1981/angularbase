import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GrowlModule } from 'primeng/growl';
import { TextMaskModule } from 'angular2-text-mask';

import { LibLoginModule } from 'lib-login';
import { LibServicesModule } from 'lib-services';
import { LibNavbarModule } from 'lib-navbar';
import { LibComponentsModule } from 'lib-components';
import { LibExtractModule } from 'lib-extract';
import { environment } from '@env/app-account';

import { AppRouting } from '@app-account/app.routing';
import { HomeComponent } from '@app-account/pages/home/home.component';
import { ChangePersonalDataComponent } from '@app-account/pages/change-personal-data/change-personal-data.component';
import { PersonalDataComponent } from '@app-account/pages/personal-data/personal-data.component';
import { DefaultComponent } from '@app-account/layouts/default/default.component';
import { CleanComponent } from '@app-account/layouts/clean/clean.component';
import { MyAddressesComponent } from '@app-account/pages/my-addresses/my-addresses.component';
import { AddNewAddressesComponent } from '@app-account/pages/add-new-addresses/add-new-addresses.component';
import { DontKnowMyCepComponent } from '@app-account/componentes/dont-know-my-cep/dont-know-my-cep.component';
import { MyCreditCardsComponent } from '@app-account/pages/my-credit-cards/my-credit-cards.component';
import { AddNewCreditCardComponent } from '@app-account/pages/add-new-credit-card/add-new-credit-card.component';
import { MyPhotoComponent } from '@app-account/pages/my-photo/my-photo.component';
import { CropPhotoModalComponent } from '@app-account/pages/crop-photo-modal/crop-photo-modal.component';
import { AccountGuard } from '@app-account/guards/account.guard';
import { MatDialogModule } from '@angular/material';
import { ImageCropperModule } from 'ng2-img-cropper/index';

@NgModule({
  declarations: [
    AppComponent,
    DefaultComponent,
    CleanComponent,
    HomeComponent,
    ChangePersonalDataComponent,
    PersonalDataComponent,
    MyAddressesComponent,
    AddNewAddressesComponent,
    DontKnowMyCepComponent,
    MyCreditCardsComponent,
    AddNewCreditCardComponent,
    MyPhotoComponent,
    CropPhotoModalComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ImageCropperModule,
    ReactiveFormsModule,
    TextMaskModule,
    MatDialogModule,
    GrowlModule,
    LibLoginModule,
    LibServicesModule,
    LibNavbarModule,
    LibComponentsModule,
    LibExtractModule,
    AppRouting
  ],
  providers: [
    { provide: 'environments', useValue: environment },
    AccountGuard
  ],
  entryComponents: [DontKnowMyCepComponent, CropPhotoModalComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
