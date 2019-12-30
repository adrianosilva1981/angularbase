import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { LibLoginModule } from 'lib-login';
import { LibServicesModule } from 'lib-services';

import { environment } from './../environments/environment';
import { AppComponent } from '@app-universal/app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    LibServicesModule,
    LibLoginModule
  ],
  providers: [
    { provide: 'environments', useValue: environment }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
