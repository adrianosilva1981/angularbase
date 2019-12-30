import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TextMaskModule } from 'angular2-text-mask';
import { ImageCropperModule } from 'ng2-img-cropper';
import { NguCarouselModule } from '@ngu/carousel';
import { SplitButtonModule } from 'primeng/splitbutton';
import { DropdownModule } from 'primeng/dropdown';
import { KeyFilterModule } from 'primeng/keyfilter';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { HttpModule } from '@angular/http';

import { LibServicesModule } from 'lib-services';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { PhotoGalleryComponent } from './components/photo-gallery/photo-gallery.component';
import { MyInterceptor } from './services/my-interceptor';
import { ProgressInterceptorComponent } from './components/progress-interceptor/progress-interceptor.component';
import { ModalCropImageComponent } from './components/modal-crop-image/modal-crop-image.component';
import { UploadImageComponent } from './components/upload-image/upload-image.component';
import { RegisterComponent } from './components/products/register/register.component';
import { SupplierRegisterComponent } from './components/supplier-register/supplier-register.component';
import { PickListModule, ChipsModule, RadioButtonModule, ConfirmationService, TreeModule } from 'primeng/primeng';
import { InputMaskModule } from 'primeng/inputmask';
import { CheckboxModule } from 'primeng/checkbox';
import { EditorModule } from 'primeng/editor';
import { ModalFindCepComponent } from './components/dont-know-my-cep/modal-find-cep/modal-find-cep.component';
import { OpenFindCepComponent } from './components/dont-know-my-cep/open-find-cep/open-find-cep.component';
import { SelectInputSearchComponent } from './components/select-input-search/select-input-search.component';
import { JobsRegisterComponent } from './components/jobs/jobs-register/jobs-register.component';
import { EditProductComponent } from './components/products/edit-product/edit-product.component';
import { LibThumbnailProducctComponent } from './components/products/thumbnail-product/thumbnail-product.component';
import { TruncateModule } from 'ng2-truncate';
import { PaginatorModule } from 'primeng/paginator';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { VoucherComponent } from './components/voucher/voucher.component';
import { BoxLoginRegisterComponent } from './components/box-login-register/box-login-register.component';
import { JobsEditComponent } from './components/jobs/jobs-edit/jobs-edit.component';
import { ThumbnailServiceComponent } from './components/jobs/thumbnail-service/thumbnail-service.component';
import { StepsComponent } from './components/steps/steps.component';

@NgModule({
  imports: [
    HttpModule,
    CommonModule,
    BrowserModule,
    RouterModule,
    FormsModule,
    LibServicesModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    TextMaskModule,
    ImageCropperModule,
    SplitButtonModule,
    DropdownModule,
    KeyFilterModule,
    CheckboxModule,
    PickListModule,
    CurrencyMaskModule,
    ChipsModule,
    RadioButtonModule,
    InputMaskModule,
    NguCarouselModule,
    PaginatorModule,
    ConfirmDialogModule,
    TreeModule,
    EditorModule,
    TruncateModule
  ],
  declarations: [
    CheckoutComponent,
    BreadcrumbComponent,
    NotFoundComponent,
    PhotoGalleryComponent,
    ProgressInterceptorComponent,
    ModalCropImageComponent,
    ModalFindCepComponent,
    OpenFindCepComponent,
    UploadImageComponent,
    RegisterComponent,
    JobsRegisterComponent,
    SupplierRegisterComponent,
    SelectInputSearchComponent,
    EditProductComponent,
    LibThumbnailProducctComponent,
    VoucherComponent,
    BoxLoginRegisterComponent,
    JobsEditComponent,
    StepsComponent,
    ThumbnailServiceComponent
  ],
  exports: [
    CheckoutComponent,
    BreadcrumbComponent,
    NotFoundComponent,
    PhotoGalleryComponent,
    ProgressInterceptorComponent,
    ModalCropImageComponent,
    ModalFindCepComponent,
    OpenFindCepComponent,
    UploadImageComponent,
    RegisterComponent,
    JobsRegisterComponent,
    SupplierRegisterComponent,
    SelectInputSearchComponent,
    EditProductComponent,
    VoucherComponent,
    JobsEditComponent,
    StepsComponent,
    BoxLoginRegisterComponent
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: MyInterceptor, multi: true },
    ConfirmationService
  ],
  entryComponents: [
    ModalCropImageComponent,
    ModalFindCepComponent,
    VoucherComponent
  ]
})
export class LibComponentsModule {
  constructor() {

  }
}
