import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HyperToastsService } from 'lib-services';
import { SharedService } from '@app-hyper-store/services/shared.service';
import { environment } from '@env/app-hyper-store';

@Component({
  selector: 'app-hyper-store-contact-provider',
  templateUrl: './contact-provider.component.html',
  styleUrls: ['./contact-provider.component.less']
})
export class ContactProviderComponent implements OnInit {
  public enableSend = false;
  public siteKey = environment.captcha_site_key;
  public secretKey = environment.captcha_secret_key;
  public maskCel = ['(', /[1-9]/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];

  public contactForm = new FormGroup({
    name: new FormControl(
      { value: '', disabled: false }, Validators.compose([Validators.required])
    ),
    phone: new FormControl(
      { value: '', disabled: false }, Validators.compose([Validators.required])
    ),
    email: new FormControl(
      { value: '', disabled: false }, Validators.compose([Validators.required])
    )
  });

  constructor(
    private _hyperToastsService: HyperToastsService,
    private _sharedService: SharedService,
  ) { }

  ngOnInit() {
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

  validForm() {
    let error = true;
    if (!this.validEmail(this.contactForm.controls.email.value)) {
      this._hyperToastsService.addToast('warn', 'Atenção', 'Preencha um e-mail válido');
      error = false;
    }

    return error;
  }

  validEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  submitForm() {
    if (this.validForm()) {
      const obj = {
        name: this.contactForm.controls.name.value,
        cellphone: this.contactForm.controls.phone.value,
        email: this.contactForm.controls.email.value,
        source: 'hyper-store-new-provider'
      };

      this._sharedService.registerLead(obj).subscribe(
        (response: any) => {
          if (response.return === true) {
            this._hyperToastsService.addToast('success', 'Sucesso', 'Mensagem enviada com sucesso');
            this.contactForm.reset();
          } else {
            this._hyperToastsService.addToast('warn', 'Atenção', response.msg);
          }
        },
        err => { this._hyperToastsService.addToast('error', 'Erro', err); }
      );
    }
  }
}
