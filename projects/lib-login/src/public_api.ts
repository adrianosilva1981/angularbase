/*
 * Public API Surface of lib-login
 */

// Se eu for utilizar diretamente o componente (exemplo na rota) eu devo exportar aqui
// Se eu for utilizar apenas a tag do componente nao coloco aqui deixo somente no exports: [] no modulo

export { ResetPasswordComponent } from './lib/containers/reset-password/reset-password.component';
export { ForgotPasswordComponent } from './lib/containers/forgot-password/forgot-password.component';
export { ConfirmEmailComponent } from './lib/containers/confirm-email/confirm-email.component';
export { LoginComponent } from './lib/containers/enter-login/enter-login.component';

export * from './lib/lib-login.module';
