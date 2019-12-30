import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { PasswordValidation } from '@app-back-office/validator/password-validator';
import { HyperToastsService } from 'lib-services';
import { SharedService } from '@app-back-office/services/shared.service';

@Component({
  selector: 'app-back-office-new-countersign',
  templateUrl: './new-countersign.component.html',
  styleUrls: ['./new-countersign.component.less']
})
export class NewCountersignComponent implements OnInit {

  public formGroup1: FormGroup;
  public token: string;

  public hide = false;
  public hide1 = false;
  public hide2 = false;

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
      youPassControl: ['', [Validators.required, Validators.minLength(6)]],
      passControl: ['', [Validators.required, Validators.minLength(4)]],
      confirmPassControl: ['', [Validators.required, Validators.minLength(4)]]
    }, {
        validator: PasswordValidation.MatchPassword
      });
  }

  goBack() {
    this._router.navigate(['office/login']);
  }

  newcountersign() {
    const obj = {
      token: this.token,
      youpassword: this.formGroup1.controls.youPassControl.value,
      password: this.formGroup1.controls.passControl.value,
      confirmcountersign: this.formGroup1.controls.confirmPassControl.value
    };

    this._sharedService.NewCounterSign(obj).subscribe(response => {
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
