
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { LoginService } from '../../services/login.service';

@Component({
  selector: 'lib-login-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.less']
})
export class ResetPasswordComponent implements OnInit {

  public errorMessage = '';
  public showSuccess = false;
  public loading = false;
  public resetForm = new FormGroup({
    id: new FormControl(
      { value: '', disabled: false }, Validators.compose([Validators.required])
    ),
    hash: new FormControl(
      { value: '', disabled: false }, Validators.compose([Validators.required])
    ),
    pass: new FormControl(
      { value: '', disabled: false }, Validators.compose([Validators.required, Validators.minLength(6)])
    ),
    confPass: new FormControl(
      { value: '', disabled: false }, Validators.compose([Validators.required, Validators.minLength(6)])
    )
  });

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _loginService: LoginService
  ) { }

  ngOnInit() {
    this._activatedRoute.params.subscribe((params: any) => {
      this.resetForm.get('id').setValue(params['id']);
      this.resetForm.get('hash').setValue(params['hash']);
    });
  }

  submitResetForm() {
    if (this.resetForm.get('pass').value !== this.resetForm.get('confPass').value) {
      this.resetForm.get('confPass').setErrors({ 'mismatch': true });
    }
    if (this.resetForm.valid) {
      this.loading = true;
      this._loginService.resetPassword(this.resetForm.value).subscribe(
        (response: any) => {
          this.errorMessage = (Array.isArray(response.msg) ? response.msg[0] : response.msg);
          this.loading = false;

          if (response.return === true) {
            this.showSuccess = true;
          } else {
            this.resetForm.get('confPass').setErrors({ 'responseErrors': true });
            this.showSuccess = false;
          }
        },
        err => {
          this.loading = false;
          this.errorMessage = '* Ocorreu um erro. Atualize a página e tente novamente';
          this.resetForm.get('confPass').setErrors({ 'responseErrors': true });
          this.showSuccess = false;
        }
      );
    }
  }
}
