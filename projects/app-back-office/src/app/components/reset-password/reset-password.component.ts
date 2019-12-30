import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { PasswordValidation } from '@app-back-office/validator/password-validator';
import { Router, ActivatedRoute } from '@angular/router';
import { HyperToastsService } from 'lib-services';
import { SharedService } from '@app-back-office/services/shared.service';


@Component({
  selector: 'app-back-office-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.less']
})
export class ResetPasswordComponent implements OnInit {

  public formGroup1: FormGroup;
  public token: string;

  public hide = false;
  public hide1 = false;

  constructor(
    private _fb: FormBuilder,
    private _router: Router,
    private _route: ActivatedRoute,
    private _sharedService: SharedService,
    private _hyperToastsService: HyperToastsService,
  ) {
    this.token = this._route.snapshot.url[1].path;
  }

  ngOnInit() {

    this.formGroup1 = this._fb.group({
      passControl: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassControl: ['', [Validators.required, Validators.minLength(6)]]
    }, {
        validator: PasswordValidation.MatchPassword
      });

  }

  goBack() {
    this._router.navigate(['office/login']);
  }

  resend() {
    this._router.navigate(['office/forgotpassword']);
  }

  reset() {
    const obj = {
      token: this.token,
      password: this.formGroup1.controls.passControl.value,
      confirmpassword: this.formGroup1.controls.confirmPassControl.value
    };

    this._sharedService.resetPassword(obj).subscribe(response => {
      if (response.return) {
        this._hyperToastsService.addToast('success', 'Sucesso', response.msg);
      } else {
        this._hyperToastsService.addToast('warn', 'Atenção', response.msg);
      }
    },
      err => {
        this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro inesperado. Atualize a página e tente novamente');
      }
    );
  }

}
