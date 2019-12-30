import { Router } from '@angular/router';
import { HyperToastsService } from 'lib-services';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SharedService } from '@app-admin-back-office/services/shared.service';

@Component({
  selector: 'app-admin-back-office-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.less']
})
export class ChangePasswordComponent implements OnInit {

  changePassword = new FormGroup({
    oldPassword: new FormControl('', [Validators.minLength(6), Validators.maxLength(20)]),
    newPassword: new FormControl('', [Validators.minLength(6), Validators.maxLength(20)]),
    confirmNewPassword: new FormControl('', [Validators.minLength(6), Validators.maxLength(20)]),
  });
  fop = false;
  fnp = false;
  fcnp = false;

  constructor(
    private _sharedService: SharedService,
    private _hyperToastsService: HyperToastsService,
    private _router: Router,
  ) {

  }

  ngOnInit() {
  }

  requestChangePassword() {
    if (this.changePassword.controls['newPassword'].value !== this.changePassword.controls['confirmNewPassword'].value) {
      this._hyperToastsService.addToast('warn', 'Atenção', 'Senha digitada no campo Nova Senha não confere com a Confirmada!');
      return;
    } else if (this.changePassword.controls['newPassword'].value === this.changePassword.controls['oldPassword'].value) {
      this._hyperToastsService.addToast('warn', 'Atenção', 'Senha digitada no campo Nova Senha é igual a Senha atual!');
      return;
    }
    const data = {
      oldPassword: this.changePassword.controls['oldPassword'].value,
      newPassword: this.changePassword.controls['newPassword'].value,
      confirmNewPassword: this.changePassword.controls['confirmNewPassword'].value,
    };
    this._sharedService.requestChangePassword(data).subscribe(
      response => {
        if (response.return) {
          this._hyperToastsService.addToast('success', 'Sucesso', response.msg);
          this._router.navigate(['/']);
        } else {
          this._hyperToastsService.addToast('warn', 'Atenção', response.msg);
        }
      },
      err => {
        this._hyperToastsService.addToast('error', 'Error', 'Aconteceu algum problema entre em contato com o Suporte!');
        console.error(err);
      }
    );
  }

  checkPassword(select, event) {
    switch (select) {
      case 'op':
        if (event.type == 'click') {
          this.fop = !this.fop;
        } else {
          this.fop = false;
        }
        break;
      case 'np':
        if (event.type == 'click') {
          this.fnp = !this.fnp;
        } else {
          this.fnp = false;
        }
        break;
      case 'cnp':
        if (event.type == 'click') {
          this.fcnp = !this.fcnp;
        } else {
          this.fcnp = false;
        }
        break;
    }
  }

}
