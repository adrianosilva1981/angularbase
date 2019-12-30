import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SharedService } from '@app-back-office/services/shared.service';
import { HyperToastsService } from 'lib-services';

@Component({
  selector: 'app-back-office-galaxia-register',
  templateUrl: './galaxia-register.component.html',
  styleUrls: ['./galaxia-register.component.less']
})
export class GalaxiaRegisterComponent implements OnInit {

  public objuser: any = {};

  public registerForm = new FormGroup({
    email: new FormControl(
      { value: '', disabled: false }, Validators.compose([Validators.required])
    ),
    password: new FormControl(
      { value: '', disabled: false }, Validators.compose([Validators.required])
    ),
    conf_password: new FormControl(
      { value: '', disabled: false }, Validators.compose([Validators.required])
    ),
    name: new FormControl(
      { value: '', disabled: false }, Validators.compose([Validators.required])
    ),
    last_name: new FormControl(
      { value: '', disabled: false }, Validators.compose([Validators.required])
    )
  });

  constructor(
    private _sharedService: SharedService,
    private _hyperToastsService: HyperToastsService
  ) {
    this.objuser = this._sharedService.getCookieReseller();
  }

  ngOnInit() {
    this.registerForm.get('email').setValue(this.objuser.email);
  }

  submitForm() {
    if (this.registerForm.get('conf_password').value !== this.registerForm.get('password').value) {
      this.registerForm.get('password').setErrors({ 'mismatch': true });
      this.registerForm.get('conf_password').setErrors({ 'mismatch': true });
    }
    if (this.registerForm.valid) {
      this.registerUser(this.registerForm.value);
    }
  }

  registerUser(obj) {
    this._sharedService.galaxiaRegister(obj).subscribe(
      response => {
        if (response.return) {
          this._hyperToastsService.addToast('success', 'Sucesso', 'Sucesso');
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
