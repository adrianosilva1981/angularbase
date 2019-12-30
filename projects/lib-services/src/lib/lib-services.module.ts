import { NgModule } from '@angular/core';
import { BrowserCookiesModule } from '@ngx-utils/cookies/browser';
import { GrowlModule } from 'primeng/growl';
import { ConversionPipe } from './pipes/conversion.pipe';
import { MessageService } from 'primeng/components/common/messageservice';
import { ClickOutsideDirective } from './directives/click-outside.directive';
import { SafeHtmlPipe } from './pipes/safe-html.pipe';
@NgModule({
  imports: [
    BrowserCookiesModule.forRoot(),
    GrowlModule
  ],
  declarations: [
    ConversionPipe,
    ClickOutsideDirective,
    SafeHtmlPipe
  ],
  exports: [
    ConversionPipe,
    ClickOutsideDirective,
    SafeHtmlPipe
  ],
  providers: [
    ConversionPipe,
    ClickOutsideDirective,
    MessageService
  ]
})
export class LibServicesModule {
  constructor() {

  }
}
