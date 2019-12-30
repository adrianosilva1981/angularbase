import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material';

import { BroadcastEventService, HyperCookieService, LibServicesModule } from 'lib-services';
import { ActionAuthenticatedDirective } from './services/action-authenticated.directive';
import { LoginComponent } from './containers/enter-login/enter-login.component';
import { ForgotPasswordComponent } from './containers/forgot-password/forgot-password.component';
import { ModalContainerComponent } from './components/modal-container/modal-container.component';
import { EnterPasswordComponent } from './components/enter-password/enter-password.component';
import { NotRegisteredComponent } from './components/not-registered/not-registered.component';
import { MailNotConfirmedComponent } from './components/mail-not-confirmed/mail-not-confirmed.component';
import { ResetPasswordComponent } from './containers/reset-password/reset-password.component';
import { ConfirmEmailComponent } from './containers/confirm-email/confirm-email.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { CopyRightComponent } from './components/copy-right/copy-right.component';
import { TextMaskModule } from 'angular2-text-mask';
import { LibComponentsModule } from 'lib-components';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    LibServicesModule,
    BrowserAnimationsModule,
    MatDialogModule,
    TextMaskModule,
    LibComponentsModule
  ],
  declarations: [
    ActionAuthenticatedDirective,
    LoginComponent,
    ForgotPasswordComponent,
    ModalContainerComponent,
    EnterPasswordComponent,
    NotRegisteredComponent,
    MailNotConfirmedComponent,
    ResetPasswordComponent,
    ConfirmEmailComponent,
    NavBarComponent,
    CopyRightComponent
  ],
  entryComponents: [
    LoginComponent,
    ForgotPasswordComponent,
    ModalContainerComponent,
    ResetPasswordComponent,
    ConfirmEmailComponent
  ],
  exports: [ // EXPORTAR SOMENTE OS COMPONENTES QUE SERÃO UTILIZADOS AS TAGS NO HTML EX.: <lib-login-enter-login></lib-login-enter-login>
    ActionAuthenticatedDirective,
    LoginComponent,
    ModalContainerComponent
  ],
  providers: [
    ActionAuthenticatedDirective
  ]
})
export class LibLoginModule {
  constructor(
    private _actionAuthenticatedDirective: ActionAuthenticatedDirective,
    private _hyperCookieService: HyperCookieService
  ) {
    const _self = this;
    BroadcastEventService.event('openLoginModal').subscribe(
      data => {
        _self._actionAuthenticatedDirective.eventClick();
      }
    );

    BroadcastEventService.event('logout').subscribe(
      data => {
        this._hyperCookieService.deleteCookie_AUTH();
        this._hyperCookieService.deleteAllCookies();
        this._hyperCookieService.deleteCookie_GENERIC('backoffice');
        window.location.reload(true);
        BroadcastEventService.event('listenerLogoutComponent').emit(true);
      }
    );
  }
}
