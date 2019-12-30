import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { TruncateModule } from 'ng2-truncate/dist/index';
import { RatingModule } from 'ngx-rating';

import { LibChatComponent } from './lib-chat.component';
import { LibServicesModule } from 'lib-services';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TruncateModule,
    BrowserAnimationsModule,
    MatDialogModule,
    CurrencyMaskModule,
    RatingModule,
    LibServicesModule
  ],
  declarations: [
    LibChatComponent
  ],
  exports: [
    LibChatComponent
  ]
})
export class LibChatModule { }
