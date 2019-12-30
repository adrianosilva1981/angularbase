import { Component, OnInit, Input } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { HyperToastsService } from 'lib-services';
import { SharedService } from '@app-back-office/services/shared.service';

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

@Component({
  selector: 'app-back-office-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.less']
})
export class ForgotPasswordComponent implements OnInit {

  public forgotFormControl: FormGroup;
  public mailLoading = false;
  public mailCheck = false;
  public mailCheckfalse = false;

  constructor(
    private _fb: FormBuilder,
    private _router: Router,
    private _sharedService: SharedService,
    private _hyperToastsService: HyperToastsService,
  ) {

    this.forgotFormControl = this._fb.group({
      emailFormControl: new FormControl('',
        [
          Validators.required,
          Validators.pattern(EMAIL_REGEX)
        ]
      )
    });

  }

  ngOnInit() {
  }

  goBack() {
    this._router.navigate(['office/login']);
  }

  send() {
    const obj = {
      email: this.forgotFormControl.controls.emailFormControl.value,
    };

    this.mailLoading = true;
    this.mailCheck = false;
    this.mailCheckfalse = false;
    this._sharedService.forgotPassword(obj).subscribe(response => {
      if (response.return) {
        this._hyperToastsService.addToast('success', 'Sucesso', response.msg);
        this.mailLoading = false;
        this.mailCheck = true;
        this.mailCheckfalse = false;
      } else {
        this._hyperToastsService.addToast('warn', 'Atenção', response.msg);
        this.mailLoading = false;
        this.mailCheck = false;
        this.mailCheckfalse = true;
      }
    },
      err => {
        this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro inesperado. Atualize a página e tente novamente');
        this.mailLoading = false;
        this.mailCheck = false;
        this.mailCheckfalse = true;
      }
    );
  }

}
