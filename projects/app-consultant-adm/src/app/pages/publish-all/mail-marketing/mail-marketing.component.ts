import { Component, OnInit } from '@angular/core';
import { SharedService } from '@app-consultant-adm/services/shared.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HyperToastsService } from 'lib-services';
import { Router } from '@angular/router';
import { ArrayType } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-consultant-adm-mail-marketing',
  templateUrl: './mail-marketing.component.html',
  styleUrls: ['./mail-marketing.component.less']
})
export class MailMarketingComponent implements OnInit {

  public publicity: any; // Campanha sendo configurada

  public info: any;
  public registerForm: FormGroup;

  public textError = true;

  constructor(
    private _router: Router,
    private _sharedService: SharedService,
    private _hyperToastsService: HyperToastsService
  ) {
    // Obter campanha
    this.publicity = this._sharedService.getPublish();

    if (this.publicity === undefined) {
      this._router.navigate(['/publish']);
    }
  }

  ngOnInit() {
    this._sharedService.addBreadCrumb(
      [
        { 'text': 'Dashboard', 'router': '/home' },
        { 'text': 'Publicidades', 'router': '/publish' },
        { 'text': 'Configuração - E-mail Marketing', 'router': '' },
      ]
    );

    this.info = {
      title: this.publicity.email,
      description: 'Page View Contratadas'
    };

    this.registerForm = new FormGroup({
      title: new FormControl(
        { value: '', disabled: false }, Validators.compose([Validators.required, Validators.minLength(6)])
      ),
      description: new FormControl(
        { value: '', disabled: false }, Validators.compose([Validators.required, Validators.minLength(20)])
      ),
    });

    // Obter E-mail já cadastrado
    this._sharedService.getMailMarketingByAds(this.publicity.id).subscribe(
      response => {
        if (response.return) {
          this.registerForm.controls.title.setValue(response.data.title);
          this.registerForm.controls.description.setValue(response.data.body);
        }
      },
      err => { this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro.'); }
    );
  }

  validText(event) {
    if (event.textValue.length < 150) {
      this.textError = true;
    } else {
      this.textError = false;
    }
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const data = this.registerForm.value;
      data.idAds = this.publicity.id;

      this._sharedService.saveEmailMarketing(data).subscribe(
        response => {
          if (response.return) {
            this._hyperToastsService.addToast('success', 'Sucesso', response.msg);
          } else {
            this._hyperToastsService.addToast('warn', 'Atenção', response.msg);
          }
        },
        err => { this._hyperToastsService.addToast('error', 'Erro', 'Ocorreu um erro.'); }
      );
    }
  }
}
