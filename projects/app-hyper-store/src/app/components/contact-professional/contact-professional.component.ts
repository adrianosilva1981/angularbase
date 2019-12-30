import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { environment } from '@env/app-hyper-store';
import { SharedService } from '@app-hyper-store/services/shared.service';
import { HyperToastsService } from 'lib-services';


@Component({
  selector: 'app-hyper-store-contact-professional',
  templateUrl: './contact-professional.component.html',
  styleUrls: ['./contact-professional.component.less']
})
export class ContactProfessionalComponent implements OnInit {
  public enableSend = false;
  public userData: any;

  public siteKey = environment.captcha_site_key;
  public secretKey = environment.captcha_secret_key;

  public registerForm = new FormGroup({
    name: new FormControl(
      { value: '', disabled: false }, Validators.compose([Validators.required])
    ),
    email: new FormControl(
      { value: '', disabled: false }, Validators.compose([Validators.required])
    ),
    message: new FormControl(
      { value: '', disabled: false }, Validators.compose([Validators.required])
    )
  });

  constructor(
    public dialogRef: MatDialogRef<ContactProfessionalComponent>,
    @Inject(MAT_DIALOG_DATA) public _data: any,
    private _sharedService: SharedService,
    private _hyperToastsService: HyperToastsService
  ) { }

  ngOnInit() {
    this.userData = this._sharedService.getUserData();
    if (this.userData) {
      this.registerForm.controls.name.setValue(this.userData.name);
      this.registerForm.controls.email.setValue(this.userData.mail);
    }
  }

  showResponse(evt) {
    const obj = {
      secret: this.secretKey,
      response: evt.response
    };

    if (evt.response) {
      this._sharedService.reCaptcha(obj).subscribe(
        (response: any) => {
          if (response.return) {
            this.enableSend = response.data.success;
          } else {
            this.enableSend = false;
          }
        },
        err => {
          this.enableSend = false;
        }
      );
    }
  }

  submitForm() {
    const obj = {
      email: this.registerForm.controls.email.value,
      emailReceiver: this._data.mail,
      id_user_to: this._data.id,
      message: this.registerForm.controls.message.value,
      name: this.registerForm.controls.name.value,
      nameReceiver: this._data.name,
      urlMe: 'https://dash.hyper.jobs/'
    };

    this._sharedService.sendMessageProfessional(obj).subscribe(
      (response: any) => {
        if (response.return === true) {
          this.dialogRef.close();
          this._hyperToastsService.addToast('success', 'Sucesso', 'Mensagem enviada com sucesso', );
        } else {
          this._hyperToastsService.addToast('warn', 'Atenção', response.msg);
        }
      },
      err => { this._hyperToastsService.addToast('error', 'Erro', err); }
    );
  }

}
